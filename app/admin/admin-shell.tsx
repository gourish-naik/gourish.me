'use client'

import { useActionState } from 'react'
import { loginAction, logoutAction, createBlogPost, BlogFormState } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

// ── Password gate ─────────────────────────────────────────────────────────────

function LoginForm() {
  const [error, action, pending] = useActionState<string | null, FormData>(
    loginAction,
    null
  )
  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <form action={action} className='w-full max-w-xs space-y-4'>
        <h1 className='text-2xl font-bold'>Admin</h1>
        <Input
          name='password'
          type='password'
          placeholder='Password'
          required
          disabled={pending}
          autoFocus
          className='text-base'
        />
        {error && <p className='text-sm text-red-500'>{error}</p>}
        <Button type='submit' disabled={pending} className='w-full'>
          {pending ? 'Checking…' : 'Enter'}
        </Button>
      </form>
    </div>
  )
}

// ── Blog post form ────────────────────────────────────────────────────────────

function BlogForm() {
  const [state, action, pending] = useActionState<BlogFormState, FormData>(
    createBlogPost,
    { status: 'idle' }
  )

  function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  return (
    <div className='container max-w-2xl px-4 py-8 sm:py-12'>
      <div className='mb-8 flex flex-wrap items-center gap-3'>
        <h1 className='flex-1 text-2xl font-bold'>New Blog Post</h1>
        <div className='flex shrink-0 gap-2'>
          <Button asChild variant='ghost' size='sm'>
            <Link href='/blogs'>← View blogs</Link>
          </Button>
          <form action={logoutAction}>
            <Button variant='outline' size='sm' type='submit'>Sign out</Button>
          </form>
        </div>
      </div>

      {state.status === 'success' && (
        <div className='mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400'>
          Published!{' '}
          <Link href={`/blogs/${state.slug}`} className='underline'>
            View post →
          </Link>
        </div>
      )}

      {state.status === 'error' && (
        <div className='mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400'>
          {state.message}
        </div>
      )}

      <form action={action} className='space-y-5'>
        <div>
          <label className='mb-1.5 block text-sm font-medium'>Title</label>
          <Input
            name='title'
            placeholder='How I optimised Core Web Vitals across 6 storefronts'
            required
            disabled={pending}
            className='text-base'
            onChange={(e) => {
              const slugInput = e.currentTarget.form?.elements.namedItem('slug') as HTMLInputElement
              if (slugInput && !slugInput.dataset.edited) {
                slugInput.value = slugify(e.target.value)
              }
            }}
          />
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium'>Slug</label>
          <Input
            name='slug'
            placeholder='core-web-vitals-six-storefronts'
            required
            disabled={pending}
            className='text-base'
            onInput={(e) => {
              ;(e.currentTarget as HTMLInputElement).dataset.edited = 'true'
            }}
          />
          <p className='mt-1 text-xs text-muted-foreground'>Auto-filled from title. Edit if needed.</p>
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium'>Summary</label>
          <Input
            name='summary'
            placeholder='One-line description shown on the blog listing'
            required
            disabled={pending}
            className='text-base'
          />
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium'>Tags</label>
          <Input
            name='tags'
            placeholder='Next.js, Performance, Core Web Vitals'
            disabled={pending}
            className='text-base'
          />
          <p className='mt-1 text-xs text-muted-foreground'>Comma-separated.</p>
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium'>Date</label>
          <Input
            name='date'
            type='date'
            defaultValue={new Date().toISOString().split('T')[0]}
            required
            disabled={pending}
            className='text-base'
          />
        </div>

        <div>
          <label className='mb-1.5 block text-sm font-medium'>Content (HTML)</label>
          <textarea
            name='content'
            rows={18}
            required
            disabled={pending}
            placeholder={`<p>Start writing your post here.</p>\n\n<h2>Section heading</h2>\n<p>Content...</p>`}
            className='w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50'
          />
          <p className='mt-1 text-xs text-muted-foreground'>
            Write in HTML. Hygraph stores as RichText and renders it on the blog page.
          </p>
        </div>

        <Button type='submit' disabled={pending} className='w-full'>
          {pending ? 'Publishing…' : 'Publish post'}
        </Button>
      </form>
    </div>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export default function AdminShell({ authed }: { authed: boolean }) {
  if (!authed) return <LoginForm />
  return <BlogForm />
}
