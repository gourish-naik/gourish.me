import React from 'react';
import { getAllWorks } from '@/lib/work';
import WorkRender from './WorkRender';
// import { getTranslations } from 'next-intl/server'; // Removed
// import { unstable_setRequestLocale } from 'next-intl/server'; // Removed

// Assuming '@/styles/components/projects.scss' might contain relevant styles
import '@/styles/components/projects.scss';

interface WorkPageProps {
  // params: { // locale no longer needed
  //   locale: string;
  // };
}

export async function generateMetadata(/*{ params: { locale } }: WorkPageProps*/) {
  // const t = await getTranslations({ locale, namespace: 'WorkPage' }); // Removed
  return {
    title: "My Work", // Static English title
  };
}

export default async function WorksPage(/*{ params: { locale } }: WorkPageProps*/) {
  // unstable_setRequestLocale(locale); // Removed

  const works = await getAllWorks();
  // const t = await getTranslations({ locale, namespace: 'WorkPage' }); // Removed

  return (
    <section className='py-24'>
      <div className="container max-w-3xl">
        <h1 className='text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-12'>
          My Work {/* Static English title */}
        </h1>
        <WorkRender works={works} />
      </div>
    </section>
  );
}
