'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Slider from 'react-slick'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Project } from '@/lib/projects'
import { formateDate } from '@/lib/utils'


export default function Projects({ projects, onSlideChange }: { projects: Project[], onSlideChange: (index: number) => void }) {


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (current: number) => {
      onSlideChange(current)
    }
  }

  return (
    <div className="w-[550px] max-w-3xl mx-auto px-4">
      <Slider {...sliderSettings}>
        {projects.map(({metadata}) => {
          return (
            <div key={metadata.slug}>
              <div className="relative w-full sm:w-[500px] mx-auto">

                {metadata.image && (
                  <div className="relative h-80 w-full overflow-hidden bg-muted">
                    <Image
                      src={metadata.image}
                      alt={metadata.title || 'project'}
                      fill
                      className="rounded-lg object-cover object-center transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="absolute inset-[0px] rounded-lg opacity-100 transition-opacity duration-500 bg-linear-to-t from-gray-300 to-transparent/70  dark:from-stone-800 dark:to-transparent/70" />
                <Link href={`/projects/${metadata.slug}`} className='group'>
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 px-6 py-5 opacity-100 transition-all duration-500 group-hover:translate-y-0">
                    <h2 className="title line-clamp-1 text-xl no-underline group-hover:text-2xl transition-all duration-300 ease-in-out">
                      {metadata.title}
                    </h2>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {metadata.summary}
                    </p>
                    <p className="text-xs font-light text-muted-foreground">
                      {formateDate(metadata.timePeriod ?? '')}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

{/* <ul className=' grid grid-cols-1 gap-8 sm:grid-cols-2'>
{projects.map(project => (
  <li key={project.slug} className='group relative'>
    <Link href={`/projects/${project.slug}`}>
      {project.image && (
        <div className='h-80 w-full overflow-hidden bg-muted sm:h-60'>
          <Image
            src={project.image}
            alt={project.title || 'project'}
            fill
            className='rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-105'
          />
        </div>
      )}
      <div className='absolute inset-[1px] rounded-lg bg-background/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

      <div className='absolute inset-x-0 bottom-0 translate-y-2 px-6 py-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
        <h2 className='title line-clamp-1 text-xl no-underline'>
          {project.title}
        </h2>
        <p className='line-clamp-1 text-sm text-muted-foreground'>
          {project.summary}
        </p>
        <p className='text-xs font-light text-muted-foreground'>
          {formateDate(project.timePeriod ?? '')}
        </p>
      </div>
    </Link>
  </li>
))}
</ul> */}
