'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Languages } from 'lucide-react'
import { useRouter } from 'next/navigation'

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'te', label: 'Telugu' },
    { code: 'ro', label: 'Romanian' },
    { code: 'ar', label: 'Arabic' },
    { code: 'fr', label: 'French' },
    //   { code: 'es', label: 'Spanish' }
]

const languageMap = LANGUAGES.reduce((acc, lang) => {
    acc[lang.code] = lang.label;
    return acc;
}, {} as Record<string, string>);


export default function LanguageSwitcher() {
    const [locale, setLocale] = useState<string>('en')
    const router = useRouter()

    useEffect(() => {
        const cookieLocale = document.cookie
            .split('; ')
            .find(row => row.startsWith('INEXT_LOCALE='))
            ?.split('=')[1]

        if (cookieLocale) {
            setLocale(cookieLocale)
        } else {
            const browserLocale = navigator.language.slice(0, 2) || 'en'
            setLocale(browserLocale)
            document.cookie = `INEXT_LOCALE=${browserLocale};`
            router.refresh()
        }
    }, [router])

    const handleLanguageChange = (lang: string) => {
        setLocale(lang)
        document.cookie = `INEXT_LOCALE=${lang};`
        router.refresh()
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost" title={languageMap[locale]}>
                    <Languages className="size-4 mr-2" />
                    <span>{locale.toUpperCase()}</span>
                    <span className="sr-only">Language Switcher</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
                {LANGUAGES.map(({ code, label }) => (
                    <Button
                        key={code}
                        variant={locale === code ? 'default' : 'ghost'}
                        className="w-full justify-start mb-1"
                        size="sm"
                        onClick={() => handleLanguageChange(code)}
                    >
                        {label}
                    </Button>
                ))}
            </PopoverContent>
        </Popover>
    )
}
