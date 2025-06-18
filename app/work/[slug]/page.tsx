import MDXContent from '@/components/mdx-content';
import { getWorkBySlug } from '@/lib/work'; // Corrected import
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

// Define params type, assuming slug is a string
type Props = {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkPage({params}: Props) {
  const { slug } = await params; // Destructure slug directly

  const workItem = await getWorkBySlug(slug); // Corrected function call

  if (!workItem) {
    notFound();
  }

  const { metadata, content } = workItem;
  // Assuming WorkMetadata might have 'title', 'image', 'summary' similar to ProjectMetadata
  // Adjust these based on actual WorkMetadata structure if different
  const { title, image, summary, role, timePeriod } = metadata;

  return (
    <section className='pb-24 pt-23'> {/* Assuming pt-23 is a typo and should be pt-24 or similar */}
      <div className='container max-w-3xl'>
        <Link
          href="/work" // Link back to the main work page
          className='inline-flex mb-8 text-sm font-normal text-zinc-500 dark:text-zinc-400 hover:text-blue-300 transition-colors'>
          <ArrowLeftIcon className='h-5 w-5' />
          <span className='ml-1'>Back to work</span>
        </Link>
        {
          image && (
            <div className='relative mb-6 h-96 w-full overflow-hidden rounded-lg'>
              <Image
                src={image}
                alt={title || 'Work item image'} // Alt text
                className='object-cover'
                fill
              />
            </div>
          )
        }
        <header>
          <h1 className='title'>{title}</h1>
          {role && <p className='text-xl text-muted-foreground mt-1'>{role}</p>}
          {timePeriod && <p className='text-sm text-muted-foreground mt-1'>{timePeriod}</p>}
          {summary && <p className='mt-3 text-base text-muted-foreground'>{summary}</p>}
        </header>
        <main className='prose prose-lg dark:prose-invert mt-12'> {/* Adjusted margin top */}
          <MDXContent source={content} />
        </main>
      </div>
    </section>
  );
}
