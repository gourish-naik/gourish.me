import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Project, ProjectMetadata } from './projects';

const rootDir = path.join(process.cwd(), 'content', 'work')

export type WorkProject = Project & {
  metadata: ProjectMetadata & {
    company?: string;
    self?: string;
  }
};

export async function getWorkProjectBySlug(slug: string): Promise<WorkProject | null> {
  try {
    const filePath = path.join(rootDir, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const { data, content } = matter(fileContent)
    return { metadata: { ...data, slug } as WorkProject['metadata'], content }
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getWorkProjects(): Promise<WorkProject[]> {
  const files = fs.readdirSync(rootDir)

  const projects = await Promise.all(
    files.map(file => getWorkProjectBySlug(file.replace(/\.mdx$/, '')))
  )

  const validProjects = projects.filter((p): p is WorkProject => p !== null && p.metadata.self === 'company');

  validProjects.sort((a, b) => {
    return (
      new Date(a.metadata.timePeriod ?? '').getTime() -
      new Date(b.metadata.timePeriod ?? '').getTime()
    )
  })

  return validProjects;
}

export async function getGroupedWorkProjects(): Promise<Record<string, WorkProject[]>> {
  const projects = await getWorkProjects();
  const grouped: Record<string, WorkProject[]> = {};

  projects.forEach(project => {
    const company = project.metadata.company;
    if (company) {
      if (!grouped[company]) {
        grouped[company] = [];
      }
      grouped[company].push(project);
    }
  });

  return grouped;
}