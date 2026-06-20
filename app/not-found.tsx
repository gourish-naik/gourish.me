'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!<>{}[]/?';
const SCRAMBLE_DURATION = 440; // ms
const RESOLVE_START = 0.62; // fraction of duration when chars start snapping to "404"

function rndGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

// Each floater's sinusoidal motion params
const FLOAT_PARAMS = [
  { fx: 0.38, fy: 0.29, px: 0.0, py: 1.2, ax: 52, ay: 28 },
  { fx: 0.22, fy: 0.43, px: 2.1, py: 0.4, ax: 36, ay: 42 },
  { fx: 0.31, fy: 0.25, px: 4.3, py: 3.0, ax: 48, ay: 33 },
];

// ── FloatingChars ─────────────────────────────────────────────────────────────
// Direct DOM manipulation to avoid 60fps React re-renders
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
          ref={el => {
            refsArr.current[i] = el;
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            // staggered initial offset so they don't stack on mount
            transform: `translate(calc(-50% + ${(i - 1) * 54}px), -50%)`,
          }}
          className="select-none font-mono text-5xl font-bold text-foreground"
        >
          {char}
        </span>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function NotFound() {
  const pathname = usePathname();

  // Last non-empty path segment, uppercased for matrix aesthetic
  const slug =
    pathname.split('/').filter(Boolean).pop()?.toUpperCase().slice(0, 12) ?? '';

  const [scrambled, setScrambled] = useState(slug || 'ERROR');
  const [phase, setPhase] = useState<'scramble' | 'float'>('scramble');
  const [floatVisible, setFloatVisible] = useState(false);

  // ── Scramble loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    const source = slug || 'ERROR';
    const start = Date.now();

    const tick = setInterval(() => {
      const t = Math.min((Date.now() - start) / SCRAMBLE_DURATION, 1);
      const resolveProgress = Math.max(0, (t - RESOLVE_START) / (1 - RESOLVE_START));

      // Build a scrambled string; characters resolve left-to-right as t → 1
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
        // Short pause at "404" before switching to floaters
        setTimeout(() => {
          setPhase('float');
          setFloatVisible(true);
        }, 120);
      }
    }, 35);

    return () => clearInterval(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fullPath = pathname !== '/' ? pathname : '';

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-10 px-4">
      {/* Animation container */}
      <div className="relative h-44 w-72 overflow-hidden rounded-xl border border-border/40 bg-muted/20 backdrop-blur-sm">
        {/* Scramble phase */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: phase === 'scramble' ? 1 : 0 }}
        >
          <span className="font-mono text-3xl font-bold tracking-[0.2em] text-foreground/75">
            {scrambled}
          </span>
        </div>

        {/* Float phase */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: phase === 'float' ? 1 : 0 }}
        >
          <FloatingChars visible={floatVisible} />
        </div>

        {/* Subtle corner label */}
        <span className="absolute right-3 top-2.5 font-mono text-[10px] tracking-widest text-muted-foreground/40">
          ERR
        </span>
      </div>

      {/* Path + message */}
      <div className="flex flex-col items-center gap-2 text-center">
        {fullPath && (
          <p className="font-mono text-xs tracking-wide text-muted-foreground/60">
            {fullPath}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          This page doesn&apos;t exist.
        </p>
      </div>

      <Link
        href="/"
        className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      >
        ← Back home
      </Link>
    </section>
  );
}
