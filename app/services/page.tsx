import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { CheckIcon } from 'lucide-react'

export const metadata = {
  title: 'Services | Gourishankar Menavath',
  description:
    'React, Next.js & Magento PWA Studio e-commerce frontend services — performance audits, storefront builds, and ongoing retainers.',
}

export default async function ServicesPage() {
  const t = await getTranslations('ServicesPage')

  const packages = [
    {
      key: 'audit',
      accent: 'border-blue-500/40',
      badge: 'bg-blue-500/10 text-blue-400',
    },
    {
      key: 'build',
      accent: 'border-violet-500/40',
      badge: 'bg-violet-500/10 text-violet-400',
    },
    {
      key: 'retainer',
      accent: 'border-emerald-500/40',
      badge: 'bg-emerald-500/10 text-emerald-400',
    },
  ] as const

  return (
    <section className='pb-24 pt-32'>
      <div className='container max-w-3xl'>
        <h1 className='title mb-3'>{t('title')}</h1>
        <p className='mb-12 text-muted-foreground'>{t('subtitle')}</p>

        <div className='flex flex-col gap-6'>
          {packages.map(({ key, accent, badge }) => {
            const includes = t.raw(`${key}.includes`) as string[]
            return (
              <div
                key={key}
                className={`rounded-xl border ${accent} bg-card p-6 shadow-sm`}
              >
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <h2 className='text-xl font-semibold'>{t(`${key}.name`)}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge}`}>
                    {t(`${key}.duration`)}
                  </span>
                </div>
                <p className='mt-3 text-sm text-muted-foreground'>
                  {t(`${key}.description`)}
                </p>
                <ul className='mt-4 space-y-2'>
                  {includes.map((item: string) => (
                    <li key={item} className='flex items-start gap-2 text-sm'>
                      <CheckIcon className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground' />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className='mt-12 text-center'>
          <Link
            href='/touch'
            className='inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80'
          >
            {t('cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
