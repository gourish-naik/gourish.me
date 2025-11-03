'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './languageswitcher';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

export default function FloatingActionButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const isProjectOrWorkPage = pathname.includes('/projects') || pathname.includes('/work');

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isProjectOrWorkPage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isProjectOrWorkPage]);

  if (isProjectOrWorkPage) {
    return (
      <div className={`fixed bottom-8 right-8 z-50 transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Button onClick={scrollToTop} size="icon">
          <ArrowUp />
        </Button>
      </div>
    );
  }

  const isHomeOrTouchPage = pathname === '/' || pathname.includes('/touch');

  if (isHomeOrTouchPage) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <LanguageSwitcher />
      </div>
    );
  }

  return null;
}
