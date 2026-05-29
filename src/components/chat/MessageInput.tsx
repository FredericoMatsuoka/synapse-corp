import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'

interface MessageInputProps {
  channelName: string
  channelId: string
  isDM?: boolean
}

const AttachIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const EmojiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const AIIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" />
    <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" opacity="0.5" />
  </svg>
)

export default function MessageInput({ channelName, channelId, isDM = false }: MessageInputProps) {
  const { sendMessage, sendDM, active_dm_id, toggleAIPanel } = useAppStore()
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (isDM && active_dm_id) {
      sendDM(active_dm_id, trimmed)
    } else {
      sendMessage(channelId, trimmed)
    }
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 pb-4 pt-2">
      <motion.div
        initial={false}
        className="relative flex items-end gap-2 p-3 rounded-14 bg-bg-2 border border-white/[0.06] focus-within:border-accent/30 transition-colors"
      >
        {/* Left actions */}
        <div className="flex items-center gap-0.5 mb-0.5">
          <button className="btn-icon text-text-3 hover:text-text-2" title="Anexar arquivo">
            <AttachIcon />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Mensagem em ${channelName}`}
          className="flex-1 bg-transparent text-sm text-text-1 placeholder:text-text-3 outline-none resize-none leading-relaxed max-h-[120px] py-0.5"
          rows={1}
        />

        {/* Right actions */}
        <div className="flex items-center gap-0.5 mb-0.5">
          <button className="btn-icon text-text-3 hover:text-text-2" title="Emoji">
            <EmojiIcon />
          </button>
          <button className="btn-icon text-text-3 hover:text-text-2" title="Audio">
            <MicIcon />
          </button>
          <button
            onClick={toggleAIPanel}
            className="btn-icon text-text-3 hover:text-accent"
            title="Assistente IA"
          >
            <AIIcon />
          </button>
          <motion.button
            onClick={handleSend}
            disabled={!value.trim()}
            whileHover={value.trim() ? { scale: 1.05 } : {}}
            whileTap={value.trim() ? { scale: 0.95 } : {}}
            className="ml-1 w-8 h-8 rounded-10 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30"
            style={{ background: value.trim() ? 'linear-gradient(135deg, #7c6fff, #9585ff)' : '#2e2e42' }}
          >
            <SendIcon />
          </motion.button>
        </div>
      </motion.div>

      <p className="text-2xs text-text-3 text-center mt-2">
        Enter para enviar &bull; Shift+Enter para nova linha &bull; Use @ para mencionar
      </p>
    </div>
  )
}
