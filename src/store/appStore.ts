import { create } from 'zustand'
import type { User, Channel, Message, DirectMessage, AIMessage, AppNotification } from '../types'
import { MOCK_USERS, MOCK_CHANNELS, MOCK_MESSAGES, MOCK_DMS, MOCK_NOTIFICATIONS, CURRENT_USER } from '../data/mockData'

interface UIState {
  sidebar_collapsed: boolean
  right_panel_open: boolean
  ai_panel_open: boolean
  ai_mode: 'assistant' | 'clone' | 'summary' | 'search'
  ai_clone_target: User | null
  profile_modal: User | null
  notifications_open: boolean
  search_open: boolean
  compose_dm: boolean
}

interface AppState {
  // Auth
  authenticated: boolean
  current_user: User

  // Data
  users: User[]
  channels: Channel[]
  messages: Record<string, Message[]>
  direct_messages: DirectMessage[]
  notifications: AppNotification[]

  // Navigation
  active_channel_id: string | null
  active_dm_id: string | null
  view: 'channels' | 'dm' | 'admin'

  // UI
  ui: UIState

  // AI
  ai_messages: AIMessage[]
  ai_thinking: boolean

  // Actions
  setAuthenticated: (val: boolean) => void
  setActiveChannel: (id: string) => void
  setActiveDM: (id: string) => void
  setView: (view: 'channels' | 'dm' | 'admin') => void
  sendMessage: (channel_id: string, content: string, type?: Message['type']) => void
  sendDM: (dm_id: string, content: string) => void
  toggleAIPanel: () => void
  setAIMode: (mode: UIState['ai_mode'], target?: User) => void
  sendAIMessage: (content: string) => Promise<void>
  openProfile: (user: User | null) => void
  toggleNotifications: () => void
  toggleSearch: () => void
  toggleSidebar: () => void
  markChannelRead: (channel_id: string) => void
  markNotificationRead: (id: string) => void
}

const AI_RESPONSES: Record<string, string[]> = {
  assistant: [
    'Analisando sua solicitação com base nos dados organizacionais...',
    'Com base no histórico do canal, identifiquei 3 pontos de atenção: (1) pipeline comercial com 12 propostas pendentes, (2) tarefa de follow-up vence em 2 dias, (3) reunião All-Hands em 08 dias.',
    'Posso resumir as conversas desta semana, gerar um relatório de atividades ou direcionar sua solicitação para a pessoa responsável. O que prefere?',
    'Detectei que você tem 2 mensagens não lidas de alta prioridade no canal #comercial e 1 tarefa vencendo amanhã.',
    'Para resolver problemas de acesso, o responsável é Carlos Ferreira (TI). Para aprovação de reembolso, acione Pedro Almeida (Financeiro).',
  ],
  clone: [
    'Respondendo com base no perfil operacional deste colaborador...',
    'Com base em decisões anteriores e no histórico de comunicação, esta seria minha orientação: vá em frente com a proposta, mas ajuste o prazo de entrega para 15 dias úteis.',
    'Normalmente eu prefiro reuniões de alinhamento antes de aprovar qualquer contrato acima de R$ 50mil. Recomendo marcar uma call de 30min primeiro.',
    'Baseado no meu histórico de respostas: sim, pode confirmar a agenda. Prefiro terças ou quartas pela manhã.',
  ],
  summary: [
    'Gerando resumo inteligente das conversas...',
    'Resumo dos últimos 7 dias: 142 mensagens em 8 canais. Principais tópicos: pipeline comercial (38%), deploy TI (22%), planejamento RH (18%), questões jurídicas (12%), outros (10%).',
    'Destaques da semana: (1) 3 contratos fechados pelo Comercial, (2) Deploy v2.4.1 sem incidentes, (3) 5 novas vagas abertas pelo RH.',
  ],
  search: [
    'Buscando nas conversas organizacionais...',
    'Encontrei 4 menções ao cliente XPTO: canal #comercial (3x) e DM entre Ana e Lucas (1x). A última interação foi hoje às 10h.',
    'Resultado: o contrato da Empresa X está com Marina Souza (Jurídico). Status: pronto para assinatura.',
    'Encontrei o documento "Proposta Comercial Q2" — foi compartilhado por Ana Carvalho no canal #comercial em 27/05.',
  ],
}

