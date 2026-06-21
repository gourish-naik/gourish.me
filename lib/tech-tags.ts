export const TECH_TAG_COLORS: Record<string, { bg: string; color: string }> = {
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
  svelte: { bg: '#FF3E00', color: '#fff' },
  angular: { bg: '#DD0031', color: '#fff' },
  redux: { bg: '#764ABC', color: '#fff' },
  webpack: { bg: '#8DD6F9', color: '#000' },
  vite: { bg: '#646CFF', color: '#fff' },
  jest: { bg: '#C21325', color: '#fff' },
  mysql: { bg: '#4479A1', color: '#fff' },
  mongodb: { bg: '#47A248', color: '#fff' },
  postgresql: { bg: '#336791', color: '#fff' },
  redis: { bg: '#DC382D', color: '#fff' },
  aws: { bg: '#FF9900', color: '#000' },
  firebase: { bg: '#FFCA28', color: '#000' },
  linux: { bg: '#FCC624', color: '#000' },
};

// Canonical lookup keys derived from the color map
const VALID_KEYS = new Set(Object.keys(TECH_TAG_COLORS));

// Normalise a raw tag string to the key used in TECH_TAG_COLORS
function normalise(tag: string): string {
  return tag.trim().toLowerCase();
}

export function isValidTechTag(tag: string): boolean {
  const key = normalise(tag);
  // Direct match (e.g. "css", "next.js")
  if (VALID_KEYS.has(key)) return true;
  // Strip punctuation/spaces for variants like "Next.js" → "nextjs", "node js" → "nodejs"
  const stripped = key.replace(/[\s.-]/g, '');
  return VALID_KEYS.has(stripped);
}

export function getTagStyle(tag: string): { bg: string; color: string } {
  const key = normalise(tag);
  return (
    TECH_TAG_COLORS[key] ??
    TECH_TAG_COLORS[key.replace(/[\s.-]/g, '')] ?? { bg: '#6B7280', color: '#fff' }
  );
}
