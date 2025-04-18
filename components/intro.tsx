import React from 'react'
import Image from 'next/image'
import gourish from '@/public/me.jpeg'
import { useTranslations } from 'next-intl'


export default function Intro() {
  const t = useTranslations("About");
  return (
    <section className='flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center'>
        <div className='mt-2 flex-1 md:mt-0 user-none'>
            <h1 className='title no-underline'>{t("hello")}</h1>
            <p className='mt-3 font-light text-muted-foreground'>
            👋 Hey there! I&#39;m a <span className='text-orange-300 px-1 font-semibold'>Frontend Engineer</span> based in Kurnool, India.
            I love building clean, intuitive web experiences with React, Next.js, and modern JavaScript. I&#39;m always curious about new tech exploring it not just to grow as a developer, but to share what I learn and help others along the way.
            </p>
        </div>
        <div className='relative user-none c-cursor'>
            <Image
                className='flex-1 rounded-lg grayscale transition-all duration-300  user-none hover:scale-105 hover:rotate-12 '
                src={gourish}
                alt='Gourish'
                width={145}
                height={145}
                priority
            />
        </div>
    </section>
  )
}
