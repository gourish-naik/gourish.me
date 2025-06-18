import React from 'react';
import { getBlogPostBySlug, getAllBlogPosts, BlogMetadata } from '@/lib/blog';
import MDXContent from '@/components/mdx-content';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // For tags

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }], // Example of adding author to metadata
    // openGraph: { // Example for social sharing
    //   title: post.title,
    //   description: post.excerpt,
    //   images: post.coverImage ? [{ url: post.coverImage }] : [],
    //   type: 'article',
    //   publishedTime: post.publicationDate,
    //   authors: [post.author],
    //   tags: post.tags,
    // }
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { title, publicationDate, author, coverImage, content, tags } = post;

  return (
    <section className="py-24">
      <div className="container max-w-3xl">
        <Link
          href="/blog"
          className='inline-flex items-center mb-8 text-sm font-normal text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors'>
          <ArrowLeftIcon className='h-5 w-5 mr-1' />
          Back to Blog
        </Link>

        <article>
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-4">
              {title}
            </h1>
            <div className="text-base text-muted-foreground">
              <span>By {author}</span>
              <span className="mx-2">&bull;</span>
              <time dateTime={publicationDate}>
                {new Date(publicationDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            {coverImage && (
              <div className="mt-8 relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={coverImage}
                  alt={`${title} cover image`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <MDXContent source={content} />
          </div>

          {tags && tags.length > 0 && (
            <footer className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </footer>
          )}
        </article>
      </div>
    </section>
  );
}
