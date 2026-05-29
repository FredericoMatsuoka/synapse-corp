/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#08080e',
          1: '#0f0f18',
          2: '#151520',
          3: '#1c1c2a',
          4: '#242434',
          5: '#2e2e42',
        },
        text: {
          1: '#f0f0f8',
          2: '#9090a8',
          3: '#5a5a72',
        },
        accent: {
          DEFAULT: '#7c6fff',
          hover: '#9585ff',
          muted: '#7c6fff1a',
          glow: '#7c6fff33',
        },
        status: {
          online: '#22d47a',
          away: '#f59e0b',
          busy: '#ef4444',
          offline: '#4a4a60',
        },
        dept: {
          comercial: '#3b82f6',
          financeiro: '#10b981',
          marketing: '#ec4899',
          juridico: '#8b5cf6',
          ti: '#06b6d4',
          rh: '#f97316',
          operacional: '#84cc16',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(124,111,255,0.15)',
        glow: '0 0 24px rgba(124,111,255,0.2)',
        'glow-lg': '0 0 48px rgba(124,111,255,0.25)',
        panel: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        card: '0 2px 12px rgba(0,0,0,0.3)',
        float: '0 16px 64px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-neural': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,111,255,0.12) 0%, transparent 60%)',
        'gradient-accent': 'linear-gradient(135deg, #7c6fff, #a78bfa)',
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 12px rgba(124,111,255,0.2)' },
          '50%': { boxShadow: '0 0 28px rgba(124,111,255,0.45)' },
        },
        slideUp: {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideRight: {
          from: { transform: 'translateX(-12px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

