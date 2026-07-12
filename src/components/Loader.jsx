import { useEffect, useState } from 'react'
import { APP_NAME, APP_LABEL } from '../brand'

// Typewriter boot screen: types the app name, holds, then fades out
// while the app's entrance animations play underneath.
export default function Loader({ onReveal }) {
  const [chars, setChars] = useState(0)
  const [phase, setPhase] = useState('typing') // typing → hold → fading → gone
  const total = APP_NAME.length + 1 // +1 types the terracotta dot

  useEffect(() => {
    if (phase !== 'typing') return
    if (chars >= total) {
      const t = setTimeout(() => setPhase('fading'), 650)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setChars((c) => c + 1), chars === 0 ? 380 : 105)
    return () => clearTimeout(t)
  }, [chars, phase, total])

  useEffect(() => {
    if (phase !== 'fading') return
    onReveal()
    const t = setTimeout(() => setPhase('gone'), 600)
    return () => clearTimeout(t)
  }, [phase, onReveal])

  if (phase === 'gone') return null

  return (
    <div className={`loader ${phase === 'fading' ? 'hidden' : ''}`} aria-hidden="true">
      <div className="type-label">{APP_LABEL}</div>
      <div className="type-line">
        {APP_NAME.slice(0, Math.min(chars, APP_NAME.length))}
        {chars > APP_NAME.length && <span className="type-dot">.</span>}
        <span className={`type-cursor ${phase === 'fading' ? 'stop' : ''}`} />
      </div>
    </div>
  )
}
