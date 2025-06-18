import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const rootDirectory = path.join(process.cwd(), 'content', 'work')

export type Work = {
  metadata: WorkMetadata
  content: string
}

export type WorkMetadata = {
  title?: string
  role?:string
  summary?: string
  image?: string
  timePeriod?: string
  slug: string
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  try {
    const filePath = path.join(rootDirectory, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
    const { data, content } = matter(fileContent)
    return { metadata: { ...data, slug } as WorkMetadata, content }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null
  }
}

export async function getAllWorks(limit?: number): Promise<WorkMetadata[]> {
  const files = fs.readdirSync(rootDirectory)

  const works = files
    .map(file => getWorkMetaData(file))
    .sort((a, b) => {
      // Sort by timePeriod, descending (newer first)
      if (new Date(a.timePeriod ?? '') < new Date(b.timePeriod ?? '')) {
        return 1;
      } else {
        return -1;
      }
    });

  if (limit) {
    return works.slice(0, limit)
  }

  return works
}

export function getWorkMetaData(filepath: string): WorkMetadata {
  const slug = filepath.replace(/\.mdx$/, '')
  const filePath = path.join(rootDirectory, filepath)
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
  const { data } = matter(fileContent)
  return { ...data, slug } as WorkMetadata
}
