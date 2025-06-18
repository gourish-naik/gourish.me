import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts, } from '@/lib/blog';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'; // Assuming CardFooter might be useful for date/tags

export async function generateMetadata() {
  return {
    title: "Blog",
  };
}

export default async function BlogListPage() {
  const posts = await getAllBlogPosts();

  return (
    <section className="py-24">
      <div className="container max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            My thoughts on technology, web development, and more.
          </p>
        </header>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 ease-in-out group-hover:shadow-xl group-hover:border-primary/60">
                  {post.coverImage && (
                    <div className="relative w-full h-48">
                      <Image
                        src={post.coverImage}
                        alt={post.title || 'Blog post cover image'}
                        fill
                        className="object-cover"
                        // Consider adding placeholder if images might be slow or missing
                        // onError={(e) => e.currentTarget.style.display = 'none'} // Simple way to hide broken images
                      />
                    </div>
                  )}
                  <CardHeader className={post.coverImage ? '' : 'pt-6'}>
                    <CardTitle className="text-xl font-semibold group-hover:text-primary">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto pt-0 pb-4">
                    <div className="text-xs text-muted-foreground">
                      <p>By {post.author}</p>
                      <time dateTime={post.publicationDate}>
                        {new Date(post.publicationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No blog posts yet. Check back soon!
          </p>
        )}
      </div>
    </section>
  );
}
