import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import { DEPT_CONFIG, HIERARCHY_LABELS } from '../../data/mockData'
import Avatar from '../shared/Avatar'
import type { User } from '../../types'

const STATUS_COLORS = { online: '#22d47a', away: '#f59e0b', busy: '#ef4444', offline: '#4a4a60' }

function UserRow({ user, onProfile }: { user: User; onProfile: (u: User) => void }) {
  const dept = DEPT_CONFIG[user.department]

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-3 hover:bg-bg-3/50 rounded-10 transition-colors cursor-pointer group"
      onClick={() => onProfile(user)}
    >
      <div className="relative">
        <Avatar user={user} size="md" />
        <span
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-bg-2"
          style={{ backgroundColor: STATUS_COLORS[user.status] }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-1 truncate">{user.name}</p>
          {user.clone_enabled && (
            <span className="text-2xs px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium">IA</span>
          )}
        </div>
        <p className="text-xs text-text-3 truncate">{user.role}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-2xs font-medium px-2 py-0.5 rounded-full"
          style={{ color: dept?.color, background: dept?.bg }}
        >
          {dept?.label}
        </span>
        <span className="text-2xs text-text-3">{HIERARCHY_LABELS[user.hierarchy]}</span>
      </div>
      <div className="text-center shrink-0 hidden lg:block">
        <p className="text-sm font-semibold text-text-1">{user.metrics.performance_score}%</p>
        <p className="text-2xs text-text-3">Score</p>
      </div>
    </motion.div>
  )
}

const METRICS = [
  { label: 'Colaboradores Ativos', value: '7', sub: 'de 8 total', trend: '+2 este mês', color: '#22d47a' },
  { label: 'Canais Ativos', value: '9', sub: '4 dept + 1 equipe + 2 fixados', trend: '', color: '#7c6fff' },
  { label: 'Mensagens Hoje', value: '142', sub: '+18% vs. ontem', trend: 'alta atividade', color: '#3b82f6' },
  { label: 'Tarefas Abertas', value: '23', sub: '5 vencendo em breve', trend: 'atenção', color: '#f59e0b' },
]

const DEPT_PERFORMANCE = [
  { dept: 'comercial', score: 93, messages: 48, label: 'Comercial' },
  { dept: 'ti', score: 91, messages: 32, label: 'TI' },
  { dept: 'rh', score: 89, messages: 21, label: 'RH' },
  { dept: 'marketing', score: 87, messages: 18, label: 'Marketing' },
  { dept: 'financeiro', score: 85, messages: 14, label: 'Financeiro' },
  { dept: 'juridico', score: 83, messages: 9, label: 'Jurídico' },
]

