import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUnifiedStore } from '@/store/useUnifiedStore';

const AVATARS = ['🦊', '🐯', '🦁', '🐺', '🦝', '🐸', '🐧', '🦉', '🦄', '🐲'];

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useUnifiedStore((s) => s.login);
  const [step, setStep] = useState<'welcome' | 'name' | 'avatar'>('welcome');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');

  const finish = () => {
    login({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? `u-${crypto.randomUUID()}` : `u-${Date.now()}`,
      name: name.trim(),
      email: '',
      avatar: selectedAvatar,
      grade: 5,
    });
    navigate('/app', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {step === 'welcome' && (
        <motion.div className="relative z-10 text-center max-w-md w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-8xl mb-4">📚</div>
          <h1 className="text-4xl font-black text-white mb-3">School Trainer</h1>
          <p className="text-indigo-200 mb-8 text-sm px-4">Математика, русский и английский • 5 класс</p>
          <motion.button
            type="button"
            onClick={() => setStep('name')}
            className="w-full bg-white text-gray-900 font-bold py-4 rounded-2xl shadow-lg"
            whileTap={{ scale: 0.98 }}
          >
            Начать
          </motion.button>
        </motion.div>
      )}

      {step === 'name' && (
        <motion.div className="relative z-10 max-w-md w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-black text-2xl text-white mb-4 text-center">Как зовут ученика?</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            className="w-full px-5 py-4 rounded-2xl border-2 border-white/25 bg-white/10 text-white placeholder:text-indigo-200 outline-none mb-2"
          />
          {error ? <p className="text-rose-300 text-sm">{error}</p> : null}
          <motion.button
            type="button"
            onClick={() => {
              if (name.trim().length < 2) {
                setError('Минимум 2 символа');
                return;
              }
              setError('');
              setStep('avatar');
            }}
            className="w-full mt-4 bg-white text-gray-900 font-bold py-4 rounded-2xl"
            whileTap={{ scale: 0.98 }}
          >
            Далее
          </motion.button>
        </motion.div>
      )}

      {step === 'avatar' && (
        <motion.div className="relative z-10 max-w-md w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-black text-2xl text-white mb-4 text-center">Выбери аватар</h2>
          <div className="grid grid-cols-6 gap-2 mb-8">
            {AVATARS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setSelectedAvatar(a)}
                className={`text-2xl rounded-2xl p-2 border-2 ${
                  a === selectedAvatar ? 'border-violet-300 bg-white/20 scale-105' : 'border-white/15 bg-transparent'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <motion.button type="button" onClick={finish} className="w-full bg-white text-gray-900 font-bold py-4 rounded-2xl" whileTap={{ scale: 0.98 }}>
            Перейти к предметам
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
