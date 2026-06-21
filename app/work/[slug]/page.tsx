import { getWorkProjectBySlug } from '@/lib/work';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

type tParams = Promise<{ slug: string }>;

export default async function WorkProjectPage(props: { params: tParams }) {
  const { slug } = await props.params;
  const entry = await getWorkProjectBySlug(slug);

  if (!entry) notFound();

  // If it has a linked project page, redirect there
  if (entry.projectSlug) redirect(`/projects/${entry.projectSlug}`);

  return (
    <section className="pb-24 pt-23">
      <div className="container max-w-3xl py-12">
        <Link
          href="/work"
          className="inline-flex items-center mb-8 text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to work
        </Link>
        <h1 className="title">{entry.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{entry.summary}</p>
      </div>
    </section>
  );
}
