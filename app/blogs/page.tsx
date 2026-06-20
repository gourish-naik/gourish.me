import { fetchBlogsFromCMS, fetchAllTagsFromCMS, BlogPost } from '@/lib/blog-data';
import { isValidTechTag } from '@/lib/tech-tags';
import { BlogTagFilter } from '@/components/blog-tag-filter';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';

const BATCH_SIZE = 20;

interface BlogsPageProps {
  searchParams: Promise<{ tags?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { tags: rawTags } = await searchParams;

  // Preserve original casing — Hygraph tag matching is case-sensitive
  const selectedTags = rawTags
    ? rawTags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const [blogs, fetchedTags] = await Promise.all([
    fetchBlogsFromCMS(BATCH_SIZE, 0, selectedTags.length > 0 ? selectedTags : undefined),
    fetchAllTagsFromCMS(),
  ]);

  // Only surface recognised technology tags in the filter — topic/content tags are excluded
  const allTags = fetchedTags.filter(isValidTechTag);

  const t = await getTranslations();

  return (
    <section className="pb-24 pt-23">
      <div className="container max-w-3xl py-12">
        <h1 className="title mb-12">{t('blogs')}</h1>

        {/* Tag Filter */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <BlogTagFilter allTags={allTags} selectedTags={selectedTags} />
          </Suspense>
        </div>

        {/* Blog List */}
        {blogs.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            {selectedTags.length > 0
              ? `No posts found for the selected tag${selectedTags.length > 1 ? 's' : ''}.`
              : 'No posts yet. Check back soon.'}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map(blog => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="relative h-48 w-full">
          {blog.coverImage && (
            <Image
              src={blog.coverImage.url}
              alt={blog.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex flex-grow flex-col p-4">
          <h2 className="line-clamp-2 text-xl font-semibold transition-colors group-hover:text-primary">
            {blog.title}
          </h2>
          <p className="mt-2 line-clamp-3 flex-grow text-sm text-muted-foreground">
            {blog.summary}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>{blog.author.name}</span>
            <span>{new Date(blog.date).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
