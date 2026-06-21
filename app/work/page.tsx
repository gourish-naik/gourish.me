import { getCompanyGroups, CompanyGroup, WorkEntry } from '@/lib/work';
import Image from 'next/image';
import Link from 'next/link';

export default async function WorkPage() {
  const groups = await getCompanyGroups();

  return (
    <section className="pb-24 pt-23">
      <div className="container max-w-3xl py-12">
        <h1 className="title mb-12">Work Experience</h1>
        <div className="space-y-14">
          {groups.map(group => (
            <CompanySection key={group.name} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompanySection({ group }: { group: CompanyGroup }) {
  return (
    <div>
      {/* Company header */}
      <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded-full border border-border bg-muted px-3.5 py-1 text-sm font-semibold text-foreground">
          {group.name}
        </span>
        <span className="text-sm font-medium text-foreground/70">{group.duration}</span>
        <span className="text-sm italic text-muted-foreground/60">
          {group.start} – {group.end}
        </span>
      </div>
      <p className="mb-5 text-xs text-muted-foreground">{group.role}</p>

      {/* Project cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.entries.map(entry => (
          <ProjectCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ entry }: { entry: WorkEntry }) {
  const inner = (
    <div className="group relative h-44 overflow-hidden rounded-xl bg-muted">
      {/* Image */}
      {entry.image && (
        <Image
          src={entry.image}
          alt={entry.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Always-on gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Tags — fade in on hover, sit above title */}
      <div className="absolute inset-x-0 bottom-10 flex flex-wrap gap-1 px-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {(entry.tags ?? []).map(tag => (
          <span
            key={tag}
            className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title — always visible at bottom */}
      <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
        <p className="line-clamp-1 text-sm font-semibold text-white">{entry.title}</p>
        <p className="line-clamp-1 text-[11px] text-white/60">{entry.summary}</p>
      </div>
    </div>
  );

  if (entry.projectSlug) {
    return (
      <Link href={`/projects/${entry.projectSlug}`} className="block">
        {inner}
      </Link>
    );
  }

  return <div>{inner}</div>;
}
