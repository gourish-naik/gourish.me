import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const rootDir = path.join(process.cwd(), 'content', 'projects')

export type Project = {
  metadata: ProjectMetadata
  content: string
}
export type ProjectMetadata = {
  title?: string
  summary?: string
  image?: string
  timePeriod?: string
  slug: string
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const filePath = path.join(rootDir, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const { data, content } = matter(fileContent)
    return { metadata: { ...data, slug }, content }
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getProjects(limit?: number): Promise<ProjectMetadata[]> {
  const files = fs.readdirSync(rootDir)

  const projects = await Promise.all(
    files.map(file => getProjectMetaData(file))
  )

  projects.sort((a, b) => {
    return (
      new Date(a.timePeriod ?? '').getTime() -
      new Date(b.timePeriod ?? '').getTime()
    )
  })
  return limit ? projects.slice(0, limit) : projects
}

export async function getProjectMetaData(
  filepath: string
): Promise<ProjectMetadata> {
  const slug = filepath.replace(/\.mdx$/, '')
  const filePath = path.join(rootDir, filepath)
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
  const { data } = matter(fileContent)
  return { ...data, slug }
}
