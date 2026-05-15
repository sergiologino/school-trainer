import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useTopics } from '../context/TopicsContext';

const XP_PER_LEVEL = 200;

const BADGES = [
  { id: 'first_quiz', emoji: '🎯', name: 'Первый тест', desc: 'Пройди первый тест' },
  { id: 'perfect_score', emoji: '💯', name: 'Отлично!', desc: 'Получи 100% в тесте' },
  { id: 'streak_5', emoji: '🔥', name: 'Серия 5', desc: '5 правильных подряд' },
  { id: 'all_topics', emoji: '🌟', name: 'Всё знаю!', desc: 'Пройди все темы' },
  { id: 'multiplication_master', emoji: '✖️', name: 'Мастер умножения', desc: 'Пройди тему умножения' },
  { id: 'fraction_wizard', emoji: '🧙', name: 'Маг дробей', desc: 'Пройди все темы про дроби' },
  { id: 'decimal_expert', emoji: '🔢', name: 'Дес. эксперт', desc: 'Пройди темы про десятичные' },
  { id: 'top3', emoji: '🏆', name: 'Топ 3!', desc: 'Попади в топ 3 рейтинга' },
];

export const ProfileScreen: React.FC = () => {
  const { user, logout } = useStore();
  const { topics } = useTopics();

  if (!user) return null;

  const xpInLevel = user.xp % XP_PER_LEVEL;
  const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100;

  const topicProgress = topics.map((topic) => {
    const score = user.topicScores[topic.id] || 0;
    const completed = user.completedTopics.includes(topic.id);
    return { ...topic, score, completed };
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 pt-8 pb-10 rounded-b-3xl">
        <div className="text-center">
          <motion.div
            className="text-7xl mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {user.avatar}
          </motion.div>
          <h1 className="font-black text-2xl">{user.name}</h1>
          {user.email && <p className="text-indigo-200 text-sm">{user.email}</p>}
          <div className="flex justify-center gap-3 mt-3">
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
              🏅 Уровень {user.level}
            </div>
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-bold">
              ⭐ {user.totalScore} очков
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* XP Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black text-gray-700">Прогресс уровня</span>
            <span className="text-sm text-gray-500">{xpInLevel}/{XP_PER_LEVEL} XP</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full flex items-center justify-end pr-2"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            >
              {xpPercent > 20 && <span className="text-white text-xs font-bold">{Math.round(xpPercent)}%</span>}
            </motion.div>
          </div>
          <p className="text-xs text-gray-500 mt-1">До уровня {user.level + 1}: ещё {XP_PER_LEVEL - xpInLevel} XP</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📚', label: 'Тем пройдено', value: user.completedTopics.length, color: 'bg-blue-50 text-blue-700' },
            { icon: '🏆', label: 'Значков', value: user.badges.length, color: 'bg-yellow-50 text-yellow-700' },
            { icon: '⭐', label: 'Всего очков', value: user.totalScore, color: 'bg-purple-50 text-purple-700' },
            { icon: '🎮', label: 'Уровень XP', value: user.xp, color: 'bg-green-50 text-green-700' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className={`${stat.color} rounded-2xl p-4`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-black text-2xl">{stat.value}</div>
              <div className="text-sm opacity-70">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-black text-gray-800 mb-3">🏅 Значки</h3>
          <div className="grid grid-cols-4 gap-3">
            {BADGES.map((badge, i) => {
              const earned = user.badges.includes(badge.id);
              return (
                <motion.div
                  key={badge.id}
                  className={`rounded-xl p-2 text-center ${earned ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-100 opacity-40'}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: earned ? 1 : 0.4, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  title={badge.desc}
                >
                  <div className="text-2xl mb-1">{badge.emoji}</div>
                  <div className="text-xs font-bold text-gray-700 leading-tight">{badge.name}</div>
                  <div className="mt-1 text-[10px] leading-tight text-gray-500">{badge.desc}</div>
                </motion.div>
              );
            })}
          </div>
          {user.badges.length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-2">Пройди тесты, чтобы получить значки!</p>
          )}
        </div>

        {/* Topic progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-black text-gray-800 mb-3">📊 Прогресс по темам</h3>
          <div className="space-y-3">
            {topicProgress.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{topic.emoji}</span>
                  <span className="flex-1 text-sm font-bold text-gray-700 truncate">{topic.title}</span>
                  <span className="text-sm font-black text-indigo-600">{topic.score} ⭐</span>
                  {topic.completed && <span className="text-green-500 text-sm">✓</span>}
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${topic.bgGradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: topic.completed ? '100%' : topic.score > 0 ? '50%' : '0%' }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Share profile */}
        <button
          onClick={() => {
            const text = `🧮 МатемаТика: я достиг уровня ${user.level} и набрал ${user.totalScore} очков! Учи математику вместе со мной!`;
            if (navigator.share) {
              navigator.share({ title: 'Мой профиль МатемаТика', text }).catch(() => {});
            } else {
              navigator.clipboard.writeText(text).then(() => alert('Скопировано!')).catch(() => {});
            }
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-4 rounded-2xl"
        >
          📤 Поделиться профилем
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl"
        >
          🚪 Выйти
        </button>
      </div>
    </div>
  );
};
