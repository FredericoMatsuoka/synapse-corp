export type HierarchyLevel = 'ceo' | 'diretor' | 'gerente' | 'coordenador' | 'supervisor' | 'analista' | 'assistente' | 'estagiario'

export type Department =
  | 'geral'
  | 'comercial'
  | 'financeiro'
  | 'marketing'
  | 'juridico'
  | 'ti'
  | 'rh'
  | 'operacional'

export type UserStatus = 'online' | 'away' | 'busy' | 'offline'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  department: Department
  hierarchy: HierarchyLevel
  status: UserStatus
  bio?: string
  skills: string[]
  metrics: {
    tasks_done: number
    messages_sent: number
    meetings_attended: number
    performance_score: number
  }
  clone_enabled: boolean
  permissions: Permission[]
  joined_at: string
}

export type Permission =
  | 'send_general'
  | 'admin_users'
  | 'admin_groups'
  | 'view_reports'
  | 'manage_permissions'
  | 'create_channels'
  | 'delete_messages'
  | 'view_all_dms'
  | 'ai_clone_access'

export type ChannelType = 'general' | 'department' | 'team' | 'announcement'

export interface Channel {
  id: string
  name: string
  description: string
  type: ChannelType
  department?: Department
  members: string[]
  pinned?: boolean
  unread?: number
  last_message?: string
  last_message_at?: string
  created_by: string
  icon?: string
}

export type MessageType = 'text' | 'audio' | 'video' | 'file' | 'image' | 'system' | 'ai_summary' | 'task'

export interface Reaction {
  emoji: string
  users: string[]
}

export interface Message {
  id: string
  channel_id: string
  author_id: string
  type: MessageType
  content: string
  file_url?: string
  file_name?: string
  file_size?: number
  reactions?: Reaction[]
  reply_to?: string
  pinned?: boolean
  edited?: boolean
  system_event?: string
  task_data?: {
    title: string
    due: string
    assignee: string
    done: boolean
  }
  timestamp: string
  read_by: string[]
}

export interface DirectMessage {
  id: string
  participants: string[]
  messages: Message[]
  last_message?: string
  last_message_at?: string
  unread?: number
}

export type AIChatRole = 'user' | 'assistant' | 'system'

export interface AIMessage {
  id: string
  role: AIChatRole
  content: string
  timestamp: string
  clone_user?: string
  is_typing?: boolean
}

export interface AIState {
  open: boolean
  mode: 'assistant' | 'clone' | 'summary' | 'search'
  clone_target?: User
  messages: AIMessage[]
  thinking: boolean
}

export interface AppNotification {
  id: string
  type: 'mention' | 'dm' | 'task' | 'system' | 'ai'
  title: string
  body: string
  from?: string
  channel?: string
  read: boolean
  timestamp: string
}
