import React from 'react'
import Image from 'next/image'
import gourish from '@/public/me.jpeg'
import { useTranslations } from 'next-intl'

import { getLayoutDirection } from '@/lib/locales-util'
import { useLocale } from 'next-intl'


export default function Intro() {
  const t = useTranslations("About");
  const locale = useLocale() // Gets current locale (e.g., 'ar', 'en')
  const dir = getLayoutDirection(locale)

  return (
    <section
      className={`flex flex-col-reverse items-start gap-x-10 gap-y-4 pb-24 md:flex-row md:items-center 
        ${dir === 'rtl' ? 'md:flex-row-reverse text-right'
          : ''
        }`}>
      <div className='mt-2 flex-1 md:mt-0 user-none'>
        <h1 className='title no-underline'>{t("hello")}</h1>
        <p className='mt-3 text-foreground'>
          {t("description")}
        </p>
        <p className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
          <span className='inline-block h-2 w-2 rounded-full bg-green-500' />
          <a href='/touch' className='hover:text-foreground transition-colors'>{t("available")}</a>
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
