import { fetchBlogBySlugFromCMS, getBlogSlugs, fetchRelatedBlogs } from '@/lib/blog-data';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { features } from '../../../config/features';

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

function sanitizeHTML(html: string): string {
  return html
    // Fix double-encoded HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    // Remove malformed br closing tags
    .replace(/<br><br><\/p>/g, '</p>')
    .replace(/<br><\/p>/g, '</p>')
    // Remove stray br closing tags
    .replace(/<\/br>/g, '');
}

export default async function SingleBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTranslations();
  const { slug } = await params;
  const blog = await fetchBlogBySlugFromCMS(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await fetchRelatedBlogs(blog.slug, blog.tags);

  return (
    <section className='pb-24 pt-23'>
      <div className="container max-w-3xl py-12">
        {features.IS_BLOG_ENABLED && (
          <Link
            href="/blogs"
            className='inline-flex mb-8 text-sm font-normal text-zinc-500 dark:text-zinc-400 hover:text-blue-300 transition-colors move-left'>
            <ArrowLeftIcon className='h-5 w-5' />
            <span className='ml-1'>Back to Blogs</span>
          </Link>
        )}
        
        <article>
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center text-gray-500 text-sm mb-6">
            <span>By {blog.author.name}</span>
            <span className="mx-2">•</span>
            <span>{new Date(blog.date).toLocaleDateString()}</span>
          </div>

          {blog.coverImage && (
            <div className="relative w-full h-64 mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.coverImage.url}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(blog.content.html) }}
          />
        </article>

        {/* Related Blogs Section */}
        {features.IS_BLOG_ENABLED && relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('relatedBlogs') || 'Related Blogs'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link 
                  key={relatedBlog.slug} 
                  href={`/blogs/${relatedBlog.slug}`}
                  className="group block "
                >
                  <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {relatedBlog.coverImage && (
                      <div className="relative w-full h-48">
                        <Image
                          src={relatedBlog.coverImage.url}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-500 transition-colors">
                        {relatedBlog.title}
                      </h3>
                      {relatedBlog.summary && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {relatedBlog.summary}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}