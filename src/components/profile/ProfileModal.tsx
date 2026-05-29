import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { DEPT_CONFIG, HIERARCHY_LABELS } from '../../data/mockData'

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const NeuralIcon = () => (
  <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="8" r="3" fill="currentColor" opacity="0.9" />
    <circle cx="6" cy="20" r="3" fill="currentColor" opacity="0.7" />
    <circle cx="22" cy="20" r="3" fill="currentColor" opacity="0.7" />
    <line x1="14" y1="8" x2="6" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    <line x1="14" y1="8" x2="22" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    <line x1="6" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.5" />
  </svg>
)

const STATUS_LABELS = { online: 'Online', away: 'Ausente', busy: 'Ocupado', offline: 'Offline' }
const STATUS_COLORS = { online: '#22d47a', away: '#f59e0b', busy: '#ef4444', offline: '#4a4a60' }

const HIERARCHY_LEVELS = ['ceo', 'diretor', 'gerente', 'coordenador', 'supervisor', 'analista', 'assistente', 'estagiario']

export default function ProfileModal() {
  const { ui, openProfile, setAIMode } = useAppStore()
  const user = ui.profile_modal
  if (!user) return null

  const dept = DEPT_CONFIG[user.department]
  const hierarchyIndex = HIERARCHY_LEVELS.indexOf(user.hierarchy)
  const hierarchyProgress = ((HIERARCHY_LEVELS.length - 1 - hierarchyIndex) / (HIERARCHY_LEVELS.length - 1)) * 100

  return (
    <AnimatePresence>
      {user && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => openProfile(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-22 shadow-float overflow-hidden pointer-events-auto"
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Header with banner */}
              <div className="relative h-24 overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at 30% 50%, ${dept?.color}40 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, ${dept?.color}20 0%, transparent 50%)`,
                    backgroundColor: '#151520',
                  }}
                />
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <button
                  onClick={() => openProfile(null)}
                  className="absolute top-3 right-3 btn-icon bg-bg-base/60 backdrop-blur-sm"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Avatar area */}
              <div className="px-6 pb-5">
                <div className="-mt-10 mb-3 flex items-end justify-between">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-22 overflow-hidden border-4 border-[#111118] shadow-float">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#111118]"
                      style={{ backgroundColor: STATUS_COLORS[user.status] }}
                    />
                  </div>

                  <div className="flex gap-2 mb-1">
                    <button
                      onClick={() => { openProfile(null); setAIMode('clone', user) }}
                      disabled={!user.clone_enabled}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-10 text-xs font-semibold transition-all ${
                        user.clone_enabled
                          ? 'bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20'
                          : 'bg-bg-3 text-text-3 cursor-not-allowed border border-white/5'
                      }`}
                      title={user.clone_enabled ? 'Ativar Clone Operacional' : 'Clone nao habilitado'}
                    >
                      <NeuralIcon />
                      Clone IA
                    </button>
                  </div>
                </div>

                {/* Name + role */}
                <h2 className="text-lg font-semibold text-text-1 tracking-tight">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-text-2">{user.role}</span>
                  <span className="text-text-3">·</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ color: dept?.color, background: dept?.bg }}
                  >
                    {dept?.label}
                  </span>
                  <span className="text-text-3">·</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[user.status] }} />
                    <span className="text-xs text-text-2">{STATUS_LABELS[user.status]}</span>
                  </div>
                </div>

                {user.bio && (
                  <p className="text-sm text-text-2 mt-3 leading-relaxed">{user.bio}</p>
                )}

                {/* Hierarchy level */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xs text-text-3 uppercase tracking-wide font-semibold">Nível Hierárquico</span>
                    <span className="text-xs text-text-2 font-medium">{HIERARCHY_LABELS[user.hierarchy]}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-bg-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${hierarchyProgress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${dept?.color}60, ${dept?.color})` }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <p className="text-2xs text-text-3 uppercase tracking-wide font-semibold mb-2">Competencias</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.skills.map(skill => (
                      <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-bg-3 text-text-2 border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[
                    { label: 'Tarefas', value: user.metrics.tasks_done },
                    { label: 'Mensagens', value: user.metrics.messages_sent },
                    { label: 'Reunioes', value: user.metrics.meetings_attended },
                    { label: 'Score', value: `${user.metrics.performance_score}%` },
                  ].map(metric => (
                    <div key={metric.label} className="text-center p-2 rounded-10 bg-bg-2 border border-white/5">
                      <p className="text-base font-semibold text-text-1">{metric.value}</p>
                      <p className="text-2xs text-text-3 mt-0.5">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {/* Clone info */}
                {user.clone_enabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 p-3 rounded-12 border"
                    style={{ background: 'rgba(124,111,255,0.05)', borderColor: 'rgba(124,111,255,0.15)' }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <NeuralIcon />
                      <span className="text-xs font-semibold text-accent">Espelho Inteligente Ativo</span>
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-status-online animate-pulse" />
                    </div>
                    <p className="text-xs text-text-3 leading-relaxed">
                      Este colaborador possui um clone operacional ativo. A IA pode responder perguntas com base no seu perfil, historico e padrao de comunicacao.
                    </p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 btn-primary text-xs py-2">
                    Enviar mensagem
                  </button>
                  <button className="flex-1 btn-ghost text-xs py-2 border border-white/5">
                    Ver atividade
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