export default function AdminPanel() {
  const { users, channels, openProfile } = useAppStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'groups' | 'permissions'>('overview')

  const tabs = [
    { id: 'overview', label: 'Visao Geral' },
    { id: 'users', label: 'Colaboradores' },
    { id: 'groups', label: 'Grupos' },
    { id: 'permissions', label: 'Permissoes' },
  ] as const

  return (
    <div className="flex-1 flex flex-col bg-bg-base overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] bg-bg-1 shrink-0">
        <div>
          <h1 className="text-base font-semibold text-text-1">Administracao</h1>
          <p className="text-xs text-text-3 mt-0.5">Gerenciamento da plataforma corporativa</p>
        </div>
        <button className="btn-primary text-xs">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo colaborador
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 py-3 border-b border-white/[0.04] bg-bg-1 shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-10 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-accent/10 text-accent'
                : 'text-text-3 hover:bg-bg-3 hover:text-text-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-6 px-6">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {METRICS.map(m => (
                <div key={m.label} className="p-4 rounded-14 bg-bg-2 border border-white/5">
                  <p className="text-2xs text-text-3 uppercase tracking-wide font-semibold mb-2">{m.label}</p>
                  <p className="text-3xl font-bold tracking-tight" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-xs text-text-3 mt-1">{m.sub}</p>
                  {m.trend && <p className="text-2xs mt-1" style={{ color: m.color }}>{m.trend}</p>}
                </div>
              ))}
            </div>

            {/* Dept performance */}
            <div className="rounded-14 bg-bg-2 border border-white/5 p-5">
              <h3 className="text-sm font-semibold text-text-1 mb-4">Performance por Departamento</h3>
              <div className="space-y-3">
                {DEPT_PERFORMANCE.map((d, i) => {
                  const dept = DEPT_CONFIG[d.dept]
                  return (
                    <div key={d.dept} className="flex items-center gap-3">
                      <span className="text-xs text-text-2 w-20 shrink-0">{d.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-bg-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.score}%` }}
                          transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${dept?.color}80, ${dept?.color})` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-text-2 w-8 text-right">{d.score}%</span>
                      <span className="text-xs text-text-3 w-16 text-right">{d.messages} msgs</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activity grid */}
            <div className="rounded-14 bg-bg-2 border border-white/5 p-5">
              <h3 className="text-sm font-semibold text-text-1 mb-4">Atividade dos Ultimos 7 Dias</h3>
              <div className="flex items-end gap-1 h-20">
                {[42, 58, 35, 72, 61, 48, 90].map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / 90) * 100}%` }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
                    className="flex-1 rounded-t-4"
                    style={{ background: `rgba(124,111,255,${0.3 + (v / 90) * 0.5})` }}
                    title={`${v} mensagens`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {['Qui', 'Sex', 'Sab', 'Dom', 'Seg', 'Ter', 'Hj'].map(d => (
                  <span key={d} className="flex-1 text-center text-2xs text-text-3">{d}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-2">{users.length} colaboradores</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-10 bg-bg-2 border border-white/5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-3">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input placeholder="Buscar..." className="bg-transparent text-xs text-text-1 outline-none w-28 placeholder:text-text-3" />
                </div>
              </div>
            </div>
            <div className="bg-bg-2 rounded-14 border border-white/5 divide-y divide-white/[0.04] overflow-hidden">
              {users.map(user => (
                <UserRow key={user.id} user={user} onProfile={openProfile} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'groups' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-sm text-text-2">Grupos e canais organizacionais</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {Object.entries(DEPT_CONFIG).map(([key, dept]) => {
                const channelCount = channels.filter(c => c.department === key).length
                return (
                  <div key={key} className="p-4 rounded-14 bg-bg-2 border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-10 flex items-center justify-center" style={{ background: dept.bg }}>
                        <span className="text-base font-bold" style={{ color: dept.color }}>
                          {dept.label[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-1">{dept.label}</p>
                        <p className="text-xs text-text-3">{channelCount} canais</p>
                      </div>
                    </div>
                    <div className="h-1 rounded-full bg-bg-4">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.random() * 60 + 40}%`, background: dept.color, opacity: 0.6 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'permissions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <p className="text-sm text-text-2">Controle de acesso baseado em funcoes (RBAC)</p>
            <div className="rounded-14 bg-bg-2 border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-4 py-3 text-2xs text-text-3 font-semibold uppercase tracking-wide">Colaborador</th>
                    <th className="text-center px-3 py-3 text-2xs text-text-3 font-semibold uppercase tracking-wide">Anúncios</th>
                    <th className="text-center px-3 py-3 text-2xs text-text-3 font-semibold uppercase tracking-wide">Usuarios</th>
                    <th className="text-center px-3 py-3 text-2xs text-text-3 font-semibold uppercase tracking-wide">Relatórios</th>
                    <th className="text-center px-3 py-3 text-2xs text-text-3 font-semibold uppercase tracking-wide">Clone IA</th>
                    <th className="text-center px-3 py-3 text-2xs text-text-3 font-semibold uppercase tracking-wide">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar user={user} size="xs" />
                          <span className="text-xs text-text-1">{user.name.split(' ')[0]}</span>
                        </div>
                      </td>
                      {[
                        user.permissions.includes('send_general'),
                        user.permissions.includes('admin_users'),
                        user.permissions.includes('view_reports'),
                        user.permissions.includes('ai_clone_access'),
                        user.permissions.includes('manage_permissions'),
                      ].map((has, i) => (
                        <td key={i} className="text-center px-3 py-3">
                          <span className={`inline-flex w-5 h-5 rounded-full items-center justify-center ${has ? 'bg-status-online/20 text-status-online' : 'bg-white/5 text-text-3'}`}>
                            {has ? (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
