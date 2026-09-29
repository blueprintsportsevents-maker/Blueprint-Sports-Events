import React from 'react';

interface BlueprintLogoProps {
  className?: string;
  variant?: 'icon' | 'badge' | 'full';
  size?: number;
}

export const BlueprintLogo: React.FC<BlueprintLogoProps> = ({
  className = 'w-10 h-10',
  variant = 'badge'
}) => {
  if (variant === 'icon' || variant === 'badge') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Blueprint Sports Event Logo"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bp-wing-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <linearGradient id="bp-shield-border" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          <linearGradient id="bp-shield-bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#08142c" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="bp-runner-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="bp-star-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <filter id="bp-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- LEFT WINGS (Laurel / Wings flanking shield) --- */}
        <g fill="url(#bp-wing-grad)" stroke="#091325" strokeWidth="1.2">
          {/* Wing feathers left */}
          <path d="M 22 36 C 14 38, 8 46, 7 54 C 11 53, 17 50, 22 45 Z" />
          <path d="M 24 44 C 15 48, 10 57, 10 65 C 15 63, 20 59, 25 53 Z" />
          <path d="M 27 52 C 19 57, 16 66, 17 73 C 21 70, 25 66, 29 60 Z" />
          <path d="M 32 60 C 26 66, 25 73, 27 79 C 30 76, 34 71, 36 66 Z" />
        </g>

        {/* --- RIGHT WINGS --- */}
        <g fill="url(#bp-wing-grad)" stroke="#091325" strokeWidth="1.2">
          {/* Wing feathers right */}
          <path d="M 78 36 C 86 38, 92 46, 93 54 C 89 53, 83 50, 78 45 Z" />
          <path d="M 76 44 C 85 48, 90 57, 90 65 C 85 63, 80 59, 75 53 Z" />
          <path d="M 73 52 C 81 57, 84 66, 83 73 C 79 70, 75 66, 71 60 Z" />
          <path d="M 68 60 C 74 66, 75 73, 73 79 C 70 76, 66 71, 64 66 Z" />
        </g>

        {/* --- SHIELD BASE --- */}
        {/* Shield Outer Border */}
        <path
          d="M 50 12 L 76 18 C 76 45, 68 66, 50 78 C 32 66, 24 45, 24 18 Z"
          fill="url(#bp-shield-border)"
          stroke="#050c1a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Shield Inner Core */}
        <path
          d="M 50 16 L 73 21 C 73 44, 66 63, 50 74 C 34 63, 27 44, 27 21 Z"
          fill="url(#bp-shield-bg)"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* --- SPEED STREAKS / MOTION LINES BEHIND RUNNER --- */}
        <g stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
          <line x1="31" y1="28" x2="43" y2="28" />
          <line x1="29" y1="33" x2="47" y2="33" strokeWidth="2" />
          <line x1="30" y1="38" x2="44" y2="38" />
          <line x1="32" y1="43" x2="41" y2="43" strokeWidth="1.8" />
          <line x1="30" y1="48" x2="38" y2="48" />
          <line x1="33" y1="53" x2="42" y2="53" />
        </g>

        {/* Cyan secondary accent speed rays */}
        <g stroke="#60a5fa" strokeWidth="1" strokeLinecap="round" opacity="0.6">
          <line x1="29" y1="25" x2="37" y2="25" />
          <line x1="33" y1="30" x2="40" y2="30" />
          <line x1="34" y1="46" x2="45" y2="46" />
        </g>

        {/* --- THE SPRINTER RUNNER IN POWERFUL FORWARD LUNGE --- */}
        {/* Head */}
        <circle cx="64" cy="27" r="3.8" fill="#ffffff" stroke="#050c1a" strokeWidth="0.8" />
        {/* Face angle / Jaw / Hair */}
        <path d="M 64 24 L 67 27 L 64 29 L 61 27 Z" fill="#93c5fd" />

        {/* Torso & Musculature */}
        <path
          d="M 57 32 C 61 30, 65 30, 67 33 C 65 37, 61 40, 56 42 C 54 39, 54 35, 57 32 Z"
          fill="url(#bp-runner-body)"
          stroke="#050c1a"
          strokeWidth="0.8"
        />

        {/* Lead Right Arm (Pumping forward & up) */}
        <path
          d="M 65 32 L 71 34 L 72 40 L 70 41 L 68 36 L 64 34 Z"
          fill="#ffffff"
          stroke="#050c1a"
          strokeWidth="0.7"
        />

        {/* Trailing Left Arm (Extended back) */}
        <path
          d="M 58 35 L 49 31 L 43 32 L 44 34 L 50 33 L 56 38 Z"
          fill="#93c5fd"
          stroke="#050c1a"
          strokeWidth="0.7"
        />

        {/* Running Shorts / Hip */}
        <path
          d="M 56 41 C 59 41, 62 42, 63 45 L 56 49 L 52 46 C 53 43, 54 42, 56 41 Z"
          fill="#0284c7"
          stroke="#050c1a"
          strokeWidth="0.7"
        />

        {/* Lead Right Leg (High Knee Driving Forward) */}
        <path
          d="M 61 44 L 67 47 L 68 53 L 64 56 L 64 51 L 59 48 Z"
          fill="url(#bp-runner-body)"
          stroke="#050c1a"
          strokeWidth="0.8"
        />
        {/* Right Foot Spike */}
        <path d="M 64 55 L 67 56 L 66 58 L 62 57 Z" fill="#38bdf8" stroke="#050c1a" strokeWidth="0.6" />

        {/* Trail Left Leg (Extending Back with Foot Plant) */}
        <path
          d="M 53 46 L 46 51 L 39 57 L 35 62 L 34 60 L 40 54 L 48 48 Z"
          fill="#bfdbfe"
          stroke="#050c1a"
          strokeWidth="0.8"
        />
        {/* Left Foot Spike (Trailing kick) */}
        <path d="M 35 60 L 32 63 L 34 64 L 37 61 Z" fill="#38bdf8" stroke="#050c1a" strokeWidth="0.6" />

        {/* --- LOWER RIBBON / STAR BANNER --- */}
        {/* Banner Wings / Tail */}
        <path
          d="M 20 83 L 34 81 L 33 87 L 19 89 Z"
          fill="#0284c7"
          stroke="#050c1a"
          strokeWidth="1"
        />
        <path
          d="M 80 83 L 66 81 L 67 87 L 81 89 Z"
          fill="#0284c7"
          stroke="#050c1a"
          strokeWidth="1"
        />

        {/* Center Plaque */}
        <rect
          x="30"
          y="80"
          width="40"
          height="8.5"
          rx="2"
          fill="#091325"
          stroke="#38bdf8"
          strokeWidth="1.2"
        />

        {/* Central 5-point Star */}
        <polygon
          points="50,78 52,82 56.5,82.5 53,85.5 54,90 50,87.5 46,90 47,85.5 43.5,82.5 48,82"
          fill="url(#bp-star-gold)"
          stroke="#020617"
          strokeWidth="0.7"
        />

        {/* Star highlight dots */}
        <circle cx="40" cy="84" r="0.9" fill="#38bdf8" />
        <circle cx="60" cy="84" r="0.9" fill="#38bdf8" />
      </svg>
    );
  }

  // Full variant includes typography badge
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <BlueprintLogo variant="badge" className="w-10 h-10 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="font-chakra font-black tracking-wider text-base text-white uppercase leading-none drop-shadow-sm flex items-center gap-1.5">
          BLUEPRINT <span className="text-sky-400">SPORTS</span>
        </span>
        <span className="text-[10px] font-bold text-sky-400/90 tracking-widest uppercase font-mono-timing leading-tight mt-0.5">
          EVENT &bull; TIMING SYSTEM
        </span>
      </div>
    </div>
  );
};
