import React from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/theme-toggle';
import LanguageSwitcher from '@/components/languageswitcher';
import { useTranslations } from 'next-intl';


export default function Header() {
    const t = useTranslations();
    return (
        <header className='fixed inset-0 to-0 z-50 bg-background/75 py-6 backdrop-blur-lg h-[65px]'>
            <nav className='container flex max-w-3xl items-center justify-between'>
                <div>
                    <Link href='/' className='font-serif text-2xl font-bold'>Gourish</Link>
                </div>
                <ul className='flex items-center gap-6 text-sm font-light text-muted-foreground capitalize'>
                    <li className='transition-colors hover:text-foreground'>
                        <Link href="/projects">{t('projects')}</Link>
                    </li><li className='transition-colors hover:text-foreground'>
                        <Link href="/work">{t('work')}</Link>
                    </li><li className='transition-colors hover:text-foreground'>
                        <Link href="/contact">{t('contact')}</Link>
                    </li>
                </ul>
                <div>
                    <LanguageSwitcher/>
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}
