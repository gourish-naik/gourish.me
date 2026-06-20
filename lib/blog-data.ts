import { GraphQLClient, gql } from 'graphql-request';

const HYGRAPH_API_URL = process.env.HYGRAPH_API_URL || '';
const HYGRAPH_API_TOKEN = process.env.HYGRAPH_API_TOKEN || '';

// Use a custom fetch that wires Next.js ISR caching + cache tags.
// Passing { next: ... } as the 3rd arg to client.request() only sets headers — it does NOT cache.
// The correct approach is to intercept at the fetch level.
const hygraphFetch = (revalidate: number, tags?: string[]) =>
  (url: RequestInfo | URL, options?: RequestInit) =>
    fetch(url, {
      ...options,
      next: { revalidate, tags: tags ?? ['blog'] },
    } as RequestInit)

const client = new GraphQLClient(HYGRAPH_API_URL, {
  headers: {
    Authorization: `Bearer ${HYGRAPH_API_TOKEN}`,
  },
  method: 'GET',
  fetch: hygraphFetch(3600, ['blog']),
});

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

// Helper function to sanitize tags
function sanitizeTags(tags: string[]): string[] {
  return tags
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
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
  try {
    const { blogPost } = await client.request(GET_BLOG_POST_BY_SLUG, { slug });
    
    if (blogPost) {
      // Sanitize tags when fetching
      blogPost.tags = sanitizeTags(blogPost.tags || []);
    }
    
    return blogPost;
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}

export async function fetchBlogsFromCMS(limit?: number, offset: number = 0, tags?: string[]): Promise<BlogPost[]> {
  try {
    const whereClause: { tags_contains_all?: string[] } = {};
    if (tags && tags.length > 0) {
      // Sanitize tags before querying
      const cleanTags = sanitizeTags(tags);
      if (cleanTags.length > 0) {
        whereClause.tags_contains_all = cleanTags;
      }
    }
    const { blogPosts } = await client.request(GET_BLOG_POSTS, { limit, offset, where: whereClause });
    
    // Sanitize tags in results
    return blogPosts.map((post: BlogPost) => ({
      ...post,
      tags: sanitizeTags(post.tags || [])
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchAllTagsFromCMS(): Promise<Tag[]> {
  try {
    const { blogPosts } = await client.request(GET_ALL_TAGS, {});
    const allTags = blogPosts.flatMap((post: { tags: string[] }) => post.tags || []);
    // Sanitize and get unique tags
    const sanitized = sanitizeTags(allTags);
    return Array.from(new Set(sanitized));
  } catch (error) {
    console.error('Error fetching all tags:', error);
    return [];
  }
}

export async function getBlogSlugs(): Promise<string[]> {
  try {
    const { blogPosts } = await client.request(GET_ALL_BLOG_SLUGS, {});
    return blogPosts.map((post: { slug: string }) => post.slug);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

export async function fetchRelatedBlogs(currentBlogSlug: string, tags: string[], limit: number = 3): Promise<BlogPost[]> {
  try {
    // Sanitize tags before querying
    const cleanTags = sanitizeTags(tags);
    
    // If no valid tags, return empty array
    if (cleanTags.length === 0) {
      console.warn('No valid tags provided for related blogs');
      return [];
    }

    const { blogPosts } = await client.request(GET_RELATED_BLOG_POSTS, {
      currentBlogSlug,
      tags: cleanTags,
      limit,
    });
    
    // Sanitize tags in results
    return blogPosts.map((post: BlogPost) => ({
      ...post,
      tags: sanitizeTags(post.tags || [])
    }));
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
}