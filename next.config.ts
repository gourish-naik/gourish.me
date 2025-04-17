import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Other Next.js configurations can go here
};

const withMDX = createMDX({
  // Optional: Add Remark and Rehype plugins here
  // remarkPlugins: [],
  // rehypePlugins: [],
});

export default withMDX(nextConfig);