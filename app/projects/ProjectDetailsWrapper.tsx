// import ProjectDetails from './projectDetails'
import { Project } from '@/lib/projects'
import ReactMarkdown from 'react-markdown';

export default function ProjectDetailsWrapper({ project }: { project: Project }) {
  // return <ProjectDetails project={project} />
  return (
    <div className='projectdetails_scroll'>
      <div className='prose dark:prose-invert max-w-none'>
        <ReactMarkdown>
          {project.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
