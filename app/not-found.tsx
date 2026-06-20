'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!<>{}[]/?';
const SCRAMBLE_DURATION = 440;
const RESOLVE_START = 0.62;

const CONSOLAS = '"Consolas", "Courier New", monospace';

function rndGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

const FLOAT_PARAMS = [
  { fx: 0.38, fy: 0.29, px: 0.0, py: 1.2, ax: 52, ay: 28 },
  { fx: 0.22, fy: 0.43, px: 2.1, py: 0.4, ax: 36, ay: 42 },
  { fx: 0.31, fy: 0.25, px: 4.3, py: 3.0, ax: 48, ay: 33 },
];

function FloatingChars({ visible }: { visible: boolean }) {
  const refsArr = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const animate = () => {
      const t = (Date.now() - start) / 1000;
      FLOAT_PARAMS.forEach((p, i) => {
        const el = refsArr.current[i];
        if (!el) return;
        const x = Math.sin(t * p.fx + p.px) * p.ax;
        const y = Math.cos(t * p.fy + p.py) * p.ay;
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      });
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [visible]);

  return (
    <div className="relative h-full w-full">
      {(['4', '0', '4'] as const).map((char, i) => (
        <span
          key={i}
          ref={el => { refsArr.current[i] = el; }}
          style={{
            fontFamily: CONSOLAS,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${(i - 1) * 54}px), -50%)`,
          }}
          className="select-none text-5xl font-bold text-foreground"
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  const slug =
    pathname.split('/').filter(Boolean).pop()?.toUpperCase().slice(0, 12) ?? '';

  const [scrambled, setScrambled] = useState(slug || 'ERROR');
  const [phase, setPhase] = useState<'scramble' | 'float'>('scramble');
  const [floatVisible, setFloatVisible] = useState(false);

  useEffect(() => {
    const source = slug || 'ERROR';
    const start = Date.now();
    const tick = setInterval(() => {
      const t = Math.min((Date.now() - start) / SCRAMBLE_DURATION, 1);
      const resolveProgress = Math.max(0, (t - RESOLVE_START) / (1 - RESOLVE_START));
      let result = '';
      for (let i = 0; i < source.length; i++) {
        const charResolvedChance = Math.max(0, resolveProgress * source.length - i);
        if (i < 3 && charResolvedChance > 0.8) {
          result += '404'[i];
        } else {
          result += rndGlyph();
        }
      }
      setScrambled(result);
      if (t >= 1) {
        clearInterval(tick);
        setScrambled('404');
        setTimeout(() => { setPhase('float'); setFloatVisible(true); }, 120);
      }
    }, 35);
    return () => clearInterval(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fullPath = pathname !== '/' ? pathname : '';

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4">

      {/* Animation container — dotted pastel-red border */}
      <div
        className="relative h-44 w-72 overflow-hidden rounded-xl bg-muted/20 backdrop-blur-sm"
        style={{ border: '2px dotted #f4a0a0' }}
      >
        {/* Scramble */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: phase === 'scramble' ? 1 : 0 }}
        >
          <span
            style={{ fontFamily: CONSOLAS }}
            className="text-3xl font-bold tracking-[0.2em] text-foreground/80"
          >
            {scrambled}
          </span>
        </div>

        {/* Float */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: phase === 'float' ? 1 : 0 }}
        >
          <FloatingChars visible={floatVisible} />
        </div>

        {/* Corner label */}
        <span
          style={{ fontFamily: CONSOLAS, color: '#f4a0a0' }}
          className="absolute right-3 top-2.5 text-[10px] tracking-widest opacity-60"
        >
          ERR
        </span>
      </div>

      {/* Message */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        {fullPath && (
          <p
            style={{ fontFamily: CONSOLAS }}
            className="text-xs tracking-wide text-muted-foreground/60"
          >
            {fullPath}
          </p>
        )}
        <p className="text-sm font-medium text-foreground/80">
          This page doesn&apos;t exist.
        </p>
      </div>

      {/* Back | Home buttons */}
      <div
        className="flex items-stretch overflow-hidden rounded-md border border-border text-xs font-medium"
        style={{ fontFamily: CONSOLAS }}
      >
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          back
        </button>
        <span className="w-px bg-border" />
        <Link
          href="/"
          className="px-4 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          home
        </Link>
      </div>

    </section>
  );
}
