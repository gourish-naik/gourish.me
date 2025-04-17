import { getWorks } from '@/lib/work'

export default async function ProjectsPage() {
  const Works = await getWorks()
  console.info(Works)
  return (
    <section className='pb-24 pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-12'>Work Experience</h1>
          Hey!
      </div>
    </section>
  )
}