// import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { cn } from "@/lib/utils";

import "./globals.css";
import Providers from '@/components/providers';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({subsets:['latin'], variable:'--font-sans'})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif'
  
})

// app/page.tsx or app/layout.tsx
export const metadata = {
  title: "Gourishankar Menavath | Frontend Developer",
  description:
    "Portfolio of Gourishankar Menavath, a Frontend Developer with 3+ years of experience specializing in ReactJS, NextJS, and e-commerce solutions.",
  keywords: [
    "Frontend Developer",
    "ReactJS",
    "NextJS",
    "Magento PWA",
    "JavaScript",
    "Tailwind CSS",
    "Portfolio",
    "Gourishankar Menavath",
    "Web Developer",
    "E-commerce Developer",
  ],
  authors: [{ name: "Gourishankar Menavath" }],
  creator: "Gourishankar Menavath",
  openGraph: {
    title: "Gourishankar Menavath | Frontend Developer",
    description:
      "Frontend Developer with expertise in ReactJS, NextJS, and e-commerce platforms. Check out my portfolio and projects.",
    url: "https://igourish.in",
    siteName: "igourish",
    images: [
      {
        url: "https://igourish.in/assets/me.jpeg",
        width: 1200,
        height: 630,
        alt: "Gourishankar Menavath Portfolio",
      },
    ],
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Gourishankar Menavath | Frontend Developer",
  //   description:
  //     "Explore my work in React, NextJS, and e-commerce development.",
  //   images: ["https://yourdomain.com/og-image.jpg"],
  // },
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
          <Footer />
        </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
