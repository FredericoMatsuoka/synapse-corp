import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'

export default function AIButton() {
  const { toggleAIPanel, ui } = useAppStore()

  if (ui.ai_panel_open) return null

  return (
    <motion.button
      onClick={toggleAIPanel}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-float z-50 flex items-center justify-center animate-glow-pulse"
      style={{ background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)' }}
      title="Abrir IA Synapse"
    >
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="8" r="3" fill="white" opacity="0.9" />
        <circle cx="6" cy="20" r="3" fill="white" opacity="0.7" />
        <circle cx="22" cy="20" r="3" fill="white" opacity="0.7" />
        <line x1="14" y1="8" x2="6" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="14" y1="8" x2="22" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
        <line x1="6" y1="20" x2="22" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
      </svg>
    </motion.button>
  )
}
