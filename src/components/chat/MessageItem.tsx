import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Message, User } from '../../types'
import Avatar from '../shared/Avatar'
import { useAppStore } from '../../store/appStore'

interface MessageItemProps {
  message: Message
  author: User
  showAvatar: boolean
  isOwn: boolean
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

const ReplyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
)

const EmojiIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
)

const MoreIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
  </svg>
)

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const REACTION_EMOJIS = ['👍', '❤️', '🔥', '👏', '😂', '🚀']

function TaskCard({ data }: { data: NonNullable<Message['task_data']> }) {
  const [done, setDone] = useState(data.done)
  return (
    <div className="mt-2 p-3 rounded-10 bg-bg-3 border border-white/5 max-w-xs">
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => setDone(!done)}
          className={`mt-0.5 w-4 h-4 rounded shrink-0 border transition-all ${done ? 'bg-status-online border-status-online' : 'border-white/20 hover:border-white/40'}`}
        >
          {done && <CheckIcon />}
        </button>
        <div>
          <p className={`text-sm font-medium ${done ? 'line-through text-text-3' : 'text-text-1'}`}>
            {data.title}
          </p>
          <p className="text-xs text-text-3 mt-0.5">
            Vence em {new Date(data.due).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function MessageItem({ message, author, showAvatar }: MessageItemProps) {
  const { openProfile, setAIMode } = useAppStore()
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const isSystem = message.type === 'system'
  const isAISummary = message.type === 'ai_summary'

  if (isSystem) {
    return (
      <div className="flex items-center gap-3 py-3 px-4">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-2xs text-text-3 font-medium">{message.content}</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>
    )
  }

  if (isAISummary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 my-3 p-4 rounded-14 border"
        style={{
          background: 'linear-gradient(135deg, rgba(124,111,255,0.06) 0%, rgba(167,139,250,0.04) 100%)',
          borderColor: 'rgba(124,111,255,0.2)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-6 flex items-center justify-center" style={{ background: 'rgba(124,111,255,0.2)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#7c6fff" opacity="0.8" />
              <path d="M2 17l10 5 10-5" stroke="#7c6fff" strokeWidth="2" fill="none" />
              <path d="M2 12l10 5 10-5" stroke="#7c6fff" strokeWidth="2" fill="none" opacity="0.5" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-accent">Resumo Automatico — IA Synapse</span>
          <span className="text-2xs text-text-3 ml-auto">{formatTime(message.timestamp)}</span>
        </div>
        <p className="text-sm text-text-2 leading-relaxed">{message.content}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="message-hover group flex items-start gap-3 px-4 py-1 hover:bg-white/[0.02] rounded-10 mx-1 transition-colors"
    >
      {/* Avatar column */}
      <div className="w-9 shrink-0 mt-0.5">
        {showAvatar ? (
          <button onClick={() => openProfile(author)} className="hover:opacity-80 transition-opacity">
            <Avatar user={author} size="sm" />
          </button>
        ) : (
          <span className="invisible group-hover:visible text-2xs text-text-3 block text-right leading-9">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {showAvatar && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <button
              onClick={() => openProfile(author)}
              className="text-sm font-semibold text-text-1 hover:text-accent transition-colors"
            >
              {author.name}
            </button>
            <span className="text-2xs text-text-3">{author.role}</span>
            <span className="text-2xs text-text-3 ml-auto mr-8">{formatTime(message.timestamp)}</span>
          </div>
        )}

        {message.type === 'task' && message.task_data ? (
          <>
            <p className="text-sm text-text-2 leading-relaxed">{message.content}</p>
            <TaskCard data={message.task_data} />
          </>
        ) : (
          <p className="text-sm text-text-1 leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {message.reactions.map(r => (
              <button
                key={r.emoji}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-3 hover:bg-bg-4 border border-white/5 transition-colors"
              >
                <span className="text-xs">{r.emoji}</span>
                <span className="text-xs text-text-2 font-medium">{r.users.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover actions */}
      <div className="message-actions flex items-center gap-0.5 mr-1">
        <div className="relative">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="btn-icon w-7 h-7 rounded-6 text-text-3 hover:text-text-1"
            title="Reagir"
          >
            <EmojiIcon />
          </button>
          {showReactionPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute right-0 bottom-8 flex gap-1 p-2 rounded-10 bg-bg-3 border border-white/10 shadow-panel z-10"
            >
              {REACTION_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setShowReactionPicker(false)}
                  className="text-base hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </div>
        <button className="btn-icon w-7 h-7 rounded-6 text-text-3 hover:text-text-1" title="Responder">
          <ReplyIcon />
        </button>
        {author.clone_enabled && (
          <button
            onClick={() => setAIMode('clone', author)}
            className="btn-icon w-7 h-7 rounded-6 text-text-3 hover:text-accent"
            title={`Perguntar para IA de ${author.name.split(' ')[0]}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" />
              <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            </svg>
          </button>
        )}
        <button className="btn-icon w-7 h-7 rounded-6 text-text-3 hover:text-text-1" title="Mais">
          <MoreIcon />
        </button>
      </div>
    </motion.div>
  )
}