let msgCounter = 1000
let aiMsgCounter = 100

const generateAIResponse = (mode: string, content: string): string => {
  const responses = AI_RESPONSES[mode] || AI_RESPONSES.assistant
  const contextResponses: Record<string, string> = {
    'resumo': 'Gerando resumo automatico das conversas recentes... Encontrei 47 mensagens nos últimos 2 dias. Principais decisoes: (1) Deploy agendado para sabado, (2) Follow-up comercial pendente, (3) Reunião All-Hands confirmada.',
    'tarefa': 'Identifiquei as seguintes tarefas abertas atribuídas a você: (1) Follow-up propostas pendentes — vence 30/05, (2) Revisar proposta cliente ABC — vence 02/06. Total: 2 tarefas ativas.',
    'acesso': 'Para problemas de acesso ao sistema, o responsável é Carlos Ferreira (Gerente de TI). Você pode contata-lo diretamente pelo canal #ti ou via DM.',
    'reembolso': 'Para aprovação de reembolso, o fluxo é: (1) preencher formulário no sistema, (2) aprovação do gestor direto, (3) validação pelo Financeiro (Pedro Almeida). Prazo médio: 5 dias úteis.',
    'contrato': 'Contratos e questoes jurídicas são gerenciados por Marina Souza (Jurídico). Para documentos urgentes, utilize o canal #juridico ou acione o clone operacional da Marina.',
  }
  for (const [key, response] of Object.entries(contextResponses)) {
    if (content.toLowerCase().includes(key)) return response
  }
  return responses[Math.floor(Math.random() * responses.length)]
}

