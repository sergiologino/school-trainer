import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const XP_PER_LEVEL = 500;

const BADGES: Record<string, { label: string; icon: string; desc: string }> = {
  first_task: { label: 'Первый шаг', icon: '🎯', desc: 'Выполни первое задание' },
  streak_3: { label: 'Три дня подряд', icon: '🔥', desc: 'Занимайся 3 дня подряд' },
  streak_7: { label: 'Неделя', icon: '🏆', desc: 'Занимайся 7 дней подряд' },
  perfect: { label: 'Перфекционист', icon: '⭐', desc: 'Пройди тест на 100%' },
  grammar_master: { label: 'Знаток грамматики', icon: '📝', desc: 'Пройди все тесты по грамматике' },
  spell_master: { label: 'Мастер правописания', icon: '✍️', desc: 'Пройди все тесты по правописанию' },
  reader: { label: 'Читатель', icon: '📚', desc: 'Открой 10 правил в справочнике' },
  top10: { label: 'Топ-10', icon: '🌟', desc: 'Войди в топ-10 рейтинга' },
};

const ALL_BADGES = Object.keys(BADGES);

export default function ProfileScreen({ onLogout }: { onLogout?: () => void }) {
  const { user, logout, taskResults } = useStore();
  if (!user) return null;

  const levelProgress = (user.xp % XP_PER_LEVEL) / XP_PER_LEVEL;
  const tasksCompleted = taskResults.length;
  const avgScore = tasksCompleted > 0
    ? Math.round(taskResults.reduce((s, r) => s + (r.score / r.total) * 100, 0) / tasksCompleted)
    : 0;

  const modeStats = taskResults.reduce((acc, r) => {
    acc[r.mode] = (acc[r.mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const modeLabels: Record<string, string> = {
    grammar: '📝 Грамматика',
    spelling: '✍️ Правописание',
    syntax: '🔗 Синтаксис',
    dictant: '🎙️ Диктанты',
  };

  const handleShare = async () => {
    const text = `🎓 Я изучаю русский язык в приложении РусЯз!\n⭐ Уровень ${user.level} · ${user.xp} XP\n🔥 ${user.streak} дней подряд\n📊 Выполнено заданий: ${tasksCompleted}\n\nПрисоединяйся! #РусЯз #РусскийЯзык`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Мой профиль в РусЯз', text }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Скопировано в буфер обмена!');
      } catch {}
    }
  };

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 pt-12 pb-16 px-4 rounded-b-[2.5rem]">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl"
          >
            {user.avatar}
          </motion.div>
          <div>
            <h1 className="text-white text-2xl font-black">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-bold">
                Уровень {user.level}
              </span>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-bold">
                🔥 {user.streak} дней
              </span>
            </div>
            <div className="text-indigo-200 text-sm mt-1">{user.email}</div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4 bg-white/10 rounded-2xl p-3">
          <div className="flex justify-between text-white/80 text-xs mb-2">
            <span className="font-bold">Опыт</span>
            <span>{user.xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP до уровня {user.level + 1}</span>
          </div>
          <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress * 100}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-8 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Заданий', value: tasksCompleted, icon: '🎯' },
            { label: 'Средний %', value: `${avgScore}`, icon: '📊' },
            { label: 'XP', value: user.xp, icon: '⭐' },
            { label: 'Значков', value: user.badges.length, icon: '🏅' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-3 shadow-lg text-center">
              <div className="text-xl">{s.icon}</div>
              <div className="text-gray-800 font-black text-sm">{s.value}</div>
              <div className="text-gray-400 text-[10px] font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mode stats */}
      {Object.keys(modeStats).length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-gray-800 font-black text-lg mb-3">📊 По разделам</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            {Object.entries(modeStats).map(([mode, count]) => {
              const total = tasksCompleted;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={mode}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-gray-700">{modeLabels[mode] || mode}</span>
                    <span className="text-gray-500">{count} {count === 1 ? 'задание' : 'заданий'}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-indigo-400 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="px-4 mb-6">
        <h2 className="text-gray-800 font-black text-lg mb-3">🏅 Значки</h2>
        <div className="grid grid-cols-2 gap-3">
          {ALL_BADGES.map((badgeId) => {
            const badge = BADGES[badgeId];
            const earned = user.badges.includes(badgeId);
            return (
              <motion.div
                key={badgeId}
                whileTap={{ scale: 0.95 }}
                className={`rounded-2xl p-3 flex items-center gap-3 border-2 transition-all ${
                  earned
                    ? 'bg-indigo-50 border-indigo-300'
                    : 'bg-white border-gray-100 opacity-50'
                }`}
              >
                <span className={`text-3xl ${!earned && 'grayscale'}`} style={{ filter: earned ? 'none' : 'grayscale(1)' }}>
                  {badge.icon}
                </span>
                <div>
                  <div className={`font-black text-sm ${earned ? 'text-indigo-700' : 'text-gray-500'}`}>
                    {badge.label}
                  </div>
                  <div className="text-gray-400 text-xs">{badge.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-3.5 font-black text-base shadow-lg flex items-center justify-center gap-2"
        >
          📤 Поделиться профилем
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full bg-white border-2 border-red-200 text-red-500 rounded-2xl py-3.5 font-black text-base flex items-center justify-center gap-2"
        >
          🚪 Выйти из аккаунта
        </motion.button>
      </div>
    </div>
  );
}
