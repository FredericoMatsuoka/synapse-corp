import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from './store/appStore'
import LoginPage from './pages/LoginPage'
import MainApp from './pages/MainApp'

export default function App() {
  const authenticated = useAppStore(s => s.authenticated)

  return (
    <AnimatePresence mode="wait">
      {!authenticated ? (
        <motion.div key="login" className="w-full h-full">
          <LoginPage />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <MainApp />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
