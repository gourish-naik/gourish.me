import React from 'react'
import Image from 'next/image'
import gourish from '@/public/me.jpeg'

export default function Intro() {
  return (
    <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-3'>
        <div className='mt-2 flex-1 md:mt-0'>
            <h1 className='title no-underline'>Hello, I&#39;m Gourish.</h1>
            <p className='mt-3 font-light text-muted-foreground'>
                I&#39;m a frontend engineer based in Kurnool, AP, India. I&#39;m enthuszastic about learning new technologies and I exploring them to share the aquired knowledge with others. 
            </p>
        </div>
        <div className='relative'>
            <Image
                className='flex-1 rounded-lg grayscale'
                src={gourish}
                alt='Gourish'
                width={120}
                height={120}
                priority
            />
        </div>
    </section>
  )
}
