'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { Project } from '@/lib/projects';
import HomeProjects from '@/components/homeProject';
import { fetchProjects } from './actions';

const BATCH_SIZE = 4;

export default function ProjectList({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [offset, setOffset] = useState(initialProjects.length);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMoreProjects = useCallback(async () => {
    const newProjects = await fetchProjects({ offset, limit: BATCH_SIZE });
    if (newProjects.length > 0) {
      setProjects(prev => [...prev, ...newProjects]);
      setOffset(prev => prev + newProjects.length);
    } else {
      setHasMore(false);
    }
  }, [offset]);

  useEffect(() => {
    const loader = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProjects();
        }
      },
      { threshold: 1.0 }
    );

    if (loader) {
      observer.observe(loader);
    }

    return () => {
      if (loader) {
        observer.unobserve(loader);
      }
    };
  }, [hasMore, loadMoreProjects]);

  return (
    <div>
      <HomeProjects projects={projects} />
      {hasMore && <div ref={loaderRef} className="text-center p-4">Loading...</div>}
    </div>
  );
}
