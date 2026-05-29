import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { DEPT_CONFIG } from '../../data/mockData'
import MessageItem from './MessageItem'
import MessageInput from './MessageInput'
import Avatar from '../shared/Avatar'
import type { Message } from '../../types'

const shouldShowAvatar = (messages: Message[], index: number) => {
  if (index === 0) return true
  const prev = messages[index - 1]
  const curr = messages[index]
  if (prev.author_id !== curr.author_id) return true
  const prevTime = new Date(prev.timestamp).getTime()
  const currTime = new Date(curr.timestamp).getTime()
  return currTime - prevTime > 5 * 60 * 1000
}

const formatDateHeader = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 24 * 60 * 60 * 1000) return 'Hoje'
  if (diff < 48 * 60 * 60 * 1000) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

const needsDateHeader = (messages: Message[], index: number) => {
  if (index === 0) return true
  const prev = new Date(messages[index - 1].timestamp)
  const curr = new Date(messages[index].timestamp)
  return prev.toDateString() !== curr.toDateString()
}

const MembersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

const AIIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" />
    <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" opacity="0.5" />
  </svg>
)

function ChannelHeader() {
  const { active_channel_id, channels, users, setAIMode, toggleAIPanel } = useAppStore()
  const channel = channels.find(c => c.id === active_channel_id)
  if (!channel) return null

  const dept = channel.department ? DEPT_CONFIG[channel.department] : null
  const memberCount = channel.members.length

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-bg-1 shrink-0">
      {/* Channel name */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-text-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
            <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
          </svg>
        </span>
        <h1 className="text-sm font-semibold text-text-1">{channel.name}</h1>
        {dept && (
          <span
            className="text-2xs font-semibold px-2 py-0.5 rounded-full tracking-wide"
            style={{ color: dept.color, background: dept.bg }}
          >
            {dept.label}
          </span>
        )}
        {channel.description && (
          <>
            <span className="text-text-3">|</span>
            <p className="text-xs text-text-3 truncate">{channel.description}</p>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Member avatars */}
        <div className="flex items-center -space-x-2 mr-2">
          {channel.members.slice(0, 3).map(id => {
            const u = users.find(u => u.id === id)
            if (!u) return null
            return (
              <div key={id} className="w-6 h-6 rounded-full overflow-hidden border-2 border-bg-1">
                <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
              </div>
            )
          })}
          {memberCount > 3 && (
            <div className="w-6 h-6 rounded-full bg-bg-4 border-2 border-bg-1 flex items-center justify-center text-2xs text-text-2 font-medium">
              +{memberCount - 3}
            </div>
          )}
        </div>

        <button
          onClick={() => setAIMode('summary')}
          className="btn-icon text-text-3 hover:text-accent flex items-center gap-1.5 px-2 text-xs"
          title="Resumo IA deste canal"
        >
          <AIIcon />
          <span className="hidden lg:inline">Resumo IA</span>
        </button>

        <button className="btn-icon" title="Membros">
          <MembersIcon />
        </button>

        <button className="btn-icon" title="Fixados">
          <PinIcon />
        </button>
      </div>
    </div>
  )
}

function DMHeader() {
  const { active_dm_id, direct_messages, users, current_user, openProfile } = useAppStore()
  const dm = direct_messages.find(d => d.id === active_dm_id)
  if (!dm) return null

  const otherId = dm.participants.find(id => id !== current_user.id)
  const otherUser = users.find(u => u.id === otherId)
  if (!otherUser) return null

  const statusColors = { online: '#22d47a', away: '#f59e0b', busy: '#ef4444', offline: '#4a4a60' }
  const statusLabels = { online: 'Online', away: 'Ausente', busy: 'Ocupado', offline: 'Offline' }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] bg-bg-1 shrink-0">
      <Avatar user={otherUser} size="sm" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <button onClick={() => openProfile(otherUser)} className="text-sm font-semibold text-text-1 hover:text-accent transition-colors">
            {otherUser.name}
          </button>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors[otherUser.status] }} />
            <span className="text-2xs text-text-3">{statusLabels[otherUser.status]}</span>
          </div>
        </div>
        <p className="text-xs text-text-3">{otherUser.role} — {otherUser.department}</p>
      </div>
    </div>
  )
}

export default function ChatArea() {
  const { active_channel_id, active_dm_id, view, messages, direct_messages, channels, users, current_user } = useAppStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isDM = view === 'dm'
  const channel = channels.find(c => c.id === active_channel_id)
  const dm = direct_messages.find(d => d.id === active_dm_id)

  const channelMessages = active_channel_id ? (messages[active_channel_id] || []) : []
  const dmMessages = dm?.messages || []
  const displayMessages = isDM ? dmMessages : channelMessages

  const channelName = isDM
    ? (users.find(u => dm?.participants.find(id => id !== current_user.id) === u.id)?.name || 'DM')
    : (channel?.name || 'canal')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages.length])

  if (!active_channel_id && !active_dm_id) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-base">
        <div className="text-center">
          <div className="w-16 h-16 rounded-22 mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(124,111,255,0.1)' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="8" r="3" fill="#7c6fff" opacity="0.6" />
              <circle cx="6" cy="20" r="3" fill="#7c6fff" opacity="0.4" />
              <circle cx="22" cy="20" r="3" fill="#7c6fff" opacity="0.4" />
              <line x1="14" y1="8" x2="6" y2="20" stroke="#7c6fff" strokeWidth="1.5" opacity="0.3" />
              <line x1="14" y1="8" x2="22" y2="20" stroke="#7c6fff" strokeWidth="1.5" opacity="0.3" />
            </svg>
          </div>
          <p className="text-text-2 text-sm">Selecione um canal para comecar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-bg-base overflow-hidden">
      {/* Header */}
      {isDM ? <DMHeader /> : <ChannelHeader />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
        <AnimatePresence initial={false}>
          {displayMessages.map((msg, i) => {
            const author = users.find(u => u.id === msg.author_id)
            if (!author) return null

            const showAvatar = shouldShowAvatar(displayMessages, i)
            const isOwn = msg.author_id === current_user.id
            const showDate = needsDateHeader(displayMessages, i)

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-2xs text-text-3 font-medium px-2">
                      {formatDateHeader(msg.timestamp)}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                )}
                {showAvatar && i > 0 && !showDate && <div className="h-1" />}
                <MessageItem
                  message={msg}
                  author={author}
                  showAvatar={showAvatar}
                  isOwn={isOwn}
                />
              </div>
            )
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        channelName={`#${channelName}`}
        channelId={active_channel_id || active_dm_id || ''}
        isDM={isDM}
      />
    </div>
  )
}
