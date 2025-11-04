// components/GridBackground.tsx
export default function GridBackground() {
  return (
    <div
      className="
        fixed top-0 left-0 w-full h-full 
        bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)]
        bg-[size:50px_50px] 
        opacity-30 
        animate-grid-move
        pointer-events-none
        transition-colors
        duration-700
      "
    />
  );
}
