import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore, toast } from '../store'
import { PROJECT_COLORS, PROJECT_ICONS } from '../utils'

export default function ProjectModal({ mode, project, onClose }) {
  const { dispatch } = useStore()
  const editing = mode === 'edit'
  const [name, setName] = useState(editing ? project.name : '')
  const [color, setColor] = useState(editing ? project.color : PROJECT_COLORS[0])
  const [icon, setIcon] = useState(editing ? project.icon : PROJECT_ICONS[0])
  const [confirmDelete, setConfirmDelete] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(t)
  }, [])

  const submit = () => {
    if (!name.trim()) {
      inputRef.current?.focus()
      return
    }
    if (editing) {
      dispatch({ type: 'UPDATE_PROJECT', id: project.id, patch: { name, color, icon } })
      toast('Project updated', '✓')
    } else {
      dispatch({ type: 'ADD_PROJECT', name, color, icon })
      toast(`“${name.trim()}” created`, icon)
    }
    onClose()
  }

  const remove = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    dispatch({ type: 'DELETE_PROJECT', id: project.id })
    toast('Project deleted', '🗑')
    onClose()
  }

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.tagName === 'INPUT') submit()
        }}
      >
        <h2>{editing ? 'Edit project' : 'New project'}</h2>

        <label>Name</label>
        <input
          ref={inputRef}
          type="text"
          value={name}
          maxLength={40}
          placeholder="e.g. Side Hustle"
          onChange={(e) => setName(e.target.value)}
        />

        <label>Color</label>
        <div className="swatch-row">
          {PROJECT_COLORS.map((c) => (
            <motion.button
              key={c}
              className={`swatch ${color === c ? 'on' : ''}`}
              style={{ background: c, color: c }}
              onClick={() => setColor(c)}
              whileTap={{ scale: 0.85 }}
            />
          ))}
        </div>

        <label>Icon</label>
        <div className="icon-row">
          {PROJECT_ICONS.map((i) => (
            <motion.button
              key={i}
              className={`icon-choice ${icon === i ? 'on' : ''}`}
              onClick={() => setIcon(i)}
              whileTap={{ scale: 0.85 }}
            >
              {i}
            </motion.button>
          ))}
        </div>

        <div className="modal-actions">
          {editing && (
            <button className="danger-btn" style={{ marginRight: 'auto', height: 38 }} onClick={remove}>
              {confirmDelete ? 'Delete project & tasks?' : 'Delete'}
            </button>
          )}
          <button className="btn ghost" onClick={onClose}>
            Cancel
          </button>
          <motion.button className="btn primary" onClick={submit} whileTap={{ scale: 0.96 }}>
            {editing ? 'Save' : 'Create project'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
