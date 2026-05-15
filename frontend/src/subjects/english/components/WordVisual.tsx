import type { Word } from '../data/vocabulary';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const sizeClass: Record<Size, string> = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
};

const textSizeClass: Record<Size, string> = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-7xl',
};

export function WordVisual({ word, size = 'md' }: { word: Word; size?: Size }) {
  const custom = customVisuals[word.english];
  if (custom) {
    return (
      <span className={`inline-flex shrink-0 items-center justify-center ${sizeClass[size]}`} aria-label={word.english}>
        {custom}
      </span>
    );
  }

  return (
    <span className={`inline-flex shrink-0 items-center justify-center leading-none ${textSizeClass[size]}`} aria-label={word.english}>
      {word.emoji}
    </span>
  );
}

const customVisuals: Record<string, JSX.Element> = {
  desk: (
    <svg viewBox="0 0 96 96" role="img" className="h-full w-full">
      <rect x="18" y="31" width="60" height="13" rx="4" fill="#c68642" />
      <rect x="23" y="44" width="8" height="34" rx="3" fill="#8b5a2b" />
      <rect x="65" y="44" width="8" height="34" rx="3" fill="#8b5a2b" />
      <rect x="26" y="23" width="44" height="9" rx="3" fill="#e0a15c" />
      <path d="M30 60h36" stroke="#6b3f1d" strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  board: (
    <svg viewBox="0 0 96 96" role="img" className="h-full w-full">
      <rect x="13" y="18" width="70" height="47" rx="5" fill="#256d4f" />
      <rect x="18" y="23" width="60" height="35" rx="3" fill="#2f8a63" />
      <path d="M28 37h31M28 49h20" stroke="#e7fff3" strokeWidth="5" strokeLinecap="round" />
      <rect x="20" y="66" width="56" height="6" rx="3" fill="#8b5a2b" />
      <rect x="44" y="72" width="8" height="12" rx="3" fill="#8b5a2b" />
    </svg>
  ),
  coat: (
    <svg viewBox="0 0 96 96" role="img" className="h-full w-full">
      <path d="M35 18h26l10 18 3 43H22l3-43 10-18Z" fill="#7c3f24" />
      <path d="M39 18l9 18 9-18" fill="#f3d0b6" />
      <path d="M48 36v42" stroke="#4a2415" strokeWidth="5" strokeLinecap="round" />
      <path d="M31 36l-8 19M65 36l8 19" stroke="#5d2e1a" strokeWidth="8" strokeLinecap="round" />
      <circle cx="42" cy="49" r="3" fill="#f6d365" />
      <circle cx="42" cy="61" r="3" fill="#f6d365" />
    </svg>
  ),
  jacket: (
    <svg viewBox="0 0 96 96" role="img" className="h-full w-full">
      <path d="M33 19h30l13 23-9 10-6-10v36H35V42l-6 10-9-10 13-23Z" fill="#2563eb" />
      <path d="M40 19l8 15 8-15" fill="#bfdbfe" />
      <path d="M48 34v44" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round" />
      <path d="M38 54h20" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
      <circle cx="43" cy="45" r="2.5" fill="#dbeafe" />
      <circle cx="43" cy="58" r="2.5" fill="#dbeafe" />
    </svg>
  ),
};

