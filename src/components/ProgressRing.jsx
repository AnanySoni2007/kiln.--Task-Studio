import { motion } from 'framer-motion'

export default function ProgressRing({
  size = 18,
  stroke = 2.5,
  pct = 0,
  color = 'var(--accent)',
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const half = size / 2
  return (
    <svg width={size} height={size} className="ring">
      <circle cx={half} cy={half} r={r} stroke="var(--border-strong)" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={half}
        cy={half}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={false}
        animate={{ strokeDashoffset: c * (1 - pct / 100) }}
        transition={{ type: 'spring', stiffness: 70, damping: 16 }}
        transform={`rotate(-90 ${half} ${half})`}
      />
    </svg>
  )
}
