// Tiny WebAudio synth for premium micro-sounds. No assets, no deps.
let ctx = null
let enabled = true

export function setSoundEnabled(v) {
  enabled = v
}

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq = 660, to = null, time = 0.12, type = 'sine', gain = 0.08, delay = 0 }) {
  const c = ac()
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + time)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + time)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + time + 0.05)
}

export function playComplete() {
  if (!enabled) return
  try {
    tone({ freq: 587, to: 880, time: 0.1, gain: 0.06 })
    tone({ freq: 880, to: 1175, time: 0.16, gain: 0.05, delay: 0.07 })
  } catch { /* audio unavailable */ }
}

export function playAdd() {
  if (!enabled) return
  try {
    tone({ freq: 440, to: 660, time: 0.08, gain: 0.045 })
  } catch { /* audio unavailable */ }
}

export function playPop() {
  if (!enabled) return
  try {
    tone({ freq: 320, to: 180, time: 0.09, type: 'triangle', gain: 0.05 })
  } catch { /* audio unavailable */ }
}

export function playFanfare() {
  if (!enabled) return
  try {
    tone({ freq: 523, time: 0.14, gain: 0.05 })
    tone({ freq: 659, time: 0.14, gain: 0.05, delay: 0.09 })
    tone({ freq: 784, time: 0.2, gain: 0.055, delay: 0.18 })
    tone({ freq: 1046, time: 0.3, gain: 0.05, delay: 0.27 })
  } catch { /* audio unavailable */ }
}
