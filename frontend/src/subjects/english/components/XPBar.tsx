import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

interface XPBarProps {
  showFull?: boolean;
}

export default function XPBar({ showFull = false }: XPBarProps) {
  const { stats, user, setCurrentSection } = useStore();
  const level = Math.floor(stats.totalXP / 100) + 1;
  const xpInLevel = stats.totalXP % 100;

  if (!showFull) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-violet-600">⚡ {stats.totalXP} XP</span>
        <span className="text-xs text-orange-500">🔥 {stats.streakDays}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-xl">
            {user?.avatar || '🦅'}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">{user?.name || 'Гость'}</p>
            <p className="text-xs text-gray-500">Уровень {level} • {user?.grade || 4} класс</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentSection('profile')}
          className="text-xs text-violet-600 font-semibold bg-violet-50 px-3 py-1 rounded-full"
        >
          Профиль
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs font-bold text-gray-600">Lv.{level}</span>
        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpInLevel}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-gray-500">{xpInLevel}/100</span>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
          <span>🔥</span>
          <span className="text-xs font-bold text-orange-600">{stats.streakDays} дней</span>
        </div>
        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
          <span>📚</span>
          <span className="text-xs font-bold text-blue-600">{stats.wordsLearned} слов</span>
        </div>
        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
          <span>⭐</span>
          <span className="text-xs font-bold text-green-600">{stats.perfectQuizzes} квиз</span>
        </div>
      </div>
    </div>
  );
}
