'use client'

import React from 'react'
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';
import LanguageSwitcher from '@/components/languageswitcher';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation'; // Added

const LOCALES = ['en', 'fr', 'ar', 'hi', 'ro', 'te'];
const HOMEPAGE_PATHS = ['/', ...LOCALES.map(loc => `/${loc}`)];

export default function Header() {
    const t = useTranslations();
    const pathname = usePathname(); // Added

    const showLanguageSwitcher = HOMEPAGE_PATHS.includes(pathname);
    return (
        <header className='fixed inset-0 to-0 z-50 bg-background/75 py-6 backdrop-blur-lg h-[65px]'>
            <nav className='container flex max-w-3xl items-center justify-between'>
                <div>
                    <Link href='/' className='font-serif text-2xl font-bold'>Gourish</Link>
                </div>
                <ul className='flex items-center gap-6 text-sm font-light text-muted-foreground capitalize'>
                    <li className='transition-colors hover:text-foreground'>
                        <Link href="/projects">Projects</Link>
                    </li><li className='transition-colors hover:text-foreground'>
                        <Link href="/work">Work</Link>
                    </li>
                    <li className='transition-colors hover:text-foreground'>
                        <Link href="/experience">Experience</Link>
                    </li>
                    <li className='transition-colors hover:text-foreground'>
                        <Link href="/blog">Blog</Link>
                    </li>
                    <li className='transition-colors hover:text-foreground'>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
                <div>
                    {showLanguageSwitcher && <LanguageSwitcher />}
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}
