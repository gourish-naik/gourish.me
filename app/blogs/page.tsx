import { fetchBlogsFromCMS, BlogPost } from '@/lib/blog-data';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { features } from '../../config/features';
import { notFound } from 'next/navigation';

const BATCH_SIZE = 6;

export default async function BlogsPage() {
  if (!features.IS_BLOG_ENABLED) {
    notFound();
  }

  const t = await getTranslations();
  const initialBlogs = await fetchBlogsFromCMS(BATCH_SIZE);
  // const allTags = await fetchAllTagsFromCMS();
  // console.log("All Tags:", allTags);

  return (
    <section className='pb-24 pt-23'>
      <div className="container max-w-3xl py-12">
        <h1 className="title mb-12">{t('blogs')}</h1>

        {/* Tag Filter Placeholder */}
        <div className="mb-8">
          {/* <BlogTagFilter tags={allTags} /> */}
          <p>Tag Filter will go here.</p>
        </div>

        {/* Blog List */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {initialBlogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>

        {/* Infinite Scroll Placeholder */}
        <div className="mt-12 text-center">
          {/* <InfiniteScrollBlogs initialBlogs={initialBlogs} /> */}
          <p>Infinite Scroll will go here.</p>
        </div>
      </div>
    </section>
  );
}

function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block shine">
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden h-full flex flex-col">
        <div className="relative w-full h-48">
          {blog.coverImage && (
            <Image
              src={blog.coverImage.url}
              alt={blog.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h2>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3 flex-grow">
            {blog.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
            <span>{blog.author.name}</span>
            <span>{new Date(blog.date).toLocaleDateString()}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {blog.tags.map((tag) => (
              <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
