import { MetadataRoute } from 'next'
import { getProjects } from '@/lib/projects'
import { getBlogSlugs } from '@/lib/blog-data'

const BASE_URL = 'https://igourish.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, blogSlugs] = await Promise.all([
    getProjects(),
    getBlogSlugs(),
  ])

  const projectUrls = projects.map(({ metadata }) => ({
    url: `${BASE_URL}/projects/${metadata.slug}`,
    lastModified: metadata.timePeriod ? new Date(metadata.timePeriod) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const blogUrls = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blogs/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/work`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/touch`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...projectUrls,
    ...blogUrls,
  ]
}
