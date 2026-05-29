import type { User } from '../../types'

interface AvatarProps {
  user: User
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showStatus?: boolean
  onClick?: () => void
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-16 h-16 text-xl',
}

const STATUS_DOT_SIZE = {
  xs: 'w-1.5 h-1.5 bottom-0 right-0',
  sm: 'w-2 h-2 bottom-0 right-0',
  md: 'w-2.5 h-2.5 bottom-0 right-0',
  lg: 'w-3 h-3 bottom-0.5 right-0.5',
  xl: 'w-3.5 h-3.5 bottom-0.5 right-0.5',
}

const STATUS_COLORS = {
  online: '#22d47a',
  away: '#f59e0b',
  busy: '#ef4444',
  offline: '#4a4a60',
}

export default function Avatar({ user, size = 'md', showStatus = false, onClick }: AvatarProps) {
  const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('')

  return (
    <div
      className={`relative inline-flex shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className={`${SIZE_CLASSES[size]} rounded-full overflow-hidden bg-bg-4 flex items-center justify-center font-semibold text-text-2`}>
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) parent.innerHTML = `<span class="text-text-2 font-semibold">${initials}</span>`
          }}
        />
      </div>
      {showStatus && (
        <span
          className={`absolute ${STATUS_DOT_SIZE[size]} rounded-full border-2 border-bg-base`}
          style={{ backgroundColor: STATUS_COLORS[user.status] }}
        />
      )}
    </div>
  )
}
