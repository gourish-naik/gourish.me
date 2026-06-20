import Link from "next/link"
import { getProjects } from "@/lib/projects"
import HomeProjects from "@/components/homeProject"
import { getTranslations } from "next-intl/server"

export default async function RecentProjects() {
    const projects = await getProjects(3)
    const t = await getTranslations("project")
    
    return (
        <section className="pb-24">
            <div>
                <h2 className="title mb-12">{t("recentProjects")}</h2>
                <HomeProjects projects={projects} />
                <Link
                    href="/projects"
                    className="mt-8 inline-flex items-center gap-2 text-muted-foreground"
                >
                    <span>{t("allProjects")}</span>
                </Link>
            </div>
        </section>
    )

}