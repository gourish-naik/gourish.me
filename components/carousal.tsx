'use client'
import { ExternalLinkIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type CarouselCardProps = {
  image: string
  href: string
  alt?: string
}

export default function CarouselCard({ image, href, alt = 'preview' }: CarouselCardProps) {
  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl shadow-md">
      <Image src={image} alt={alt} fill className="object-cover transition duration-300 group-hover:blur-[1px]" />
      <Link
        href={href}
        className="absolute inset-0 z-10 hidden items-center justify-center bg-black/60 text-white group-hover:flex transition"
      >
        <ExternalLinkIcon className="h-6 w-6" />
      </Link>
    </div>
  )
}
