import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const rootDir = path.join(process.cwd(), 'content', 'work');

export type WorkEntry = {
  slug: string;
  title: string;
  summary: string;
  company: string;
  role: string;
  companyStart: string;
  companyEnd?: string;
  projectSlug?: string;
  image?: string;
  tags?: string[];
  timePeriod?: string;
};

export type CompanyGroup = {
  name: string;
  role: string;
  start: string;
  end: string;
  duration: string;
  entries: WorkEntry[];
};

function fmtMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function calcDuration(startStr: string, endStr?: string): string {
  const start = new Date(startStr);
  const end = endStr ? new Date(endStr) : new Date();
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}yr${years > 1 ? 's' : ''}`;
  return `${years}yr${years > 1 ? 's' : ''} ${months}mo`;
}

function readEntry(slug: string): WorkEntry | null {
  try {
    const filePath = path.join(rootDir, `${slug}.mdx`);
    const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
    if (data.self !== 'company') return null;
    return {
      slug,
      title: data.title ?? '',
      summary: data.summary ?? '',
      company: data.company ?? '',
      role: data.role ?? '',
      companyStart: data.companyStart ?? '',
      companyEnd: data.companyEnd,
      projectSlug: data.projectSlug || undefined,
      image: data.image || undefined,
      tags: data.tags ?? [],
      timePeriod: data.timePeriod,
    };
  } catch {
    return null;
  }
}

export async function getWorkProjectBySlug(slug: string): Promise<WorkEntry | null> {
  return readEntry(slug);
}

export async function getCompanyGroups(): Promise<CompanyGroup[]> {
  const slugs = fs
    .readdirSync(rootDir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''));

  const entries = slugs
    .map(readEntry)
    .filter((e): e is WorkEntry => e !== null);

  entries.sort(
    (a, b) =>
      new Date(a.timePeriod ?? a.companyStart).getTime() -
      new Date(b.timePeriod ?? b.companyStart).getTime(),
  );

  const map = new Map<string, WorkEntry[]>();
  entries.forEach(e => {
    if (!map.has(e.company)) map.set(e.company, []);
    map.get(e.company)!.push(e);
  });

  const groups: CompanyGroup[] = Array.from(map.entries()).map(([name, grpEntries]) => {
    const rep = grpEntries[0];
    return {
      name,
      role: rep.role,
      start: rep.companyStart ? fmtMonthYear(rep.companyStart) : '',
      end: rep.companyEnd ? fmtMonthYear(rep.companyEnd) : 'Present',
      duration: calcDuration(rep.companyStart, rep.companyEnd),
      entries: grpEntries,
    };
  });

  // Most recent company first
  groups.sort(
    (a, b) =>
      new Date(map.get(b.name)![0].companyStart).getTime() -
      new Date(map.get(a.name)![0].companyStart).getTime(),
  );

  return groups;
}
