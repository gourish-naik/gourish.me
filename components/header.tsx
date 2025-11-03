'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';
import { useTranslations } from 'next-intl';
// import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const t = useTranslations();
  // const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='fixed inset-0 to-0 z-50 bg-background/75 py-6 backdrop-blur-lg h-[65px]'>
      <nav className='container flex max-w-3xl items-center justify-between'>
        <div>
          <Link href='/' className='font-serif text-2xl font-bold'>Gourish</Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div className={`absolute top-[65px] left-0 w-full bg-background/75 backdrop-blur-lg md:relative md:top-0 md:w-auto md:bg-transparent md:backdrop-blur-none ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <ul className='flex flex-col md:flex-row items-center gap-6 text-sm font-light text-muted-foreground capitalize p-4 md:p-0'>
            <li className='transition-colors hover:text-foreground'>
              <Link href="/blogs" onClick={() => setIsMenuOpen(false)}>{t('blogs')}</Link>
            </li>
            <li className='transition-colors hover:text-foreground'>
              <Link href="/work" onClick={() => setIsMenuOpen(false)}>{t('work')}</Link>
            </li>
            <li className='transition-colors hover:text-foreground'>
              <Link href="/touch" onClick={() => setIsMenuOpen(false)}>{t('touch')}</Link>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
