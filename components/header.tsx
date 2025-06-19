'use client'
import React from 'react'
import Link from 'next/link';
import ThemeToggle from '@/components/theme-toggle';
import LanguageSwitcher from '@/components/languageswitcher';
// import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation'; // Added

const LOCALES = ['en', 'fr', 'ar', 'hi', 'ro', 'te'];
const HOMEPAGE_PATHS = ['/', ...LOCALES.map(loc => `/${loc}`)];

export default function Header() {
    // const t = useTranslations();
    const pathname = usePathname(); // Added
    
    console.log(pathname,'>>>');
    
    const showLanguageSwitcher = HOMEPAGE_PATHS.includes(pathname);
    
    const navItems = [
        { href: "/projects", label: "Projects" },
        { href: "/work", label: "Work" },
        { href: "/experience", label: "Experience" },
        { href: "/blog", label: "Blog" },
        { href: "/contact", label: "Contact" }
    ];
    
    return (
        <header className='fixed inset-0 to-0 z-50 bg-background/75 py-6 backdrop-blur-lg h-[65px]'>
            <nav className='container flex max-w-3xl items-center justify-between'>
                <div>
                    <Link href='/' className='font-serif text-2xl font-bold'>Gourish</Link>
                </div>
                <ul className='flex items-center gap-6 text-sm font-light text-muted-foreground capitalize'>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        
                        return (
                            <li key={item.href} className='relative transition-colors hover:text-foreground'>
                                <Link 
                                    href={item.href}
                                    className={`
                                        relative px-3 py-1.5 transition-all duration-300 ease-out rounded-full
                                        ${isActive 
                                            ? 'text-foreground' 
                                            : 'hover:text-foreground'
                                        }
                                    `}
                                >
                                    {/* Glass morphism background for active state */}
                                    {isActive && (
                                        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-white/20 shadow-lg" />
                                    )}
                                    
                                    {/* Text with glow effect for active state */}
                                    <span className={`
                                        ${isActive 
                                            ? 'drop-shadow-[0_0_8px_rgba(147,51,234,0.6)] text-glow' 
                                            : ''
                                        }
                                    `}>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <div>
                    {showLanguageSwitcher && <LanguageSwitcher />}
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}