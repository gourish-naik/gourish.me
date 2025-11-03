'use client';

import { MDXRemote } from 'next-mdx-remote/rsc';

export default function BlogContentRenderer({ htmlContent }: { htmlContent: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote source={htmlContent} />
    </div>
  );
}
