import React from 'react';
import { getAllWorks } from '@/lib/work';
import WorkRender from './WorkRender'; // This component will be created next
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

// Assuming '@/styles/components/projects.scss' might contain relevant styles
import '@/styles/components/projects.scss';

interface WorkPageProps {
  params: {
    locale: string;
  };
}

export async function generateMetadata({ params: { locale } }: WorkPageProps) {
  const t = await getTranslations({ locale, namespace: 'WorkPage' });
  return {
    title: t('title'),
  };
}

export default async function WorksPage({ params: { locale } }: WorkPageProps) {
  // Enable static rendering
  setRequestLocale(locale);

  const works = await getAllWorks();
  const t = await getTranslations({ locale, namespace: 'WorkPage' });

  return (
    <section className='py-24'>
      <div className="container max-w-3xl">
        <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-12'>
          {t('title')}
        </h1>
        <WorkRender works={works} />
      </div>
    </section>
  );
}