export const useAppStore = create<AppState>((set, get) => ({
  authenticated: false,
  current_user: CURRENT_USER,
  users: MOCK_USERS,
  channels: MOCK_CHANNELS,
  messages: MOCK_MESSAGES,
  direct_messages: MOCK_DMS,
  notifications: MOCK_NOTIFICATIONS,
  active_channel_id: 'ch_geral',
  active_dm_id: null,
  view: 'channels',
  ai_messages: [
    {
      id: 'ai_welcome',
      role: 'assistant',
      content: 'Ola! Sou a IA da Synapse Corp. Posso resumir conversas, buscar informações, gerar relatórios, ou acionar o clone operacional de um colaborador. Como posso ajudar?',
      timestamp: new Date().toISOString(),
    },
  ],
  ai_thinking: false,
  ui: {
    sidebar_collapsed: false,
    right_panel_open: false,
    ai_panel_open: false,
    ai_mode: 'assistant',
    ai_clone_target: null,
    profile_modal: null,
    notifications_open: false,
    search_open: false,
    compose_dm: false,
  },

  setAuthenticated: (val) => set({ authenticated: val }),

  setActiveChannel: (id) => {
    set((s) => {
      const channels = s.channels.map(ch =>
        ch.id === id ? { ...ch, unread: 0 } : ch
      )
      return { active_channel_id: id, active_dm_id: null, view: 'channels', channels }
    })
  },

  setActiveDM: (id) => {
    set((s) => {
      const dms = s.direct_messages.map(dm =>
        dm.id === id ? { ...dm, unread: 0 } : dm
      )
      return { active_dm_id: id, active_channel_id: null, view: 'dm', direct_messages: dms }
    })
  },

  setView: (view) => set({ view }),

  sendMessage: (channel_id, content, type = 'text') => {
    const { current_user, messages } = get()
    const newMsg: Message = {
      id: `msg_${++msgCounter}`,
      channel_id,
      author_id: current_user.id,
      type,
      content,
      timestamp: new Date().toISOString(),
      read_by: [current_user.id],
    }
    const channelMsgs = [...(messages[channel_id] || []), newMsg]
    set((s) => ({
      messages: { ...s.messages, [channel_id]: channelMsgs },
      channels: s.channels.map(ch =>
        ch.id === channel_id
          ? { ...ch, last_message: content, last_message_at: newMsg.timestamp }
          : ch
      ),
    }))
  },

  sendDM: (dm_id, content) => {
    const { current_user, direct_messages } = get()
    const newMsg: Message = {
      id: `dm_${++msgCounter}`,
      channel_id: dm_id,
      author_id: current_user.id,
      type: 'text',
      content,
      timestamp: new Date().toISOString(),
      read_by: [current_user.id],
    }
    set((s) => ({
      direct_messages: s.direct_messages.map(dm =>
        dm.id === dm_id
          ? {
              ...dm,
              messages: [...dm.messages, newMsg],
              last_message: content,
              last_message_at: newMsg.timestamp,
            }
          : dm
      ),
    }))
  },

  toggleAIPanel: () =>
    set((s) => ({ ui: { ...s.ui, ai_panel_open: !s.ui.ai_panel_open } })),

  setAIMode: (mode, target) =>
    set((s) => ({
      ui: { ...s.ui, ai_mode: mode, ai_clone_target: target || null, ai_panel_open: true },
      ai_messages: [
        {
          id: `ai_${++aiMsgCounter}`,
          role: 'assistant' as const,
          content: mode === 'clone' && target
            ? `Clone Operacional ativado para ${target.name} (${target.role}). As respostas serao geradas com base no perfil, historico e padrao de comunicacao deste colaborador.`
            : mode === 'summary'
            ? 'Modo resumo ativado. Posso resumir qualquer canal, periodo ou conjunto de mensagens.'
            : mode === 'search'
            ? 'Busca inteligente ativada. Pesquise por pessoas, documentos, decisoes ou informacoes em qualquer canal.'
            : 'Assistente organizacional ativo. Como posso ajudar?',
          timestamp: new Date().toISOString(),
          clone_user: mode === 'clone' ? target?.id : undefined,
        },
      ],
    })),

  sendAIMessage: async (content) => {
    const { ui } = get()
    const userMsg: AIMessage = {
      id: `ai_${++aiMsgCounter}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    set((s) => ({
      ai_messages: [...s.ai_messages, userMsg],
      ai_thinking: true,
    }))
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
    const responseContent = generateAIResponse(ui.ai_mode, content)
    const cloneUser = ui.ai_clone_target
    const assistantMsg: AIMessage = {
      id: `ai_${++aiMsgCounter}`,
      role: 'assistant',
      content: cloneUser
        ? `${responseContent}\n\n— Resposta gerada com base no perfil operacional de ${cloneUser.name}`
        : responseContent,
      timestamp: new Date().toISOString(),
      clone_user: cloneUser?.id,
    }
    set((s) => ({
      ai_messages: [...s.ai_messages, assistantMsg],
      ai_thinking: false,
    }))
  },

  openProfile: (user) =>
    set((s) => ({ ui: { ...s.ui, profile_modal: user } })),

  toggleNotifications: () =>
    set((s) => ({ ui: { ...s.ui, notifications_open: !s.ui.notifications_open } })),

  toggleSearch: () =>
    set((s) => ({ ui: { ...s.ui, search_open: !s.ui.search_open } })),

  toggleSidebar: () =>
    set((s) => ({ ui: { ...s.ui, sidebar_collapsed: !s.ui.sidebar_collapsed } })),

  markChannelRead: (channel_id) =>
    set((s) => ({
      channels: s.channels.map(ch =>
        ch.id === channel_id ? { ...ch, unread: 0 } : ch
      ),
    })),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
}))
