import { getGroupedWorkProjects } from '@/lib/work';
import { WorkProject } from '@/lib/work';
import Link from 'next/link';

async function WorkCard({ project }: { project: WorkProject }) {
  return (
    <Link href={`/work/${project.metadata.slug}`}>
      <div className="p-4 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <h3 className="text-lg font-bold">{project.metadata.title}</h3>
        <p className="text-sm text-gray-500">{project.metadata.summary}</p>
      </div>
    </Link>
  );
}

export default async function WorkPage() {
  const groupedProjects = await getGroupedWorkProjects();

  return (
    <section className="py-24">
      <div className="container max-w-3xl">
        <h1 className="title mb-12">Work Experience</h1>
        <div className="space-y-12">
          {Object.entries(groupedProjects).map(([company, projects]) => (
            <div key={company} className="relative">
              <div className="sticky top-20 z-10">
                <span className="inline-block bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-semibold">{company}</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {projects.map(project => (
                  <WorkCard key={project.metadata.slug} project={project} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
