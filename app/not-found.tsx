'use client';

import Link from 'next/link';
import GridBackground from '../components/GridBackground';


export default function NotFound() {
  return (
    <main className="relative flex items-center justify-center h-screen overflow-hidden bg-background font-sans text-foreground">
      {/* Animated background */}
      <GridBackground />
      
      {/* Orbs with random float animation */}
      <div
        className="absolute w-[300px] h-[300px] bg-orb-cyan rounded-full filter blur-xl animate-float-1"
        style={{ top: '15%', left: '20%' }}
      />
      <div
        className="absolute w-[400px] h-[400px] bg-orb-magenta rounded-full filter blur-xl animate-float-2"
        style={{ bottom: '15%', right: '25%' }}
      />

      {/* Floating symbols */}
      <div className="absolute text-lg font-semibold text-blue-500 opacity-45 animate-float-symbol" style={{ top: '20%', left: '15%' }}>&lt;/&gt;</div>
      <div className="absolute text-lg font-semibold text-emerald-500 opacity-45 animate-float-symbol [animation-delay:1s]" style={{ top: '40%', right: '20%' }}>{`{ }`}</div>
      <div className="absolute text-lg font-semibold text-fuchsia-600 opacity-45 animate-float-symbol [animation-delay:2s]" style={{ bottom: '30%', left: '25%' }}>[ ]</div>
      <div className="absolute text-lg font-semibold text-pink-700 opacity-45 animate-float-symbol [animation-delay:1.5s]" style={{ top: '60%', right: '15%' }}>( )</div>

      <div className="relative z-10 max-w-xl text-center p-8">
        <div className="text-[clamp(6rem,20vw,12rem)] font-black leading-none mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent animate-glitch">
          404
        </div>
        <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold mb-4">
          <span className="inline-block text-3xl text-accent opacity-60 animate-pulse">{"{"}</span>
          Page Not Found
          <span className="inline-block text-3xl text-accent opacity-60 animate-pulse">{"}"}</span>
        </h1>
        <p className="text-[clamp(1rem,2vw,1.125rem)] text-muted-foreground leading-relaxed mb-10">
          Oops! Looks like this page took a wrong turn in the codebase. <br />
          But hey, every bug leads to a new discovery!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-base bg-primary text-primary-foreground shadow-[0_4px_20px_oklch(0.55_0.22_270_/_0.3)] transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_30px_oklch(0.55_0.22_270_/_0.4)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back Home
          </Link>

          <button 
            onClick={() => history.back()} 
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-base bg-card text-foreground border-2 border-border transition-all hover:bg-muted hover:translate-y-[-2px]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Go Back
          </button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Built with ❤️ by <span className="font-semibold text-primary">Gourishankar Menavath</span>
        </p>
      </div>
    </main>
  );
}
