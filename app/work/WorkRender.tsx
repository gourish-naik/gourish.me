'use client'; // Keep client component if we add any client-side interactions later, or for consistency

import React from 'react';
import Link from 'next/link';
import { WorkMetadata } from '@/lib/work'; // Use WorkMetadata
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image'; // For displaying work item images/thumbnails

interface WorkRenderProps {
  works: WorkMetadata[];
}

export default function WorkRender({ works }: WorkRenderProps) {
  if (!works || works.length === 0) {
    return <p>No work items to display at the moment.</p>; // Static English
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {works.map((workItem) => (
        <Link href={`/work/${workItem.slug}`} key={workItem.slug} className="block group">
          <Card className="h-full flex flex-col transition-all duration-200 ease-in-out group-hover:shadow-lg group-hover:border-primary/60">
            {workItem.image && (
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <Image
                  src={workItem.image}
                  alt={workItem.title || 'Work item thumbnail'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardHeader className={workItem.image ? '' : 'pt-6'}> {/* Adjust padding if no image */}
              <CardTitle className="text-xl font-semibold group-hover:text-primary">
                {workItem.title}
              </CardTitle>
              {workItem.role && (
                <CardDescription className="text-base">
                  {workItem.role}
                </CardDescription>
              )}
            </CardHeader>
            {workItem.summary && (
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {workItem.summary}
                </p>
              </CardContent>
            )}
            <CardContent className="mt-auto pt-0">
                 <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">Read more &rarr;</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
