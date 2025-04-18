'use client'

import React, { useState } from 'react'
import Projects from '@/components/projects'
import { Project } from '@/lib/projects'
import ProjectDetailsWrapper from '@/app/projects/ProjectDetailsWrapper'


// Dynamically import the wrapper (server)
// const ProjectDetailsWrapper = dynamic(() => import('@/app/projects/ProjectDetailsWrapper'), {
//   ssr: false, // prevent server render in client file
//   loading: () => <p>Loading project...</p>,
// })

export default function ProjectsRender({ projects }: { projects: Project[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  return (
    <div className='container max-w-3xl grid grid-cols-2 gap-8 flex-col md:flex-row'>
      <Projects projects={projects} onSlideChange={setCurrentSlide} />
      <div className='p-4 projectdetails'>
        <ProjectDetailsWrapper project={projects[currentSlide]} />
      </div>
    </div>
  )
}
