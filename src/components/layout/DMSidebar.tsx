import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { MOCK_USERS } from '../../data/mockData'
import Avatar from '../shared/Avatar'

export default function DMSidebar() {
  const { direct_messages, active_dm_id, setActiveDM, current_user, users } = useAppStore()

  const getOtherUser = (dm: typeof direct_messages[0]) => {
    const otherId = dm.participants.find(id => id !== current_user.id)
    return users.find(u => u.id === otherId) || MOCK_USERS[0]
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m`
    if (diff < 24 * 60 * 60 * 1000) return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
    return `${d.getDate()}/${d.getMonth() + 1}`
  }

  return (
    <div className="flex flex-col w-[220px] h-full bg-bg-1 border-r border-white/[0.04] shrink-0">
      <div className="px-4 py-4 border-b border-white/[0.04] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text-1">Mensagens</h2>
          <p className="text-xs text-text-3 mt-0.5">Conversas diretas</p>
        </div>
        <button className="btn-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none py-2 px-2 space-y-0.5">
        {direct_messages.map(dm => {
          const otherUser = getOtherUser(dm)
          const isActive = active_dm_id === dm.id

          return (
            <motion.button
              key={dm.id}
              onClick={() => setActiveDM(dm.id)}
              whileHover={{ x: 2 }}
              className={`sidebar-item w-full text-left ${isActive ? 'active' : ''}`}
            >
              <div className="relative shrink-0">
                <Avatar user={otherUser} size="sm" />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-bg-1"
                  style={{
                    backgroundColor: otherUser.status === 'online' ? '#22d47a' : otherUser.status === 'away' ? '#f59e0b' : '#4a4a60'
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-medium truncate">{otherUser.name.split(' ')[0]}</span>
                  {dm.last_message_at && (
                    <span className="text-2xs text-text-3 shrink-0">{formatTime(dm.last_message_at)}</span>
                  )}
                </div>
                {dm.last_message && (
                  <p className="text-xs text-text-3 truncate mt-0.5">{dm.last_message}</p>
                )}
              </div>
              {(dm.unread ?? 0) > 0 && (
                <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-2xs font-semibold flex items-center justify-center">
                  {dm.unread}
                </span>
              )}
            </motion.button>
          )
        })}

        <div className="pt-2">
          <p className="px-3 py-1.5 text-2xs font-semibold text-text-3 tracking-widest uppercase">
            Colaboradores
          </p>
          {MOCK_USERS.filter(u => u.id !== current_user.id).map(user => (
            <motion.button
              key={user.id}
              whileHover={{ x: 2 }}
              className="sidebar-item w-full text-left"
            >
              <div className="relative shrink-0">
                <Avatar user={user} size="sm" />
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-bg-1"
                  style={{
                    backgroundColor: user.status === 'online' ? '#22d47a' : user.status === 'away' ? '#f59e0b' : '#4a4a60'
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{user.name.split(' ')[0]}</p>
                <p className="text-xs text-text-3 truncate">{user.role}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
