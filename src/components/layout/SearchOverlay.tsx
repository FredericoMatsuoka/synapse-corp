import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { DEPT_CONFIG } from '../../data/mockData'
import Avatar from '../shared/Avatar'

export default function SearchOverlay() {
  const { ui, toggleSearch, channels, users, messages, openProfile, setActiveChannel } = useAppStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ui.search_open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [ui.search_open])

  const filteredChannels = query
    ? channels.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.description?.toLowerCase().includes(query.toLowerCase()))
    : channels.slice(0, 4)

  const filteredUsers = query
    ? users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase()))
    : users.slice(0, 3)

  const filteredMessages = query
    ? Object.values(messages).flat().filter(m =>
        m.type === 'text' && m.content.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : []

  return (
    <AnimatePresence>
      {ui.search_open && (
        <>
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSearch}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            key="search-modal"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 rounded-20 shadow-float overflow-hidden"
            style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-3 shrink-0">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar canais, pessoas, mensagens..."
                className="flex-1 bg-transparent text-sm text-text-1 placeholder:text-text-3 outline-none"
              />
              <kbd className="text-2xs text-text-3 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[380px] overflow-y-auto">
              {/* Channels */}
              {filteredChannels.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-2xs text-text-3 font-semibold uppercase tracking-wide">
                    {query ? 'Canais' : 'Canais recentes'}
                  </p>
                  {filteredChannels.map(ch => {
                    const dept = ch.department ? DEPT_CONFIG[ch.department] : null
                    return (
                      <button
                        key={ch.id}
                        onClick={() => { setActiveChannel(ch.id); toggleSearch() }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/[0.03] transition-colors"
                      >
                        <div
                          className="w-7 h-7 rounded-8 flex items-center justify-center shrink-0 text-xs font-bold"
                          style={{ background: dept?.bg || 'rgba(255,255,255,0.05)', color: dept?.color || '#7c6fff' }}
                        >
                          #
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm text-text-1">{ch.name}</p>
                          <p className="text-xs text-text-3 truncate">{ch.description}</p>
                        </div>
                        {(ch.unread ?? 0) > 0 && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-2xs font-semibold flex items-center justify-center">
                            {ch.unread}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* People */}
              {filteredUsers.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-2xs text-text-3 font-semibold uppercase tracking-wide border-t border-white/5">
                    {query ? 'Pessoas' : 'Colaboradores'}
                  </p>
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => { openProfile(user); toggleSearch() }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/[0.03] transition-colors"
                    >
                      <Avatar user={user} size="sm" showStatus />
                      <div className="flex-1 text-left">
                        <p className="text-sm text-text-1">{user.name}</p>
                        <p className="text-xs text-text-3">{user.role}</p>
                      </div>
                      {user.clone_enabled && (
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Clone IA</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              {filteredMessages.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-2xs text-text-3 font-semibold uppercase tracking-wide border-t border-white/5">
                    Mensagens
                  </p>
                  {filteredMessages.map(msg => {
                    const author = users.find(u => u.id === msg.author_id)
                    if (!author) return null
                    return (
                      <button
                        key={msg.id}
                        className="flex items-start gap-3 w-full px-4 py-2.5 hover:bg-white/[0.03] transition-colors text-left"
                      >
                        <Avatar user={author} size="xs" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-text-2">{author.name}</p>
                          <p className="text-xs text-text-3 truncate">
                            {msg.content.substring(0, 80)}{msg.content.length > 80 ? '...' : ''}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {query && filteredChannels.length === 0 && filteredUsers.length === 0 && filteredMessages.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-sm text-text-3">Nenhum resultado para "{query}"</p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-white/5 flex items-center gap-4">
              <span className="text-2xs text-text-3">Enter para selecionar</span>
              <span className="text-2xs text-text-3">↑↓ para navegar</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
