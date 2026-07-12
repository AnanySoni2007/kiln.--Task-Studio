import { forwardRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore, toast } from '../store'
import { todayStr, addDaysStr, PRIORITIES, fmtDue } from '../utils'
import { playAdd } from '../sound'
import { SunIcon, FlagIcon, PlusIcon } from './Icons'

const QuickAdd = forwardRef(function QuickAdd(_, inputRef) {
  const { state, dispatch } = useStore()
  const { view } = state

  const defaultDue = () =>
    view.type === 'today' ? todayStr() : view.type === 'upcoming' ? addDaysStr(1) : null
  const defaultProject = () =>
    view.type === 'project' ? view.projectId : state.projects[0]?.id

  const [title, setTitle] = useState('')
  const [due, setDue] = useState(defaultDue)
  const [priority, setPriority] = useState('none')
  const [projectId, setProjectId] = useState(defaultProject)
  const [focused, setFocused] = useState(false)

  // keep defaults in sync when the view changes
  useEffect(() => {
    setDue(defaultDue())
    setProjectId(defaultProject())
  }, [view.type, view.projectId]) // eslint-disable-line

  const submit = () => {
    if (!title.trim() || !projectId) return
    dispatch({ type: 'ADD_TASK', title, projectId, due, priority })
    setTitle('')
    setPriority('none')
    playAdd()
  }

  const expanded = focused || title.length > 0

  return (
    <motion.div
      className="quickadd"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.12, type: 'spring', stiffness: 300, damping: 26 }}
    >
      <div className="quickadd-row">
        <motion.span
          className="quickadd-plus"
          animate={{ rotate: expanded ? 45 : 0, scale: expanded ? 1.05 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <PlusIcon size={14} sw={2.2} />
        </motion.span>
        <input
          ref={inputRef}
          className="title"
          value={title}
          maxLength={140}
          placeholder="Add a task…"
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') e.target.blur()
          }}
        />
        <span className="kbd-hint">
          <kbd>N</kbd>
        </span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="quickadd-options">
              <button
                className={`chip ${due === todayStr() ? 'on' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDue(due === todayStr() ? null : todayStr())}
              >
                <SunIcon size={12} /> Today
              </button>
              <button
                className={`chip ${due === addDaysStr(1) ? 'on' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setDue(due === addDaysStr(1) ? null : addDaysStr(1))}
              >
                → Tomorrow
              </button>
              <input
                type="date"
                className="date-input"
                value={due ?? ''}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setDue(e.target.value || null)}
                title="Pick a date"
              />

              <span style={{ width: 1, height: 18, background: 'var(--border)' }} />

              {PRIORITIES.filter((p) => p.id !== 'none').map((p) => (
                <button
                  key={p.id}
                  className={`chip ${priority === p.id ? 'on' : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setPriority(priority === p.id ? 'none' : p.id)}
                >
                  <FlagIcon size={11} filled style={{ color: p.color }} />
                  {p.label}
                </button>
              ))}

              <span style={{ flex: 1 }} />

              <select
                className="select"
                value={projectId ?? ''}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {state.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

export default QuickAdd
