import { useEffect, useRef } from 'react'

const INTERACTIVE =
  'button, input, textarea, select, a, [role="button"], .task-row, .nav-item, .chip, .palette-item, .swatch, .icon-choice, .checkbox, .grip'

// Custom cursor: dot pinned to the pointer, ring trailing with easing.
// Driven by direct DOM writes in a rAF loop — no React re-renders.
export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    const ring = ringRef.current
    const dot = dotRef.current
    let tx = -100
    let ty = -100
    let rx = -100
    let ry = -100
    let raf

    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`
    }
    const loop = () => {
      rx += (tx - rx) * 0.18
      ry += (ty - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    const over = (e) => {
      if (e.target.closest(INTERACTIVE)) ring.classList.add('big')
    }
    const out = (e) => {
      if (e.target.closest(INTERACTIVE)) ring.classList.remove('big')
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
