import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import Avatar from '../shared/Avatar'

type NavView = 'channels' | 'dm' | 'admin'

interface NavItem {
  id: NavView
  label: string
  icon: React.ReactNode
}

const HashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
  </svg>
)

const DMIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const AdminIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export default function NavRail() {
  const { view, setView, notifications, ui, toggleNotifications, toggleSearch, openProfile, current_user } = useAppStore()

  const unreadNotifications = notifications.filter(n => !n.read).length

  const navItems: NavItem[] = [
    { id: 'channels', label: 'Canais', icon: <HashIcon /> },
    { id: 'dm', label: 'Mensagens', icon: <DMIcon /> },
    { id: 'admin', label: 'Administração', icon: <AdminIcon /> },
  ]

  return (
    <div className="flex flex-col items-center w-[60px] h-full bg-bg-1 border-r border-white/[0.04] py-4 gap-1 shrink-0">
      {/* Logo */}
      <div
        className="w-8 h-8 rounded-10 mb-3 flex items-center justify-center shadow-glow-sm"
        style={{ background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)' }}
      >
        <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="8" r="3" fill="white" opacity="0.9" />
          <circle cx="6" cy="20" r="3" fill="white" opacity="0.7" />
          <circle cx="22" cy="20" r="3" fill="white" opacity="0.7" />
          <line x1="14" y1="8" x2="6" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
          <line x1="14" y1="8" x2="22" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
          <line x1="6" y1="20" x2="22" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
        </svg>
      </div>

      <div className="w-6 h-px bg-white/5 mb-1" />

      {/* Nav items */}
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className="relative group flex flex-col items-center w-full py-2 transition-colors"
          title={item.label}
        >
          {view === item.id && (
            <motion.div
              layoutId="nav-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r bg-accent"
            />
          )}
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-10 transition-all duration-150 ${
              view === item.id
                ? 'bg-accent/15 text-accent'
                : 'text-text-3 group-hover:bg-bg-4 group-hover:text-text-2'
            }`}
          >
            {item.icon}
          </div>
        </button>
      ))}

      <div className="flex-1" />

      {/* Search */}
      <button
        onClick={toggleSearch}
        className={`btn-icon w-9 h-9 rounded-10 ${ui.search_open ? 'bg-bg-4 text-text-1' : ''}`}
        title="Busca"
      >
        <SearchIcon />
      </button>

      {/* Notifications */}
      <button
        onClick={toggleNotifications}
        className="relative btn-icon w-9 h-9 rounded-10"
        title="Notificações"
      >
        <BellIcon />
        {unreadNotifications > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-2xs font-semibold flex items-center justify-center">
            {unreadNotifications}
          </span>
        )}
      </button>

      {/* Current user avatar */}
      <div className="mt-1">
        <Avatar
          user={current_user}
          size="sm"
          showStatus
          onClick={() => openProfile(current_user)}
        />
      </div>
    </div>
  )
}
