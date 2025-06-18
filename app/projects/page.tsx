import React from 'react';
import { getProjects } from '@/lib/projects';
import ProjectsRender from './projects';
import '@/styles/components/projects.scss';
// import { getTranslations } from 'next-intl/server'; // Removed
// import { unstable_setRequestLocale } from 'next-intl/server'; // Removed

interface ProjectsPageProps {
  // params: { // locale no longer needed
  //   locale: string;
  // };
}

export async function generateMetadata(/*{ params: { locale } }: ProjectsPageProps*/) {
  // const t = await getTranslations({ locale, namespace: 'ProjectsPage' }); // Removed
  return {
    title: "My Projects", // Static English title
  };
}

export default async function ProjectsPage(/*{ params: { locale } }: ProjectsPageProps*/) {
  // Enable static rendering
  // unstable_setRequestLocale(locale); // Removed

  const projects = await getProjects();
  // const t = await getTranslations({ locale, namespace: 'ProjectsPage' }); // Removed

  return (
    <section className='py-24'> {/* Adjusted padding */}
      <div className="container max-w-3xl">
        <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-12'>
          My Projects {/* Static English title */}
        </h1>
        <ProjectsRender projects={projects} />
      </div>
    </section>
  )
}
