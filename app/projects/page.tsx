import React from 'react';
import { getProjects } from '@/lib/projects';
import ProjectsRender from './projects';
import '@/styles/components/projects.scss';
import { getTranslations } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';

interface ProjectsPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: ProjectsPageProps) {
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' });
  return {
    title: t('title'),
  };
}

export default async function ProjectsPage({ params: { locale } }: ProjectsPageProps) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const projects = await getProjects();
  const t = await getTranslations({ locale, namespace: 'ProjectsPage' });

  return (
    <section className='py-24'> {/* Adjusted padding */}
      <div className="container max-w-3xl">
        <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-12'>
          {t('title')}
        </h1>
        <ProjectsRender projects={projects} />
      </div>
    </section>
  )
}
