import { getAllExperiences, ExperienceMetadata } from '@/lib/experience';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Assuming structure from typical shadcn/ui
import { getTranslations } from 'next-intl/server'; // For page title

export default async function ExperiencePage() {
  const experiences = await getAllExperiences();
  const t = await getTranslations(); // For localized title

  return (
    <section className="py-24">
      <div className="container max-w-3xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('experience.title') || "My Experience"} {/* Assuming a translation key */}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('experience.subtitle') || "A summary of my professional roles and projects."} {/* Assuming a translation key */}
          </p>
        </header>

        {experiences && experiences.length > 0 ? (
          <div className="space-y-8">
            {experiences.map((exp) => (
              <Link href={`/experience/${exp.slug}`} key={exp.slug} className="block group">
                <Card className="transition-all duration-200 ease-in-out group-hover:shadow-lg group-hover:border-primary/60">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold group-hover:text-primary">
                      {exp.companyName}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {exp.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{exp.period}</p>
                    {/* Optional: Could add a brief summary or number of projects here if available directly in metadata */}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {t('experience.none') || "No professional experience has been added yet."} {/* Assuming a translation key */}
          </p>
        )}
      </div>
    </section>
  );
}

// It's good practice to add generateMetadata for SEO, though not explicitly asked
export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: t('experience.metaTitle') || "My Professional Experience",
  };
}
