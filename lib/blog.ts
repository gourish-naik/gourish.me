import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export interface BlogMetadata {
  title: string;
  slug: string;
  publicationDate: string; // YYYY-MM-DD
  author: string;
  coverImage?: string;
  excerpt: string;
  tags: string[];
}

export interface BlogPost extends BlogMetadata {
  content: string;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  try {
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure all necessary metadata fields are present
    const requiredFields: (keyof BlogMetadata)[] = ['title', 'slug', 'publicationDate', 'author', 'excerpt', 'tags'];
    for (const field of requiredFields) {
      if (typeof data[field] === 'undefined') {
        // Or throw an error, or handle as you see fit
        console.warn(`Warning: Blog post "${slug}" is missing field "${field}".`);
        // Provide a default or mark as invalid if critical
        if (field === 'tags') data[field] = [];
        else if (field === 'excerpt') data[field] = '';
        // For other fields, you might want to throw or return null if they are absolutely essential
      }
    }

    return {
      ...(data as BlogMetadata), // Type assertion after validation/defaults
      content,
    };
  } catch (error) {
    console.error(`Error reading or parsing blog post ${slug}:`, error);
    return null;
  }
}

export async function getAllBlogPosts(): Promise<BlogMetadata[]> {
  try {
    const filenames = fs.readdirSync(postsDirectory);
    const allPostsData = filenames
      .filter(filename => filename.endsWith('.mdx'))
      .map(filename => {
        const slug = filename.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        return {
          ...(data as Omit<BlogMetadata, 'slug'>), // Assume other fields are present
          slug,
        } as BlogMetadata; // Add 'as BlogMetadata' for stronger typing
      });

    return allPostsData.sort((a, b) => {
      return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    });
  } catch (error) {
    console.error('Error reading blog posts directory:', error);
    return [];
  }
}
