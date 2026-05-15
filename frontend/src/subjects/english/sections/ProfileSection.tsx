import { motion } from 'framer-motion';
import { useStore, ALL_ACHIEVEMENTS_LIST } from '../store/useStore';
import { useUnifiedStore } from '@/store/useUnifiedStore';
import { AVATAR_CHOICES } from '@/store/profile';

export default function ProfileSection() {
  const { user, stats, setUser, setCurrentSection } = useStore();
  const updateUnifiedProfile = useUnifiedStore((s) => s.updateProfile);

  if (!user) {
    setCurrentSection('home');
    return null;
  }

  const level = Math.floor(stats.totalXP / 100) + 1;

  const handleLogout = () => {
    setUser(null);
    setCurrentSection('home');
  };

  const handleAvatarChange = (av: string) => {
    setUser({ ...user, avatar: av });
    updateUnifiedProfile({ avatar: av });
  };

  const handleGradeChange = (g: number) => {
    setUser({ ...user, grade: g });
    updateUnifiedProfile({ grade: g });
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setCurrentSection('home')} className="text-gray-500 text-xl">←</button>
        <h1 className="text-xl font-extrabold text-gray-800">Мой профиль</h1>
      </div>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-5 text-white mb-5 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
            {user.avatar}
          </div>
          <div>
            <h2 className="text-xl font-extrabold">{user.name}</h2>
            <p className="text-violet-200 text-sm">{user.grade} класс • Уровень {level}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'XP', value: stats.totalXP, emoji: '⚡' },
            { label: 'Серия', value: `${stats.streakDays}д`, emoji: '🔥' },
            { label: 'Слов', value: stats.wordsLearned, emoji: '📚' },
            { label: 'Наград', value: stats.achievements.length, emoji: '🏅' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/15 rounded-xl p-2 text-center">
              <div className="text-lg">{stat.emoji}</div>
              <div className="font-extrabold text-sm">{stat.value}</div>
              <div className="text-violet-300 text-[10px]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar picker */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-bold text-gray-800 mb-3">Выбери аватар</h3>
        <div className="grid grid-cols-6 gap-2">
          {AVATAR_CHOICES.map(av => (
            <motion.button
              key={av}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAvatarChange(av)}
              className={`aspect-square rounded-xl text-xl flex items-center justify-center ${
                user.avatar === av
                  ? 'bg-violet-100 border-2 border-violet-500'
                  : 'bg-gray-100 border-2 border-transparent'
              }`}
            >
              {av}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grade picker */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-bold text-gray-800 mb-3">Класс</h3>
        <div className="flex gap-2">
          {[4, 5, 6].map(g => (
            <button
              key={g}
              onClick={() => handleGradeChange(g)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${
                user.grade === g ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {g} класс
            </button>
          ))}
        </div>
      </div>

      {/* Stats detail */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-bold text-gray-800 mb-3">Статистика</h3>
        <div className="space-y-2">
          {[
            { label: 'Слов изучено', value: stats.wordsLearned, emoji: '📚' },
            { label: 'Глаголов изучено', value: stats.verbsLearned, emoji: '🔥' },
            { label: 'Идеальных квизов', value: stats.perfectQuizzes, emoji: '⭐' },
            { label: 'Диктантов пройдено', value: stats.dictationsDone, emoji: '🎤' },
            { label: 'Дней подряд', value: stats.streakDays, emoji: '🔥' },
            { label: 'Всего XP', value: stats.totalXP, emoji: '⚡' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">{stat.emoji} {stat.label}</span>
              <span className="font-bold text-gray-800">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-bold text-gray-800 mb-3">Достижения ({stats.achievements.length}/{ALL_ACHIEVEMENTS_LIST.length})</h3>
        <div className="grid grid-cols-4 gap-2">
          {ALL_ACHIEVEMENTS_LIST.map(ach => {
            const unlocked = stats.achievements.find(a => a.id === ach.id);
            return (
              <div
                key={ach.id}
                className={`flex flex-col items-center p-2 rounded-xl text-center ${
                  unlocked ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-100 opacity-40'
                }`}
              >
                <span className="text-2xl">{ach.emoji}</span>
                <span className="text-[9px] text-gray-600 mt-1 leading-tight">{ach.titleRu}</span>
                {!unlocked && <span className="mt-1 text-[8px] leading-tight text-gray-500">{ach.requirement}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="w-full bg-red-50 border-2 border-red-200 text-red-600 font-bold py-3 rounded-2xl"
      >
        🚪 Выйти из аккаунта
      </motion.button>
    </div>
  );
}
