'use server'

import { getProjects } from '@/lib/projects';

export async function fetchProjects({ offset = 0, limit = 4 }) {
  const projects = await getProjects(limit, offset);
  return projects;
}
