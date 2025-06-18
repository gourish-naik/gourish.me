import { getExperienceBySlug, Experience, ExperienceProject } from '@/lib/experience';
import MDXContent from '@/components/mdx-content';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Assuming Badge component exists for technologies
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server'; // For dynamic metadata

// Define params type
interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const experience = await getExperienceBySlug(params.slug);
  const t = await getTranslations();

  if (!experience) {
    return {
      title: t('experience.notFoundMetaTitle') || "Experience Not Found",
    };
  }
  return {
    title: `${experience.companyName} - ${experience.role}`,
    description: `Details about the role at ${experience.companyName} as ${experience.role}, including projects and responsibilities.`,
  };
}

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { slug } = params;
  const experience = await getExperienceBySlug(slug);
  const t = await getTranslations(); // For "Back to experiences" or other UI strings if needed

  if (!experience) {
    notFound();
  }

  const { companyName, role, period, logoUrl, content, projects } = experience;

  return (
    <section className="py-24">
      <div className="container max-w-3xl">
        <Link
          href="/experience"
          className='inline-flex items-center mb-8 text-sm font-normal text-zinc-500 dark:text-zinc-400 hover:text-blue-300 transition-colors'>
          <ArrowLeftIcon className='h-5 w-5 mr-1' />
          {t('experience.backLink') || "Back to experiences"}
        </Link>

        <header className="mb-10">
          {logoUrl && (
            <div className="mb-6 w-24 h-24 relative"> {/* Basic styling for logo */}
              <img src={logoUrl} alt={`${companyName} logo`} className="rounded-md object-contain" />
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{companyName}</h1>
          <p className="mt-2 text-2xl text-muted-foreground">{role}</p>
          <p className="mt-1 text-md text-muted-foreground">{period}</p>
        </header>

        <main className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <MDXContent source={content} />
        </main>

        {projects && projects.length > 0 && (
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-8">
              {t('experience.projectsTitle') || "Key Projects"}
            </h2>
            <div className="space-y-6">
              {projects.map((project: ExperienceProject, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-foreground">
                          {t('experience.technologiesTitle') || "Technologies Used:"}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="px-2 py-1 text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
