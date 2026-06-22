'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

const SESSION_COOKIE = 'admin_session'
const SESSION_VALUE = 'authenticated'

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const password = formData.get('password')?.toString()
  if (password === process.env.ADMIN_PASSWORD) {
    const jar = await cookies()
    jar.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })
    redirect('/admin')
  }
  return 'Incorrect password.'
}

export async function logoutAction() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
  redirect('/admin')
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

// ── Blog mutations ────────────────────────────────────────────────────────────

const WRITE_URL = process.env.HYGRAPH_WRITE_URL || ''
const TOKEN = process.env.HYGRAPH_API_TOKEN || ''

async function hygraphMutation(query: string, variables: Record<string, unknown>) {
  const res = await fetch(WRITE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

export type BlogFormState =
  | { status: 'idle' }
  | { status: 'success'; slug: string }
  | { status: 'error'; message: string }

export async function createBlogPost(
  _prev: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const auth = await isAuthenticated()
  if (!auth) return { status: 'error', message: 'Not authenticated.' }

  const title = formData.get('title')?.toString().trim() || ''
  const slug = formData.get('slug')?.toString().trim() || ''
  const summary = formData.get('summary')?.toString().trim() || ''
  const content = formData.get('content')?.toString().trim() || ''
  const tagsRaw = formData.get('tags')?.toString().trim() || ''
  const rawDate = formData.get('date')?.toString()
  const date = rawDate ? new Date(rawDate).toISOString() : new Date().toISOString()

  if (!title || !slug || !summary || !content) {
    return { status: 'error', message: 'Title, slug, summary and content are required.' }
  }

  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const authorId = process.env.HYGRAPH_AUTHOR_ID
  if (!authorId) {
    return { status: 'error', message: 'HYGRAPH_AUTHOR_ID is not set in env. Add it to .env.local and Vercel.' }
  }

  try {
    // 1. Create the post (draft)
    const createData = await hygraphMutation(
      `mutation CreateBlogPost(
        $title: String!
        $slug: String!
        $summary: String!
        $content: RichTextAST!
        $date: DateTime!
        $tags: [String!]!
        $authorId: ID!
      ) {
        createBlogPost(data: {
          title: $title
          slug: $slug
          summary: $summary
          content: $content
          date: $date
          tags: $tags
          author: { connect: { id: $authorId } }
        }) {
          id
          slug
        }
      }`,
      {
        title,
        slug,
        summary,
        content: { html: content },
        date,
        tags,
        authorId,
      }
    )

    const id: string = createData.createBlogPost.id

    // 2. Publish immediately
    await hygraphMutation(
      `mutation PublishBlogPost($id: ID!) {
        publishBlogPost(where: { id: $id }) {
          id
        }
      }`,
      { id }
    )

    // 3. Bust the cache
    revalidateTag('blog')

    return { status: 'success', slug }
  } catch (err) {
    console.error('Blog create error:', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    // Surface Hygraph schema errors clearly
    return { status: 'error', message: `Hygraph error: ${msg}` }
  }
}
