import { GraphQLClient, gql } from 'graphql-request';

const HYGRAPH_API_URL = process.env.HYGRAPH_API_URL || '';
const HYGRAPH_API_TOKEN = process.env.HYGRAPH_API_TOKEN || '';

const hygraphFetch = (revalidate: number, tags?: string[]) =>
  (url: RequestInfo | URL, options?: RequestInit) =>
    fetch(url, {
      ...options,
      next: { revalidate, tags: tags ?? ['blog'] },
    } as RequestInit);

// Only construct the client when the URL is present — avoids ERR_INVALID_URL during builds
// where env vars aren't set (e.g. Vercel preview without env configured).
const client = HYGRAPH_API_URL
  ? new GraphQLClient(HYGRAPH_API_URL, {
      headers: { Authorization: `Bearer ${HYGRAPH_API_TOKEN}` },
      method: 'GET',
      fetch: hygraphFetch(3600, ['blog']),
    })
  : null;

export type BlogPost = {
  slug: string;
  title: string;
  content: { html: string };
  date: string;
  author: { name: string };
  coverImage: { url: string };
  tags: string[];
  summary: string;
};

export type Tag = string;

// Trim only — do NOT lowercase. Hygraph matching is case-sensitive so we must
// preserve the original casing for queries to match what's stored.
function sanitizeTags(tags: string[]): string[] {
  return tags.map(tag => tag.trim()).filter(tag => tag.length > 0);
}

// Case-insensitive dedup: keeps first-seen casing, removes duplicates that differ only by case.
function deduplicateTagsCaseInsensitive(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags.filter(tag => {
    const key = tag.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// GraphQL Queries
const GET_BLOG_POST_BY_SLUG = gql`
  query GetBlogPostBySlug($slug: String!) {
    blogPost(where: { slug: $slug }) {
      slug
      title
      content { html }
      date
      author { name }
      coverImage { url }
      tags
      summary
    }
  }
`;

const GET_BLOG_POSTS = gql`
  query GetBlogPosts($limit: Int, $offset: Int, $where: BlogPostWhereInput) {
    blogPosts(first: $limit, skip: $offset, where: $where, orderBy: date_DESC) {
      slug
      title
      date
      author { name }
      coverImage { url }
      tags
      summary
    }
  }
`;

const GET_ALL_TAGS = gql`
  query GetAllTags {
    blogPosts {
      tags
    }
  }
`;

const GET_ALL_BLOG_SLUGS = gql`
  query GetAllBlogSlugs {
    blogPosts {
      slug
    }
  }
`;

const GET_RELATED_BLOG_POSTS = gql`
  query GetRelatedBlogPosts($currentBlogSlug: String!, $tags: [String!]!, $limit: Int!) {
    blogPosts(where: { slug_not: $currentBlogSlug, tags_contains_some: $tags }, first: $limit, orderBy: date_DESC) {
      slug
      title
      coverImage { url }
      summary
      tags
      date
      author { name }
    }
  }
`;

// Data Fetching Functions
export async function fetchBlogBySlugFromCMS(slug: string): Promise<BlogPost | null> {
  if (!client) return null;
  try {
    const { blogPost } = await client.request(GET_BLOG_POST_BY_SLUG, { slug });
    if (blogPost) blogPost.tags = sanitizeTags(blogPost.tags || []);
    return blogPost;
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}

export async function fetchBlogsFromCMS(limit?: number, offset: number = 0, tags?: string[]): Promise<BlogPost[]> {
  if (!client) return [];
  try {
    const whereClause: { tags_contains_all?: string[] } = {};
    if (tags && tags.length > 0) {
      const cleanTags = sanitizeTags(tags);
      if (cleanTags.length > 0) whereClause.tags_contains_all = cleanTags;
    }
    const { blogPosts } = await client.request(GET_BLOG_POSTS, { limit, offset, where: whereClause });
    return blogPosts.map((post: BlogPost) => ({
      ...post,
      tags: sanitizeTags(post.tags || []),
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchAllTagsFromCMS(): Promise<Tag[]> {
  if (!client) return [];
  try {
    const { blogPosts } = await client.request(GET_ALL_TAGS, {});
    const allTags = blogPosts.flatMap((post: { tags: string[] }) => post.tags || []);
    return deduplicateTagsCaseInsensitive(sanitizeTags(allTags));
  } catch (error) {
    console.error('Error fetching all tags:', error);
    return [];
  }
}

export async function getBlogSlugs(): Promise<string[]> {
  if (!client) return [];
  try {
    const { blogPosts } = await client.request(GET_ALL_BLOG_SLUGS, {});
    return blogPosts.map((post: { slug: string }) => post.slug);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

export async function fetchRelatedBlogs(currentBlogSlug: string, tags: string[], limit: number = 3): Promise<BlogPost[]> {
  if (!client) return [];
  try {
    const cleanTags = sanitizeTags(tags);
    if (cleanTags.length === 0) return [];
    const { blogPosts } = await client.request(GET_RELATED_BLOG_POSTS, {
      currentBlogSlug,
      tags: cleanTags,
      limit,
    });
    return blogPosts.map((post: BlogPost) => ({
      ...post,
      tags: sanitizeTags(post.tags || []),
    }));
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
}