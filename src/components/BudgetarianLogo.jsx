import { useId } from 'react';

export function BudgetarianLogo({ size = 'medium' }) {
  const gradientId = useId();

  const dimensions = {
    small:  { width: 32,  height: 32  },
    medium: { width: 40,  height: 40  },
    large:  { width: 80,  height: 80  },
  };

  const { width, height } = dimensions[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      {/* Leaf shape */}
      <path
        d="M 20 5 Q 12 8 10 18 Q 8 28 15 33 Q 18 35 20 36 Q 22 35 25 33 Q 32 28 30 18 Q 28 8 20 5 Z"
        fill={`url(#${gradientId})`}
      />
      {/* Leaf vein */}
      <path
        d="M 20 8 Q 20 15 20 28"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
      />
      {/* Peso coin */}
      <circle cx="28" cy="12" r="8" fill="#FBBF24" />
      <circle cx="28" cy="12" r="8" stroke="#F59E0B" strokeWidth="1.5" />
      <circle cx="28" cy="12" r="6" fill="#FDE68A" opacity="0.3" />
      {/* Peso sign */}
      <text
        x="28"
        y="16.5"
        fontSize="11"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
      >
        ₱
      </text>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#65A30D" />
        </linearGradient>
      </defs>
    </svg>
  );
}
