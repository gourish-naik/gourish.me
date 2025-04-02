'use client'

import { useTheme, ThemeProvider } from 'next-themes';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            enableSystem
            attribute="class"
            defaultTheme='system'
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
    )
}
