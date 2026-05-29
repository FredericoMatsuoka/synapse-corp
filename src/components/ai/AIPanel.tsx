import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import Avatar from '../shared/Avatar'

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const ModeButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-10 text-2xs font-semibold tracking-wide uppercase transition-all ${
      active ? 'bg-accent/15 text-accent' : 'text-text-3 hover:bg-bg-4 hover:text-text-2'
    }`}
  >
    {icon}
    {label}
  </button>
)

const SUGGESTED_PROMPTS: Record<string, string[]> = {
  assistant: [
    'Resuma as conversas de hoje',
    'Quais tarefas estao pendentes?',
    'Quem resolve problemas de acesso?',
    'Direcione para o responsavel por reembolso',
  ],
  clone: [
    'Posso confirmar esta proposta?',
    'Qual seu horario preferido para reunioes?',
    'Como voce aprovaria este contrato?',
    'Qual a sua opiniao sobre este lead?',
  ],
  summary: [
    'Resumo do canal #comercial',
    'O que aconteceu essa semana?',
    'Principais decisoes dos ultimos 7 dias',
    'Resumo executivo para a diretoria',
  ],
  search: [
    'Onde esta o contrato da Empresa X?',
    'Quem fechou o ultimo cliente?',
    'Encontre a proposta do cliente XPTO',
    'Quando foi a ultima reuniao de TI?',
  ],
}

export default function AIPanel() {
  const { ui, toggleAIPanel, setAIMode, ai_messages, ai_thinking, sendAIMessage, users } = useAppStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const cloneTarget = ui.ai_clone_target

  useEffect(() => {
    if (ui.ai_panel_open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [ui.ai_panel_open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [ai_messages.length, ai_thinking])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || ai_thinking) return
    sendAIMessage(trimmed)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const modes = [
    {
      id: 'assistant' as const,
      label: 'IA',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        </svg>
      ),
    },
    {
      id: 'clone' as const,
      label: 'Clone',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 'summary' as const,
      label: 'Resumo',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      id: 'search' as const,
      label: 'Busca',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
    },
  ]

  const clonable = users.filter(u => u.clone_enabled)

  return (
    <AnimatePresence>
      {ui.ai_panel_open && (
        <motion.div
          key="ai-panel"
          initial={{ opacity: 0, x: 320 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 320 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-[320px] h-full flex flex-col bg-bg-1 border-l border-white/[0.06] shrink-0 relative z-10"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04]">
            <div
              className="w-7 h-7 rounded-8 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)' }}
            >
              <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="8" r="3" fill="white" opacity="0.9" />
                <circle cx="6" cy="20" r="3" fill="white" opacity="0.7" />
                <circle cx="22" cy="20" r="3" fill="white" opacity="0.7" />
                <line x1="14" y1="8" x2="6" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
                <line x1="14" y1="8" x2="22" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
                <line x1="6" y1="20" x2="22" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-text-1">IA Synapse</h2>
              <p className="text-2xs text-text-3">Assistente Organizacional</p>
            </div>
            <button onClick={toggleAIPanel} className="btn-icon">
              <CloseIcon />
            </button>
          </div>

          {/* Mode tabs */}
          <div className="flex items-center justify-around px-3 py-2 border-b border-white/[0.04]">
            {modes.map(m => (
              <ModeButton
                key={m.id}
                active={ui.ai_mode === m.id}
                onClick={() => setAIMode(m.id)}
                icon={m.icon}
                label={m.label}
              />
            ))}
          </div>

          {/* Clone target selector */}
          <AnimatePresence>
            {ui.ai_mode === 'clone' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-white/[0.04]"
              >
                <div className="px-3 py-2">
                  <p className="text-2xs text-text-3 mb-2 uppercase tracking-wide font-semibold">
                    Selecionar colaborador
                  </p>
                  <div className="space-y-1">
                    {clonable.map(user => (
                      <button
                        key={user.id}
                        onClick={() => setAIMode('clone', user)}
                        className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-10 transition-all ${
                          cloneTarget?.id === user.id
                            ? 'bg-accent/10 border border-accent/20'
                            : 'hover:bg-bg-3'
                        }`}
                      >
                        <Avatar user={user} size="xs" />
                        <div className="flex-1 text-left">
                          <p className="text-xs font-medium text-text-1">{user.name}</p>
                          <p className="text-2xs text-text-3">{user.role}</p>
                        </div>
                        {cloneTarget?.id === user.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clone indicator */}
          {ui.ai_mode === 'clone' && cloneTarget && (
            <div className="px-3 py-2 bg-accent/5 border-b border-accent/10">
              <div className="flex items-center gap-2">
                <Avatar user={cloneTarget} size="xs" />
                <div>
                  <p className="text-2xs font-semibold text-accent">Clone Operacional Ativo</p>
                  <p className="text-2xs text-text-3">{cloneTarget.name} — {cloneTarget.role}</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-online animate-pulse" />
                  <span className="text-2xs text-status-online">Ativo</span>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-3 scrollbar-none">
            {ai_messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' && (
                  <div
                    className="w-7 h-7 rounded-8 shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="8" r="3" fill="white" />
                      <circle cx="6" cy="20" r="3" fill="white" opacity="0.7" />
                      <circle cx="22" cy="20" r="3" fill="white" opacity="0.7" />
                      <line x1="14" y1="8" x2="6" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
                      <line x1="14" y1="8" x2="22" y2="20" stroke="white" strokeWidth="2" opacity="0.5" />
                    </svg>
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-14 px-3.5 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-accent/15 border border-accent/20'
                      : 'bg-bg-2 border border-white/5'
                  }`}
                >
                  {msg.clone_user && msg.role === 'assistant' && (
                    <p className="text-2xs text-accent mb-1.5 font-semibold">Clone Operacional</p>
                  )}
                  <p className="text-sm text-text-1 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-2xs text-text-3 mt-1.5">
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Thinking indicator */}
            <AnimatePresence>
              {ai_thinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex gap-2.5"
                >
                  <div
                    className="w-7 h-7 rounded-8 shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="8" r="3" fill="white" />
                      <circle cx="6" cy="20" r="3" fill="white" opacity="0.7" />
                      <circle cx="22" cy="20" r="3" fill="white" opacity="0.7" />
                    </svg>
                  </div>
                  <div className="bg-bg-2 border border-white/5 rounded-14 px-3.5 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts */}
          {ai_messages.length <= 1 && !ai_thinking && (
            <div className="px-3 pb-2">
              <p className="text-2xs text-text-3 mb-2 uppercase tracking-wide font-semibold">Sugestoes</p>
              <div className="space-y-1">
                {SUGGESTED_PROMPTS[ui.ai_mode]?.slice(0, 3).map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => { sendAIMessage(prompt) }}
                    className="w-full text-left text-xs text-text-2 px-3 py-2 rounded-10 bg-bg-2 hover:bg-bg-3 border border-white/5 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-4">
            <div className="flex items-center gap-2 p-2.5 rounded-12 bg-bg-2 border border-white/[0.06] focus-within:border-accent/30 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  ui.ai_mode === 'clone' && cloneTarget
                    ? `Perguntar para ${cloneTarget.name.split(' ')[0]}...`
                    : 'Perguntar para a IA...'
                }
                className="flex-1 bg-transparent text-sm text-text-1 placeholder:text-text-3 outline-none"
                disabled={ai_thinking}
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || ai_thinking}
                whileHover={input.trim() ? { scale: 1.05 } : {}}
                whileTap={input.trim() ? { scale: 0.92 } : {}}
                className="w-7 h-7 rounded-8 flex items-center justify-center text-white transition-all disabled:opacity-30"
                style={{ background: input.trim() ? 'linear-gradient(135deg, #7c6fff, #9585ff)' : '#2e2e42' }}
              >
                <SendIcon />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
