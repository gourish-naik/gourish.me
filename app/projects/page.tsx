import React from 'react'
import { getProjects } from '@/lib/projects'
import ProjectList from './project-list'

const BATCH_SIZE = 4;

// interface ProjectsPageProps {
  // params: { // locale no longer needed
  //   locale: string;
  // };
// }

/*{ params: { locale } }: ProjectsPageProps*/
export async function generateMetadata() {
  return {
    title: 'Projects | Gourishankar Menavath',
    description: 'A selection of e-commerce and web projects built with React, Next.js, and Magento PWA Studio.',
    openGraph: {
      title: 'Projects | iGourish',
      description: 'A selection of e-commerce and web projects built with React, Next.js, and Magento PWA Studio.',
      url: 'https://igourish.in/projects',
      type: 'website',
      images: [{ url: '/images/og/projects.png', width: 1200, height: 630, alt: 'Projects | iGourish' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Projects | iGourish',
      description: 'A selection of e-commerce and web projects built with React, Next.js, and Magento PWA Studio.',
      images: ['/images/og/projects.png'],
    },
  };
}

/*{ params: { locale } }: ProjectsPageProps*/
export default async function ProjectsPage() {
  const initialProjects = await getProjects(BATCH_SIZE)

  return (
    <section className='pb-24 pt-40'>
      <div className="container max-w-3xl">
        <h1 className="title mb-12">All Projects</h1>
        <ProjectList initialProjects={initialProjects} />
      </div>
    </section>
  )
}
