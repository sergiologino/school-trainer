import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const AVATARS = ['🦊', '🦋', '🐻', '🐱', '🐯', '🦄', '🦁', '🐸', '🐺', '🦅', '🐨', '🦒'];
const GRADES = [4, 5, 6];

export default function LoginSection() {
  const { setUser, setCurrentSection, updateStreak } = useStore();
  const [step, setStep] = useState<'welcome' | 'setup' | 'google'>('welcome');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(5);
  const [avatar, setAvatar] = useState('🦅');

  const handleGoogleLogin = () => {
    // Simulate Google OAuth flow
    setStep('setup');
  };

  const handleGuestLogin = () => {
    setStep('setup');
  };

  const handleFinish = () => {
    if (!name.trim()) return;
    setUser({
      id: Date.now().toString(),
      name: name.trim(),
      email: '',
      avatar,
      grade,
    });
    updateStreak();
    setCurrentSection('home');
  };

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex flex-col justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm mx-auto w-full"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">{avatar}</div>
            <h2 className="text-2xl font-extrabold text-gray-800">Расскажи о себе</h2>
            <p className="text-gray-500 text-sm mt-1">Это займёт всего минуту!</p>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-lg space-y-5">
            {/* Name */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">Твоё имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Введи своё имя..."
                className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
              />
            </div>

            {/* Grade */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">Класс</label>
              <div className="flex gap-2">
                {GRADES.map(g => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      grade === g
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {g} класс
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar */}
            <div>
              <label className="text-xs font-bold text-gray-600 mb-2 block">Выбери аватар</label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map(av => (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`aspect-square rounded-xl text-xl flex items-center justify-center transition-all ${
                      avatar === av
                        ? 'bg-violet-100 border-2 border-violet-500 scale-110'
                        : 'bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleFinish}
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-extrabold py-4 rounded-2xl shadow-lg text-base disabled:opacity-50"
            >
              🚀 Начать учиться!
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex flex-col justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm mx-auto w-full text-center"
      >
        {/* Logo */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6"
        >
          <img src="/owl-mascot.png" alt="Owl" className="w-28 h-28 mx-auto object-contain drop-shadow-2xl" />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-white mb-2">English Pro</h1>
        <p className="text-violet-200 text-base mb-2">🇬🇧 Учи английский как игру!</p>
        <p className="text-violet-300 text-sm mb-8">Для школьников 4-6 класса</p>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { emoji: '🃏', text: 'Карточки со словами' },
            { emoji: '🎤', text: 'Диктант и речь' },
            { emoji: '🏆', text: 'Рейтинг и соревнования' },
            { emoji: '⚡', text: 'XP и достижения' },
          ].map(f => (
            <div key={f.text} className="bg-white/10 rounded-2xl p-3 text-white text-xs font-semibold flex items-center gap-2">
              <span className="text-xl">{f.emoji}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {/* Google OAuth Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-800 font-extrabold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-base"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Войти через Google
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGuestLogin}
            className="w-full bg-white/15 border-2 border-white/30 text-white font-bold py-4 rounded-2xl text-base"
          >
            👤 Продолжить как гость
          </motion.button>
        </div>

        <p className="text-violet-300 text-xs mt-5">
          Входя в приложение, ты соглашаешься с условиями использования
        </p>
      </motion.div>
    </div>
  );
}
