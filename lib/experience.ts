import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const rootDirectory = path.join(process.cwd(), 'content', 'experience');

export interface ExperienceProject {
  title: string;
  description: string;
  technologies: string[];
}

export interface ExperienceMetadata {
  companyName: string;
  role: string;
  period: string; // e.g., "2021-Present" or "Jan 2020 - Dec 2021"
  logoUrl?: string;
  projects?: ExperienceProject[];
  slug: string;
}

export interface Experience extends ExperienceMetadata {
  content: string; // The main markdown content for the company experience
}

// Helper function to read and parse a single experience file
async function parseExperienceFile(filePath: string, slug: string): Promise<Experience | null> {
  try {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    const { data, content } = matter(fileContent);
    // Ensure projects is an array, even if undefined in frontmatter
    const projects = data.projects || [];
    return { ...(data as Omit<ExperienceMetadata, 'slug' | 'projects'>), projects, slug, content };
  } catch (error) {
    console.error(`Error reading or parsing experience file ${filePath}:`, error);
    return null;
  }
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const filePath = path.join(rootDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return parseExperienceFile(filePath, slug);
}

export async function getAllExperiences(): Promise<ExperienceMetadata[]> {
  try {
    const files = fs.readdirSync(rootDirectory);
    const experiences: ExperienceMetadata[] = [];

    for (const file of files) {
      if (path.extname(file) === '.mdx') {
        const slug = file.replace(/\.mdx$/, '');
        const filePath = path.join(rootDirectory, file);
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
        const { data } = matter(fileContent);
        // Ensure projects is an array
        const projects = data.projects || [];
        experiences.push({ ...(data as Omit<ExperienceMetadata, 'slug' | 'projects'>), projects, slug });
      }
    }

    // Sort experiences by period. More complex date parsing might be needed for robust sorting.
    // This basic sort assumes "YYYY-Present" comes after "YYYY-YYYY" and sorts alphabetically for others.
    // For true chronological sort, 'period' needs a consistent machine-readable format or a dedicated 'startDate' field.
    return experiences.sort((a, b) => {
      const aPeriod = a.period.toLowerCase();
      const bPeriod = b.period.toLowerCase();
      if (aPeriod.includes('present') && !bPeriod.includes('present')) return -1;
      if (!aPeriod.includes('present') && bPeriod.includes('present')) return 1;
      // Simple reverse chronological for years if possible
      const aYear = parseInt(aPeriod.slice(0,4));
      const bYear = parseInt(bPeriod.slice(0,4));
      if (!isNaN(aYear) && !isNaN(bYear) && aYear !== bYear) return bYear - aYear;
      return bPeriod.localeCompare(aPeriod); // Fallback to string compare
    });

  } catch (error) {
    console.error('Error reading experience directory:', error);
    return []; // Return empty array on error
  }
}
