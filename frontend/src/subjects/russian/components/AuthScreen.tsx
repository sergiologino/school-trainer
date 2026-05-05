import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { User } from '../store/useStore';

const DEMO_USERS = [
  { id: 'u1', name: 'Алиса Смирнова', email: 'alice@school.ru', avatar: '👧', level: 3, xp: 1250, streak: 5, lastActivity: '', badges: ['first_task', 'streak_3'] },
  { id: 'u2', name: 'Иван Петров', email: 'ivan@school.ru', avatar: '👦', level: 1, xp: 0, streak: 0, lastActivity: '', badges: [] },
];

export default function AuthScreen() {
  const { login } = useStore();
  const [showDemo, setShowDemo] = useState(false);

  const handleGoogleLogin = () => {
    // Simulate Google OAuth — in production, use real OAuth flow
    setShowDemo(true);
  };

  const handleDemoLogin = (user: User) => {
    login(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['📝', '✏️', '📚', '🔤', '⭐', '🎯', '💡', '🏆'].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${(i * 13 + 5) % 95}%`,
              top: `${(i * 17 + 10) % 85}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-3"
          >
            📖
          </motion.div>
          <h1 className="text-3xl font-black text-indigo-700" style={{ fontFamily: 'Russo One, sans-serif' }}>
            РусЯз
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-semibold">Учим русский — играючи!</p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full font-bold">5 класс</span>
            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-bold">6 класс</span>
          </div>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: '🎮', label: 'Игры' },
            { icon: '📝', label: 'Тесты' },
            { icon: '🏆', label: 'Рейтинг' },
          ].map((f) => (
            <div key={f.label} className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="text-2xl">{f.icon}</div>
              <div className="text-xs text-gray-600 font-bold mt-1">{f.label}</div>
            </div>
          ))}
        </div>

        {!showDemo ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-2xl py-3.5 px-4 text-gray-700 font-bold text-base shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Войти через Google
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-center text-gray-500 text-sm mb-4 font-semibold">Выбери профиль для демо:</p>
            <div className="space-y-3">
              {DEMO_USERS.map((user) => (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDemoLogin(user as User)}
                  className="w-full flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl py-3 px-4 text-left hover:border-indigo-400 transition-all"
                >
                  <span className="text-3xl">{user.avatar}</span>
                  <div>
                    <div className="font-bold text-gray-800">{user.name}</div>
                    <div className="text-xs text-gray-500">Уровень {user.level} · {user.xp} XP</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <p className="text-center text-xs text-gray-400 mt-4">
          Входя в систему, вы соглашаетесь с условиями использования
        </p>
      </motion.div>
    </div>
  );
}
