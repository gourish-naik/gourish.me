import MDXContent from '@/components/mdx-content';
import { getProjectBySlug } from '@/lib/projects';
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type tParams = Promise<{ slug: string }>;

export default async function Project(props: { params: tParams }) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const { metadata, content } = project;
  const { title, image, summary } = metadata;

  return (
    <section className="pb-24 pt-23">
      <div className="container max-w-3xl">
        <Link
          href="/projects"
          className="inline-flex items-center mb-8 text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to projects
        </Link>

        {/* Hero image — full width, natural height, fades into content */}
        {image && (
          <div className="relative -mx-4 mb-0 sm:-mx-0">
            <Image
              src={image}
              alt={title || 'project'}
              width={0}
              height={0}
              sizes="(max-width: 768px) 100vw, 768px"
              className="w-full h-auto rounded-t-xl"
            />
            {/* Fade bottom of image into page background */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent rounded-t-xl" />
          </div>
        )}

        <header className={image ? '-mt-8 relative z-10' : ''}>
          <h1 className="title">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{summary}</p>
        </header>

        <main className="prose prose-lg dark:prose-invert mt-12">
          <MDXContent source={content} />
        </main>
      </div>
    </section>
  );
}
