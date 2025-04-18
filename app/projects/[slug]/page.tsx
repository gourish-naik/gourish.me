import MDXContent from '@/components/mdx-content';
import { getProjectBySlug } from '@/lib/projects';
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react'

type tParams = Promise<{ slug: string }>;

export default async function Project(props: { params: tParams }) {
  const { slug } = await props.params;

  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const { metadata, content } = project
  const { title, image, summary } = metadata
  return (
    <section className='pb-24 pt-23'>
      <div className='container max-w-3xl'>
        <Link
          href="/projects"
          className='inline-flex mb-8 text-sm font-normal text-zinc-500 dark:text-zinc-400 hover:text-blue-300 transition-colors'>
          <ArrowLeftIcon className='h-5 w-5' />
          <span className='ml-1'>Back to project&#39;s</span>
        </Link>
        {
          image && (
            <div className='relative mb-6 h-96 w-full overflow-hidden rounded-lg'>
              <Image
                src={image}
                alt={title || 'project'}
                className='object-cover'
                fill
              />
            </div>
          )
        }
        <header>
          <h1 className='title'>{title}</h1>
          <p className='mt-3 textxs text-muted-foreground'>
            {summary}
          </p>
        </header>
        <main className='prose prose-lg dark:prose-invert mt-16'>
          <MDXContent source={content} />
        </main>
      </div>
    </section>
  )
}
