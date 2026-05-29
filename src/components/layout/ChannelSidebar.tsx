import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { DEPT_CONFIG } from '../../data/mockData'
import type { Channel } from '../../types'

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const MegaphoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z" />
  </svg>
)

const HashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
  </svg>
)

const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round"
    style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

function ChannelItem({ channel, active, onClick }: { channel: Channel; active: boolean; onClick: () => void }) {
  const dept = channel.department ? DEPT_CONFIG[channel.department] : null
  const isAnnouncement = channel.type === 'announcement'
  const isTeam = channel.type === 'team'

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 2 }}
      className={`sidebar-item w-full text-left relative ${active ? 'active' : ''}`}
    >
      {active && (
        <motion.div
          layoutId="channel-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r"
          style={{ backgroundColor: dept?.color || '#7c6fff' }}
        />
      )}
      <span className={`${active ? 'text-text-2' : 'text-text-3'} shrink-0`}>
        {isAnnouncement ? <MegaphoneIcon /> : <HashIcon />}
      </span>
      <span className={`flex-1 truncate text-sm ${isTeam ? 'font-normal text-text-3' : ''}`}>
        {channel.name}
        {isTeam && <span className="ml-1 text-text-3">↳</span>}
      </span>
      {dept && !active && (
        <span
          className="shrink-0 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dept.color, opacity: 0.6 }}
        />
      )}
      {(channel.unread ?? 0) > 0 && (
        <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-2xs font-semibold flex items-center justify-center">
          {channel.unread}
        </span>
      )}
      {isAnnouncement && <LockIcon />}
    </motion.button>
  )
}

export default function ChannelSidebar() {
  const { channels, active_channel_id, setActiveChannel } = useAppStore()
  const [pinnedOpen, setPinnedOpen] = useState(true)
  const [deptOpen, setDeptOpen] = useState(true)
  const [teamsOpen, setTeamsOpen] = useState(true)

  const pinned = channels.filter(c => c.pinned)
  const dept = channels.filter(c => (c.type === 'department') && !c.pinned)
  const teams = channels.filter(c => c.type === 'team')

  const SectionHeader = ({
    label,
    open,
    onToggle,
    count,
  }: { label: string; open: boolean; onToggle: () => void; count?: number }) => (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 w-full px-3 py-1.5 text-2xs font-semibold text-text-3 tracking-widest uppercase hover:text-text-2 transition-colors group"
    >
      <ChevronIcon open={open} />
      {label}
      {count !== undefined && (
        <span className="ml-auto text-text-3 text-2xs normal-case tracking-normal font-normal">{count}</span>
      )}
      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
        <PlusIcon />
      </span>
    </button>
  )

  return (
    <div className="flex flex-col w-[220px] h-full bg-bg-1 border-r border-white/[0.04] shrink-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/[0.04]">
        <h2 className="text-sm font-semibold text-text-1">Synapse Corp</h2>
        <p className="text-xs text-text-3 mt-0.5">Plataforma Corporativa</p>
      </div>

      {/* Search input */}
      <div className="px-3 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-10 bg-bg-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-3 shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar canais..."
            className="flex-1 bg-transparent text-xs text-text-1 placeholder:text-text-3 outline-none"
          />
        </div>
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto scrollbar-none py-1">
        {/* Pinned / General */}
        <div className="mb-1">
          <SectionHeader label="Fixados" open={pinnedOpen} onToggle={() => setPinnedOpen(!pinnedOpen)} />
          <AnimatePresence initial={false}>
            {pinnedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-2 space-y-0.5"
              >
                {pinned.map(ch => (
                  <ChannelItem
                    key={ch.id}
                    channel={ch}
                    active={active_channel_id === ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Departments */}
        <div className="mb-1">
          <SectionHeader label="Departamentos" open={deptOpen} onToggle={() => setDeptOpen(!deptOpen)} count={dept.length} />
          <AnimatePresence initial={false}>
            {deptOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-2 space-y-0.5"
              >
                {dept.map(ch => (
                  <ChannelItem
                    key={ch.id}
                    channel={ch}
                    active={active_channel_id === ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Teams */}
        <div className="mb-1">
          <SectionHeader label="Equipes" open={teamsOpen} onToggle={() => setTeamsOpen(!teamsOpen)} count={teams.length} />
          <AnimatePresence initial={false}>
            {teamsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-2 space-y-0.5"
              >
                {teams.map(ch => (
                  <ChannelItem
                    key={ch.id}
                    channel={ch}
                    active={active_channel_id === ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
