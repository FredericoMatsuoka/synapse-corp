import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/appStore'
import NavRail from '../components/layout/NavRail'
import ChannelSidebar from '../components/layout/ChannelSidebar'
import DMSidebar from '../components/layout/DMSidebar'
import AdminPanel from '../components/layout/AdminPanel'
import ChatArea from '../components/chat/ChatArea'
import AIPanel from '../components/ai/AIPanel'
import AIButton from '../components/ai/AIButton'
import ProfileModal from '../components/profile/ProfileModal'
import NotificationsPanel from '../components/layout/NotificationsPanel'
import SearchOverlay from '../components/layout/SearchOverlay'

export default function MainApp() {
  const view = useAppStore(s => s.view)
  const aiPanelOpen = useAppStore(s => s.ui.ai_panel_open)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex overflow-hidden bg-bg-base"
    >
      {/* Nav rail — always visible */}
      <NavRail />

      {/* Sidebar — contextual */}
      <AnimatePresence mode="wait">
        {view === 'channels' && (
          <motion.div
            key="channel-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full shrink-0"
          >
            <ChannelSidebar />
          </motion.div>
        )}
        {view === 'dm' && (
          <motion.div
            key="dm-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full shrink-0"
          >
            <DMSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-hidden flex"
            >
              <AdminPanel />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-hidden flex"
            >
              <ChatArea />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Panel */}
        <AIPanel />
      </div>

      {/* Floating AI button */}
      <AnimatePresence>
        {!aiPanelOpen && <AIButton key="ai-btn" />}
      </AnimatePresence>

      {/* Overlays */}
      <ProfileModal />
      <NotificationsPanel />
      <SearchOverlay />
    </motion.div>
  )
}
