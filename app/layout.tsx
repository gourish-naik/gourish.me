import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";
import Providers from '@/components/providers';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from 'next-intl';
import FloatingActionButton from '@/components/floating-action-button';

const inter = Inter({subsets:['latin'], variable:'--font-sans'})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
  
})

export const metadata: Metadata = {
  metadataBase: new URL("https://igourish.in"),
  title: {
    default: "Gourishankar Menavath | React & Next.js E-commerce Consultant",
    template: "%s | iGourish",
  },
  description:
    "4+ years building fast, scalable storefronts with React, Next.js, and Magento PWA Studio for global e-commerce brands.",
  keywords: [
    "E-commerce Frontend Consultant",
    "Magento PWA Studio",
    "Next.js Developer",
    "ReactJS",
    "Headless Commerce",
    "Core Web Vitals",
    "JavaScript",
    "Tailwind CSS",
    "Portfolio",
    "Gourishankar Menavath",
  ],
  authors: [{ name: "Gourishankar Menavath" }],
  creator: "Gourishankar Menavath",
  openGraph: {
    title: "Gourishankar Menavath | React & Next.js E-commerce Consultant",
    description:
      "4+ years building fast, scalable e-commerce storefronts with React, Next.js & Magento PWA Studio. Available for freelance projects.",
    url: "https://igourish.in",
    siteName: "iGourish",
    images: [
      {
        url: "/images/og/home.png",
        width: 1200,
        height: 630,
        alt: "iGourish — Growing ideas. Building impact.",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gourishankar Menavath | React & Next.js E-commerce Consultant",
    description:
      "4+ years building fast, scalable e-commerce storefronts with React, Next.js & Magento PWA Studio. Available for freelance projects.",
    images: ["/images/og/home.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn('flex min-h-screen flex-col font-sans antialiased',
          inter.variable,
          playfair.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
        <Providers>
          <Header />
          <main className="grow">
            {children}
          </main>
          <FloatingActionButton />
          <Footer />
        </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
