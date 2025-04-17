// app/projects/projectDetails.tsx (NO 'use client')

import { Project } from '@/lib/projects'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote source={project.content} />
    </div>
  )
}
