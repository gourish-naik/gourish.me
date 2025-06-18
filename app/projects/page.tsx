import React from 'react'
import { getProjects } from '@/lib/projects'
import ProjectsRender from './projects'
import '@/styles/components/projects.scss'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <section className='pb-24 pt-40'>
      <ProjectsRender projects={projects}/>
    </section>
  )
}
