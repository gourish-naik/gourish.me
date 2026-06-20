'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRef, useEffect, useCallback } from 'react';
import { getTagStyle } from '@/lib/tech-tags';

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
      className="tag-scroll flex select-none gap-2 overflow-x-auto pb-1"
    >
      {selectedTags.length >= 2 && (
        <button
          onClick={clearAll}
          className="flex shrink-0 items-center gap-1 rounded-full border border-destructive/60 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
        >
          Clear all
          <XIcon />
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
              'flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all',
              active ? 'shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/70',
            ].join(' ')}
          >
            {tag}
            {active && <XIcon />}
          </button>
        );
      })}
    </div>
  );
}

function XIcon() {
  return (
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
  );
}
