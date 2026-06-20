import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  // Hygraph webhook payload — revalidate all blog cache tags
  revalidateTag('blog');

  // Also revalidate the blog listing and sitemap paths
  revalidatePath('/blogs');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

// Keep GET for manual cache busting during development
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, now: Date.now(), tag });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now(), path });
  }

  // Default: revalidate all blog content
  revalidateTag('blog');
  return NextResponse.json({ revalidated: true, now: Date.now(), tag: 'blog' });
}
