// Trainingcred mark: an optical-illusion cube.
// A large isometric cube with a small cube set into its front corner. The eye flips between
// "a small cube sitting on the corner" and "a cube with its corner cut away" (the classic
// missing-corner illusion). Teal faces = the brand, amber top = the accent.
import { useId } from 'react'

const R = 28, C = 32, H = R * Math.sqrt(3) / 2
const P = (x, y) => `${x.toFixed(2)},${y.toFixed(2)}`
// big hexagon corners
const T = [C, C - R], UR = [C + H, C - R / 2], LR = [C + H, C + R / 2], B = [C, C + R], LL = [C - H, C + R / 2], UL = [C - H, C - R / 2], O = [C, C]
// small cube at the centre, half size
const r = R / 2, h = H / 2
const t = [C, C - r], ur = [C + h, C - r / 2], lr = [C + h, C + r / 2], b = [C, C + r], ll = [C - h, C + r / 2], ul = [C - h, C - r / 2]
const poly = (...pts) => pts.map((p) => P(...p)).join(' ')

export default function LogoCube({ size = 36, className = '', animated = true }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={`${animated ? 'logo-cube' : ''} ${className}`} role="img" aria-label="Trainingcred logo">
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8FF0DF" /><stop offset="1" stopColor="#3CC4AF" /></linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0E3A5E" /><stop offset="1" stopColor="#081F35" /></linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#12A28F" /><stop offset="1" stopColor="#0B6E61" /></linearGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD889" /><stop offset="1" stopColor="#F5A524" /></linearGradient>
      </defs>
      {/* big cube */}
      <polygon points={poly(T, UR, O, UL)} fill={`url(#${id}t)`} />
      <polygon points={poly(UL, O, B, LL)} fill={`url(#${id}l)`} />
      <polygon points={poly(O, UR, LR, B)} fill={`url(#${id}r)`} />
      {/* small cube in the corner: same three-tone shading, amber top */}
      <g className="logo-cube-inner">
        <polygon points={poly(t, ur, O, ul)} fill={`url(#${id}a)`} />
        <polygon points={poly(ul, O, b, ll)} fill="#06172A" />
        <polygon points={poly(O, ur, lr, b)} fill="#0A5C51" />
      </g>
      {/* crisp edges */}
      <g fill="none" stroke="rgba(255,255,255,.55)" strokeWidth=".7" strokeLinejoin="round">
        <polygon points={poly(T, UR, LR, B, LL, UL)} />
        <polyline points={poly(ul, O, ur)} />
        <polyline points={poly(O, b)} />
      </g>
    </svg>
  )
}

// Same mark as a standalone SVG string (used for favicon generation)
export const LOGO_POLYS = { T, UR, LR, B, LL, UL, O, t, ur, lr, b, ll, ul }
