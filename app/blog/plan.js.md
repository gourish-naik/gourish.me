// lib/contentful.ts
import { createClient } from 'contentful'

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export interface BlogPost {
  id: string
  title: string
  shortDescription: string
  content: string
  thumbnail: string
  images: string[]
  author: string
  resources: string[]
  references: string[]
  tags: string[]
  slug: string
}

export interface BlogListItem {
  id: string
  title: string
  shortDescription: string
  thumbnail: string
  tags: string[]
  slug: string
}

// Get all blogs for listing page
export async function getAllBlogs(): Promise<BlogListItem[]> {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    select: 'sys.id,fields.title,fields.shortDescription,fields.thumbnail,fields.tags,fields.slug'
  })

  return entries.items.map((item: any) => ({
    id: item.sys.id,
    title: item.fields.title,
    shortDescription: item.fields.shortDescription,
    thumbnail: item.fields.thumbnail?.fields?.file?.url || '',
    tags: item.fields.tags || [],
    slug: item.fields.slug
  }))
}

// Get single blog by slug
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1
  })

  if (entries.items.length === 0) return null

  const item = entries.items[0] as any
  
  return {
    id: item.sys.id,
    title: item.fields.title,
    shortDescription: item.fields.shortDescription,
    content: item.fields.content,
    thumbnail: item.fields.thumbnail?.fields?.file?.url || '',
    images: item.fields.images?.map((img: any) => img.fields.file.url) || [],
    author: item.fields.author,
    resources: item.fields.resources || [],
    references: item.fields.references || [],
    tags: item.fields.tags || [],
    slug: item.fields.slug
  }
}

// Get blogs by tag
export async function getBlogsByTag(tag: string): Promise<BlogListItem[]> {
  const entries = await client.getEntries({
    content_type: 'blogPost',
    'fields.tags[in]': tag,
    select: 'sys.id,fields.title,fields.shortDescription,fields.thumbnail,fields.tags,fields.slug'
  })

  return entries.items.map((item: any) => ({
    id: item.sys.id,
    title: item.fields.title,
    shortDescription: item.fields.shortDescription,
    thumbnail: item.fields.thumbnail?.fields?.file?.url || '',
    tags: item.fields.tags || [],
    slug: item.fields.slug
  }))
}

// app/blog/page.tsx
import { getAllBlogs, getBlogsByTag, BlogListItem } from '@/lib/contentful'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPageProps {
  searchParams: {
    tag?: string
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const blogs = searchParams.tag 
    ? await getBlogsByTag(searchParams.tag)
    : await getAllBlogs()

  // Get all unique tags for filter
  const allBlogs = await getAllBlogs()
  const allTags = [...new Set(allBlogs.flatMap(blog => blog.tags))]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      
      {/* Tag Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Tag:</h2>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/blog"
            className={`px-3 py-1 rounded-full text-sm ${
              !searchParams.tag 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </Link>
          {allTags.map(tag => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={`px-3 py-1 rounded-full text-sm ${
                searchParams.tag === tag
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {blogs.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No blogs found{searchParams.tag ? ` for tag "${searchParams.tag}"` : ''}.
        </p>
      )}
    </div>
  )
}

function BlogCard({ blog }: { blog: BlogListItem }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group">
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
        {blog.thumbnail && (
          <div className="relative h-48 w-full">
            <Image
              src={`https:${blog.thumbnail}`}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
          
          <p className="text-gray-600 mb-3 line-clamp-2">
            {blog.shortDescription}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}

// app/blog/[slug]/page.tsx
import { getBlogBySlug } from '@/lib/contentful'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug)
  
  if (!blog) {
    return {
      title: 'Blog Not Found'
    }
  }

  return {
    title: blog.title,
    description: blog.shortDescription,
    openGraph: {
      title: blog.title,
      description: blog.shortDescription,
      images: blog.thumbnail ? [`https:${blog.thumbnail}`] : []
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const blog = await getBlogBySlug(params.slug)

  if (!blog) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-8">
        {blog.thumbnail && (
          <div className="relative h-64 md:h-96 w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={`https:${blog.thumbnail}`}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <span>By {blog.author}</span>
        </div>
        
        <p className="text-xl text-gray-700 mb-4">{blog.shortDescription}</p>
        
        <div className="flex flex-wrap gap-2">
          {blog.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>

      {/* Additional Images */}
      {blog.images.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blog.images.map((image, index) => (
              <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={`https:${image}`}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Resources */}
      {blog.resources.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Resources</h2>
          <ul className="list-disc list-inside space-y-2">
            {blog.resources.map((resource, index) => (
              <li key={index} className="text-blue-600 hover:underline">
                <a href={resource} target="_blank" rel="noopener noreferrer">
                  {resource}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* References */}
      {blog.references.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">References</h2>
          <ul className="list-decimal list-inside space-y-2">
            {blog.references.map((reference, index) => (
              <li key={index} className="text-gray-700">
                {reference}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

// .env.local
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here

// package.json dependencies to add
// npm install contentful