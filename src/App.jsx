import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store'
import Loader from './components/Loader'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import QuickAdd from './components/QuickAdd'
import TaskList from './components/TaskList'
import ProjectModal from './components/ProjectModal'
import CommandPalette from './components/CommandPalette'
import Toasts from './components/Toasts'
import Cursor from './components/Cursor'
import { MenuIcon } from './components/Icons'

export default function App() {
  const { state } = useStore()
  const [booted, setBooted] = useState(false)
  const reveal = useCallback(() => setBooted(true), [])
  const [query, setQuery] = useState('')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [projectModal, setProjectModal] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)
  const quickAddRef = useRef(null)
  const searchRef = useRef(null)

  const viewKey = `${state.view.type}-${state.view.projectId ?? ''}`

  // reset search when switching views
  useEffect(() => {
    setQuery('')
  }, [viewKey])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
        return
      }
      const t = e.target
      const typing =
        t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable
      if (typing || paletteOpen || projectModal) return
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        quickAddRef.current?.focus()
      } else if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paletteOpen, projectModal])

  // The loader overlays everything at z-20000, calls reveal() as it starts
  // fading, then removes itself. The app mounts at that moment, so its
  // entrance animations play through the fade. The Loader sits at a stable
  // position in the fragment so it never remounts mid-sequence.
  return (
    <>
      <Loader onReveal={reveal} />
      {booted && (
        <div className="app">
          <div className="aurora">
            <div className="blob b1" />
            <div className="blob b2" />
            <div className="blob b3" />
          </div>
          <div className="noise" />
          <Cursor />

      <button className="mobile-menu-btn" onClick={() => setMobileNav(!mobileNav)}>
        <MenuIcon size={16} />
      </button>

      <Sidebar
        onNewProject={() => setProjectModal({ mode: 'new' })}
        onEditProject={(p) => setProjectModal({ mode: 'edit', project: p })}
        mobileOpen={mobileNav}
        closeMobile={() => setMobileNav(false)}
      />

      <main className="main">
        <Header
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
          openPalette={() => setPaletteOpen(true)}
        />
        <div className="main-scroll">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewKey}
              className="view-content"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <QuickAdd ref={quickAddRef} />
              <TaskList query={query} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {projectModal && (
          <ProjectModal
            mode={projectModal.mode}
            project={projectModal.project}
            onClose={() => setProjectModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {paletteOpen && (
          <CommandPalette
            onClose={() => setPaletteOpen(false)}
            onNewProject={() => setProjectModal({ mode: 'new' })}
          />
        )}
      </AnimatePresence>

          <Toasts />
        </div>
      )}
    </>
  )
}
