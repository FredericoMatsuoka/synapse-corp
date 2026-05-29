import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'

const CloseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const TYPE_ICONS: Record<string, React.ReactNode> = {
  mention: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
  ),
  dm: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  task: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  system: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

const TYPE_COLORS: Record<string, string> = {
  mention: '#7c6fff',
  dm: '#3b82f6',
  task: '#f59e0b',
  system: '#6b7280',
  ai: '#22d47a',
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'Agora'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`
  return d.toLocaleDateString('pt-BR')
}

export default function NotificationsPanel() {
  const { ui, toggleNotifications, notifications, markNotificationRead } = useAppStore()

  return (
    <AnimatePresence>
      {ui.notifications_open && (
        <>
          <motion.div
            key="notif-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleNotifications}
            className="fixed inset-0 z-30"
          />
          <motion.div
            key="notif-panel"
            initial={{ opacity: 0, x: -20, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-[60px] top-16 w-80 max-h-[480px] flex flex-col rounded-18 shadow-float z-40 overflow-hidden"
            style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-semibold text-text-1">Notificacoes</h3>
                <p className="text-2xs text-text-3">{notifications.filter(n => !n.read).length} nao lidas</p>
              </div>
              <button onClick={toggleNotifications} className="btn-icon">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-text-3 text-center py-8">Sem notificacoes</p>
              ) : (
                notifications.map(n => {
                  return (
                    <motion.button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                      className={`flex items-start gap-3 w-full px-4 py-3 transition-colors ${!n.read ? 'bg-white/[0.02]' : ''}`}
                    >
                      <div
                        className="w-7 h-7 rounded-8 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${TYPE_COLORS[n.type]}20`, color: TYPE_COLORS[n.type] }}
                      >
                        {TYPE_ICONS[n.type]}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium text-text-1">{n.title}</p>
                          <span className="text-2xs text-text-3 shrink-0">{formatTime(n.timestamp)}</span>
                        </div>
                        <p className="text-xs text-text-3 mt-0.5 leading-relaxed">{n.body}</p>
                      </div>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      )}
                    </motion.button>
                  )
                })
              )}
            </div>

            <div className="px-4 py-3 border-t border-white/5">
              <button className="text-xs text-accent hover:text-accent-hover transition-colors w-full text-center">
                Marcar todas como lidas
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
