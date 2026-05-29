import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/appStore'

export default function LoginPage() {
  const setAuthenticated = useAppStore(s => s.setAuthenticated)
  const [email, setEmail] = useState('lucas@synapsecorp.com.br')
  const [password, setPassword] = useState('••••••••')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setAuthenticated(true)
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-bg-base">
      {/* Ambient background */}
      <div className="absolute inset-0 neural-bg pointer-events-none" />
      <div
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c6fff 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-18 mb-5 shadow-glow-lg animate-glow-pulse"
            style={{ background: 'linear-gradient(135deg, #7c6fff 0%, #a78bfa 100%)' }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="8" r="3" fill="white" opacity="0.9" />
              <circle cx="6" cy="20" r="3" fill="white" opacity="0.7" />
              <circle cx="22" cy="20" r="3" fill="white" opacity="0.7" />
              <line x1="14" y1="8" x2="6" y2="20" stroke="white" strokeWidth="1.5" opacity="0.5" />
              <line x1="14" y1="8" x2="22" y2="20" stroke="white" strokeWidth="1.5" opacity="0.5" />
              <line x1="6" y1="20" x2="22" y2="20" stroke="white" strokeWidth="1.5" opacity="0.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-text-1 tracking-tight">Synapse Corp</h1>
          <p className="text-sm text-text-2 mt-1.5">Rede Neural Corporativa</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-22 p-8"
        >
          <h2 className="text-base font-semibold text-text-1 mb-6">Entrar na plataforma</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-2 tracking-wide uppercase">
                E-mail corporativo
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-base"
                placeholder="seu@empresa.com.br"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-2 tracking-wide uppercase">
                  Senha
                </label>
                <button type="button" className="text-xs text-accent hover:text-accent-hover transition-colors">
                  Esqueci a senha
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-base"
                placeholder="••••••••••"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { y: -1 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-3 rounded-10 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-70 relative overflow-hidden mt-2"
              style={{ background: 'linear-gradient(135deg, #7c6fff 0%, #9585ff 100%)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Autenticando...
                </span>
              ) : (
                'Entrar'
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-text-3 text-center">
              Acesso restrito a colaboradores autorizados.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-2xs text-text-3 mt-8 tracking-wider uppercase"
        >
          Synapse Corp &mdash; Plataforma Corporativa v2.4
        </motion.p>
      </div>
    </div>
  )
}
