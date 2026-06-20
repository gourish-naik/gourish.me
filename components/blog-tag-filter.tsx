'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRef, useEffect, useCallback } from 'react';

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  css: { bg: '#663399', color: '#fff' },
  html: { bg: '#E34F26', color: '#fff' },
  js: { bg: '#F7DF1E', color: '#000' },
  javascript: { bg: '#F7DF1E', color: '#000' },
  ts: { bg: '#3178C6', color: '#fff' },
  typescript: { bg: '#3178C6', color: '#fff' },
  scss: { bg: '#CC6699', color: '#fff' },
  sass: { bg: '#CC6699', color: '#fff' },
  react: { bg: '#61DAFB', color: '#000' },
  'next.js': { bg: '#1a1a1a', color: '#fff' },
  nextjs: { bg: '#1a1a1a', color: '#fff' },
  pwa: { bg: '#5A0FC8', color: '#fff' },
  magento: { bg: '#EE6723', color: '#fff' },
  vue: { bg: '#42B883', color: '#fff' },
  vuejs: { bg: '#42B883', color: '#fff' },
  python: { bg: '#3572A5', color: '#fff' },
  node: { bg: '#339933', color: '#fff' },
  'node.js': { bg: '#339933', color: '#fff' },
  nodejs: { bg: '#339933', color: '#fff' },
  php: { bg: '#8892BF', color: '#fff' },
  wordpress: { bg: '#21759B', color: '#fff' },
  tailwind: { bg: '#06B6D4', color: '#fff' },
  tailwindcss: { bg: '#06B6D4', color: '#fff' },
  graphql: { bg: '#E10098', color: '#fff' },
  docker: { bg: '#2496ED', color: '#fff' },
  git: { bg: '#F05032', color: '#fff' },
};

function getTagStyle(tag: string): { bg: string; color: string } {
  const key = tag.toLowerCase().replace(/[\s.]/g, '');
  return TAG_COLORS[tag.toLowerCase()] ?? TAG_COLORS[key] ?? { bg: '#6B7280', color: '#fff' };
}

interface BlogTagFilterProps {
  allTags: string[];
  selectedTags: string[];
}

export function BlogTagFilter({ allTags, selectedTags }: BlogTagFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateTags = useCallback(
    (next: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.length === 0) {
        params.delete('tags');
      } else {
        params.set('tags', next.join(','));
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const toggleTag = (tag: string) => {
    const isActive = selectedTags.some(t => t.toLowerCase() === tag.toLowerCase());
    const next = isActive
      ? selectedTags.filter(t => t.toLowerCase() !== tag.toLowerCase())
      : [...selectedTags, tag];
    updateTags(next);
  };

  const clearAll = () => updateTags([]);

  // Show scrollbar briefly while scrolling
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.classList.add('scrolling');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => el.classList.remove('scrolling'), 900);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  if (allTags.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="tag-scroll flex gap-2 overflow-x-auto pb-1 select-none"
    >
      {/* Clear all — only when 2+ filters active */}
      {selectedTags.length >= 2 && (
        <button
          onClick={clearAll}
          className="shrink-0 flex items-center gap-1 rounded-full border border-destructive/60 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
        >
          Clear all
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {allTags.map(tag => {
        const active = selectedTags.some(t => t.toLowerCase() === tag.toLowerCase());
        const { bg, color } = getTagStyle(tag);
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            style={active ? { backgroundColor: bg, color } : undefined}
            className={[
              'shrink-0 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all',
              active
                ? 'shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/70',
            ].join(' ')}
          >
            {tag}
            {active && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
