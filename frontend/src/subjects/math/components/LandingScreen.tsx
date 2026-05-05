import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const AVATARS = ['🦊', '🐯', '🦁', '🐺', '🦝', '🐸', '🐧', '🦉', '🦄', '🐲', '🚀', '⭐'];

export const LandingScreen: React.FC = () => {
  const login = useStore(s => s.login);
  const [step, setStep] = useState<'welcome' | 'name' | 'avatar'>('welcome');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦊');
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    // Simulate Google OAuth
    const googleUser = {
      id: 'google-' + Date.now(),
      name: 'Ученик Google',
      avatar: '🎒',
      email: 'student@gmail.com',
    };
    login(googleUser);
  };

  const handleNameSubmit = () => {
    if (name.trim().length < 2) {
      setError('Имя должно быть не менее 2 символов');
      return;
    }
    setError('');
    setStep('avatar');
  };

  const handleAvatarSubmit = () => {
    login({ id: 'local-' + Date.now(), name: name.trim(), avatar: selectedAvatar, email: '' });
  };

  const floatingItems = ['➕', '✖️', '➗', '➖', '📐', '🔢', '📊', '🎯'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Floating background items */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl select-none pointer-events-none"
          style={{ left: `${10 + i * 12}%`, top: `${10 + (i % 3) * 30}%` }}
          animate={{ y: [-20, 20, -20], rotate: [-10, 10, -10] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {item}
        </motion.div>
      ))}

      {step === 'welcome' && (
        <motion.div
          className="relative z-10 text-center max-w-md w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧮
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-2 drop-shadow-lg">
            МатемаТика
          </h1>
          <p className="text-xl text-purple-200 mb-2">Учимся с удовольствием!</p>
          <p className="text-purple-300 mb-8 text-sm">
            🎮 Игровое обучение математике для 5 класса
          </p>

          <div className="space-y-3">
            <motion.button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-800 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Войти через Google
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-purple-500/50" />
              <span className="text-purple-300 text-sm">или</span>
              <div className="flex-1 h-px bg-purple-500/50" />
            </div>

            <motion.button
              onClick={() => setStep('name')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🎒 Быстрый вход (без регистрации)
            </motion.button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: '🏆', text: 'Зарабатывай очки' },
              { icon: '🎮', text: 'Играй в тренажёры' },
              { icon: '📚', text: 'Изучай темы' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur rounded-xl p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-white/80 text-xs font-medium">{item.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {step === 'name' && (
        <motion.div
          className="relative z-10 text-center max-w-md w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-3xl font-black text-white mb-2">Как тебя зовут?</h2>
          <p className="text-purple-300 mb-6">Введи своё имя, чтобы начать!</p>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
              placeholder="Твоё имя..."
              className="w-full bg-white/20 text-white placeholder-white/50 text-xl font-bold text-center py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 mb-4"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <motion.button
              onClick={handleNameSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Далее →
            </motion.button>
          </div>

          <button onClick={() => setStep('welcome')} className="mt-4 text-purple-300 hover:text-white transition-colors">
            ← Назад
          </button>
        </motion.div>
      )}

      {step === 'avatar' && (
        <motion.div
          className="relative z-10 text-center max-w-md w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-6xl mb-4">{selectedAvatar}</div>
          <h2 className="text-3xl font-black text-white mb-2">Выбери аватар!</h2>
          <p className="text-purple-300 mb-4">Кто ты в мире математики?</p>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6">
            <div className="grid grid-cols-6 gap-2 mb-6">
              {AVATARS.map(avatar => (
                <motion.button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-3xl p-2 rounded-xl transition-all ${selectedAvatar === avatar ? 'bg-purple-500 scale-110' : 'bg-white/10 hover:bg-white/20'}`}
                  whileTap={{ scale: 0.9 }}
                >
                  {avatar}
                </motion.button>
              ))}
            </div>
            <motion.button
              onClick={handleAvatarSubmit}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-2xl text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🚀 Поехали учиться!
            </motion.button>
          </div>

          <button onClick={() => setStep('name')} className="mt-4 text-purple-300 hover:text-white transition-colors">
            ← Назад
          </button>
        </motion.div>
      )}
    </div>
  );
};
