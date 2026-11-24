// WeSkill Training Institute mark: a graduation cap resting on a stack of books, on a dark rounded tile
// (so it reads on both the dark header and the cream sections). Amber cap = the brand accent.
import { useId } from 'react'

export default function LogoMark({ size = 44, className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={`logo-mark ${className}`} role="img" aria-label="WeSkill Training Institute logo">
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1E293B" /><stop offset="1" stopColor="#0B1120" /></linearGradient>
        <linearGradient id={`${id}cap`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FCD34D" /><stop offset="1" stopColor="#F59E0B" /></linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="16" fill={`url(#${id}bg)`} />
      <rect x="1.5" y="1.5" width="61" height="61" rx="15.5" fill="none" stroke="rgba(255,255,255,.12)" />
      {/* books */}
      <rect x="13" y="46" width="38" height="7" rx="1.6" fill="#F1E6CF" />
      <rect x="13" y="46" width="5" height="7" rx="1.4" fill="#475569" />
      <rect x="15.5" y="39.5" width="34" height="6.5" rx="1.6" fill="#E9DCC0" />
      <rect x="44" y="39.5" width="5.5" height="6.5" rx="1.4" fill="#9A3412" />
      <rect x="12" y="33" width="36" height="6.5" rx="1.6" fill="#F1E6CF" />
      <rect x="12" y="33" width="5" height="6.5" rx="1.4" fill="#1D4ED8" opacity=".85" />
      {/* cap */}
      <path d="M21 25.5v5.2c0 1.8 5 3.6 11 3.6s11-1.8 11-3.6v-5.2" fill="#D97706" />
      <g className="logo-mark-cap">
        <polygon points="32,11 56,20.5 32,30 8,20.5" fill={`url(#${id}cap)`} />
        <polygon points="32,11 56,20.5 32,30 8,20.5" fill="none" stroke="#FDE68A" strokeOpacity=".55" strokeWidth=".8" />
        <circle cx="32" cy="20.5" r="1.8" fill="#92400E" />
      </g>
      <g className="logo-mark-tassel">
        <path d="M32 20.5 L50 24 L50 33" fill="none" stroke="#92400E" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M48.4 33h3.2l.8 5.5h-4.8z" fill="#FDE68A" />
      </g>
    </svg>
  )
}
