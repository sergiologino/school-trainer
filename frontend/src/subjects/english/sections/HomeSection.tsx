import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import XPBar from '../components/XPBar';

const SECTION_CARDS = [
  {
    id: 'words',
    title: 'Слова',
    subtitle: 'Учи и запоминай слова',
    emoji: '📚',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    xp: '+5 XP за слово',
  },
  {
    id: 'grammar',
    title: 'Времена и предлоги',
    subtitle: 'Артикли, времена, предлоги',
    emoji: '📝',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    xp: '+10 XP за урок',
  },
  {
    id: 'verbs',
    title: 'Неправильные глаголы',
    subtitle: 'Все формы глаголов',
    emoji: '🔥',
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
    xp: '+8 XP за глагол',
  },
  {
    id: 'dictation',
    title: 'Диктант',
    subtitle: 'Проверка произношения',
    emoji: '🎤',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    xp: '+15 XP за диктант',
  },
  {
    id: 'leaderboard',
    title: 'Рейтинг',
    subtitle: 'Соревнуйся с друзьями',
    emoji: '🏆',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-50',
    xp: 'Топ игроков',
  },
];

const TIPS = [
  '💡 Учи по 10 слов в день — это лучше, чем 100 слов за раз!',
  '💡 Повторяй слова через 1 день, потом через неделю — это называется интервальное повторение!',
  '💡 Произноси слова вслух — это помогает запомнить!',
  '💡 Связывай слово с ярким образом или историей!',
  '💡 Поддерживай серию дней — даже 5 минут в день!',
];

export default function HomeSection() {
  const { setCurrentSection, user, stats, updateStreak } = useStore();

  const randomTip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];

  const handleNav = (id: string) => {
    updateStreak();
    setCurrentSection(id);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Привет, {user?.name?.split(' ')[0] || 'Друг'}! 👋
          </h1>
          <p className="text-sm text-gray-500">Продолжим учить английский?</p>
        </div>
        <motion.img
          src="/owl-mascot.png"
          alt="Owl"
          className="w-16 h-16 object-contain"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* XP Bar */}
      <XPBar showFull />

      {/* Daily tip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-3"
      >
        <p className="text-sm text-amber-800 font-medium">{randomTip}</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: 'Слов', value: stats.wordsLearned, emoji: '📖', color: 'text-violet-600' },
          { label: 'Глаголов', value: stats.verbsLearned, emoji: '✍️', color: 'text-orange-600' },
          { label: 'Диктантов', value: stats.dictationsDone, emoji: '🎤', color: 'text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-xl">{stat.emoji}</div>
            <div className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <h2 className="text-lg font-bold text-gray-800 mt-5 mb-3">Разделы</h2>
      <div className="grid grid-cols-2 gap-3">
        {SECTION_CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNav(card.id)}
            className={`${card.bg} rounded-2xl p-4 text-left border border-white shadow-sm hover:shadow-md transition-all ${
              card.id === 'grammar' ? 'col-span-2' : ''
            }`}
          >
            <div className="text-3xl mb-2">{card.emoji}</div>
            <h3 className="font-bold text-gray-800 text-sm leading-tight">{card.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{card.subtitle}</p>
            <span className={`inline-block mt-2 text-xs font-semibold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {card.xp}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Achievements preview */}
      {stats.achievements.length > 0 && (
        <div className="mt-5">
          <h2 className="text-lg font-bold text-gray-800 mb-3">🏅 Достижения</h2>
          <div className="flex gap-2 flex-wrap">
            {stats.achievements.slice(-6).map((ach) => (
              <motion.div
                key={ach.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center bg-white rounded-xl p-2 shadow-sm border border-gray-100 w-16"
              >
                <span className="text-2xl">{ach.emoji}</span>
                <span className="text-[9px] text-gray-600 text-center leading-tight mt-1">{ach.titleRu}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
