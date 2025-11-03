import React from 'react'
import { getProjects } from '@/lib/projects'
import ProjectList from './project-list'

const BATCH_SIZE = 4;

export default async function ProjectsPage() {
  const initialProjects = await getProjects(BATCH_SIZE)

  return (
    <section className='pb-24 pt-40'>
      <div className="container max-w-3xl">
        <h1 className="title mb-12">All Projects</h1>
        <ProjectList initialProjects={initialProjects} />
      </div>
    </section>
  )
}
