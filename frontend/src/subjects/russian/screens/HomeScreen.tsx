import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const XP_PER_LEVEL = 500;

const dailyTips = [
  { icon: '💡', tip: 'ЖИ-ШИ пиши с буквой И! Жираф, машина, лыжи.' },
  { icon: '🔑', tip: 'Проверяй безударную гласную: ударение раскрывает секрет!' },
  { icon: '👑', tip: 'Подлежащее + сказуемое = грамматическая основа предложения.' },
  { icon: '🎯', tip: 'НЕ с глаголами всегда пишется раздельно: не знаю, не читал.' },
  { icon: '🌟', tip: 'Наречие — неизменяемая часть речи. Оно никогда не склоняется!' },
];

const todayTip = dailyTips[new Date().getDay() % dailyTips.length];

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { user, taskResults } = useStore();
  if (!user) return null;

  const levelProgress = (user.xp % XP_PER_LEVEL) / XP_PER_LEVEL;
  const tasksCompleted = taskResults.length;
  const avgScore = tasksCompleted > 0
    ? Math.round(taskResults.reduce((s, r) => s + (r.score / r.total) * 100, 0) / tasksCompleted)
    : 0;

  const quickActions = [
    { icon: '📝', label: 'Грамматика', screen: 'learn', color: 'from-blue-400 to-indigo-500', sub: 'Части речи' },
    { icon: '✍️', label: 'Правописание', screen: 'tasks', color: 'from-green-400 to-teal-500', sub: 'Тренировка' },
    { icon: '📖', label: 'Диктант', screen: 'tasks', color: 'from-orange-400 to-red-500', sub: 'Тест' },
    { icon: '📚', label: 'Справочник', screen: 'learn', color: 'from-purple-400 to-pink-500', sub: 'Правила' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 pt-12 pb-20 px-4 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-sm font-semibold">Привет,</p>
            <h1 className="text-white text-2xl font-black">{user.name.split(' ')[0]}! 👋</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('profile')}
            className="bg-white/20 backdrop-blur rounded-2xl p-2 flex items-center gap-2"
          >
            <span className="text-2xl">{user.avatar}</span>
            <div className="text-right pr-1">
              <div className="text-white font-bold text-sm">Ур. {user.level}</div>
              <div className="text-indigo-200 text-xs">{user.xp} XP</div>
            </div>
          </motion.button>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl"
          >
            🔥
          </motion.div>
          <span className="text-white font-bold">{user.streak} дней подряд!</span>
          <span className="text-indigo-200 text-sm">Не прерывай серию</span>
        </div>

        {/* XP Progress */}
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span className="font-bold">Уровень {user.level}</span>
            <span>{user.xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP</span>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full"
            />
          </div>
          <p className="text-white/70 text-xs mt-1">
            До следующего уровня: {XP_PER_LEVEL - (user.xp % XP_PER_LEVEL)} XP
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="px-4 -mt-10 grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Заданий', value: tasksCompleted, icon: '🎯', color: 'text-blue-600' },
          { label: 'Средний балл', value: `${avgScore}%`, icon: '📊', color: 'text-green-600' },
          { label: 'Значков', value: user.badges.length, icon: '🏅', color: 'text-orange-600' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-3 shadow-lg text-center"
          >
            <div className="text-2xl">{stat.icon}</div>
            <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-500 text-xs font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Daily tip */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex gap-3"
        >
          <span className="text-3xl flex-shrink-0">{todayTip.icon}</span>
          <div>
            <p className="text-amber-800 font-bold text-xs mb-1">💫 Правило дня</p>
            <p className="text-amber-900 text-sm font-semibold">{todayTip.tip}</p>
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="px-4 mb-6">
        <h2 className="text-gray-800 font-black text-lg mb-3">Быстрый старт</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(action.screen)}
              className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 text-left shadow-lg`}
            >
              <span className="text-3xl block mb-2">{action.icon}</span>
              <div className="text-white font-black text-base">{action.label}</div>
              <div className="text-white/70 text-xs">{action.sub}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent results */}
      {taskResults.length > 0 && (
        <div className="px-4">
          <h2 className="text-gray-800 font-black text-lg mb-3">Последние результаты</h2>
          <div className="space-y-2">
            {taskResults.slice(-3).reverse().map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="font-bold text-gray-800 capitalize">{r.mode}</div>
                  <div className="text-gray-500 text-xs">{new Date(r.date).toLocaleDateString('ru-RU')}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black ${
                    r.score / r.total >= 0.8 ? 'text-green-500' :
                    r.score / r.total >= 0.6 ? 'text-orange-500' : 'text-red-500'
                  }`}>
                    {r.score}/{r.total}
                  </div>
                  <div className="text-xs text-gray-400">
                    {Math.round((r.score / r.total) * 100)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
