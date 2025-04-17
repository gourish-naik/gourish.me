import Link from "next/link"
import { getProjects } from "@/lib/projects"
import HomeProjects from "@/components/homeProject"

export default async function RecentProjects() {
    const projects = await getProjects(2)

    return (
        <section className="pb-24">
            <div>
                <h2 className="title mb-12">Recent projects</h2>
                <HomeProjects projects={projects} />
                <Link
                    href="/projects"
                    className="mt-8 inline-flex items-center gap-2 text-muted-foreground"
                >
                    <span>All projects</span>
                </Link>
            </div>
        </section>
    )

}