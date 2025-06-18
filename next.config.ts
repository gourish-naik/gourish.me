import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Other Next.js configurations can go here
  //   i18n: {
  //   // List all supported locales
  //   locales: ['en', 'te', 'hi', 'ro', 'ar'],
  //   // Default locale
  //   defaultLocale: 'en',
  //   // Enable locale detection
  //   localeDetection: false,
  // },
};
const withNextInt = createNextIntPlugin();
const withMDX = createMDX({
  // Optional: Add Remark and Rehype plugins here
  // remarkPlugins: [],
  // rehypePlugins: [],
});

export default withNextInt(withMDX(nextConfig));