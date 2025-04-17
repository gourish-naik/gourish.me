import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Project } from '@/lib/projects'
import { formateDate } from '@/lib/utils'

type Props = {
    projects:Project []
}

export default function HomeProjects(
  { projects }:Props) {
  return (
    <ul className=' grid grid-cols-1 gap-8 sm:grid-cols-2'>
      {projects.map(({metadata}) => (
        <li key={metadata.slug} className='group relative'>
          <Link href={`/projects/${metadata.slug}`}>
            {metadata.image && (
              <div className='h-80 w-full overflow-hidden bg-muted sm:h-60'>
                <Image
                  src={metadata.image}
                  alt={metadata.title || 'project'}
                  fill
                  className='rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-105'
                />
              </div>
            )}
            <div className='absolute inset-[1px] rounded-lg bg-background/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

            <div className='absolute inset-x-0 bottom-0 translate-y-2 px-6 py-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
              <h2 className='title line-clamp-1 text-xl no-underline'>
                {metadata.title}
              </h2>
              <p className='line-clamp-1 text-sm text-muted-foreground'>
                {metadata.summary}
              </p>
              <p className='text-xs font-light text-muted-foreground'>
                {formateDate(metadata.timePeriod ?? '')}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}