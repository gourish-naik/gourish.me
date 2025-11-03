// app/blog/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import React from 'react';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog';
import MDXContent from '@/components/mdx-content';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: Promise<{ slug: string; }>;
};

// Metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // Await the params Promise
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
  };
}

// Static params generation
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Page Component
export default async function Page({ params }: Props) {
  const { slug } = await params; // Await the params Promise
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { title, publicationDate, author, coverImage, content, tags } = post;

  return (
    <section className="py-24">
      <div className="container max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center mb-8 text-sm font-normal text-zinc-500 dark:text-zinc-400 hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
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