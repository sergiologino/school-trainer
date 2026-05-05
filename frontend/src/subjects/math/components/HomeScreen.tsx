import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useTopics } from '../context/TopicsContext';

const XP_PER_LEVEL = 200;

export const HomeScreen: React.FC = () => {
  const { user, setScreen, setCurrentTopic } = useStore();
  const { topics, loading } = useTopics();

  if (!user) return null;

  const xpProgress = (user.xp % XP_PER_LEVEL) / XP_PER_LEVEL;
  const completedCount = user.completedTopics.length;

  const handleTopicClick = (topicId: string) => {
    setCurrentTopic(topicId);
    setScreen('topic');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 pt-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="text-4xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {user.avatar}
            </motion.div>
            <div>
              <p className="text-indigo-200 text-sm">Привет,</p>
              <p className="font-black text-xl">{user.name}!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
              <span className="text-yellow-300">⭐</span>
              <span className="font-bold">{user.totalScore}</span>
            </div>
          </div>
        </div>

        {/* Level progress */}
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏅</span>
              <span className="font-bold text-lg">Уровень {user.level}</span>
            </div>
            <span className="text-indigo-200 text-sm">{user.xp % XP_PER_LEVEL}/{XP_PER_LEVEL} XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: '📚', value: completedCount, label: 'Тем пройдено', color: 'from-blue-500 to-cyan-500' },
            { icon: '🏆', value: user.badges.length, label: 'Значков', color: 'from-yellow-500 to-orange-500' },
            { icon: '🔥', value: user.level, label: 'Уровень', color: 'from-red-500 to-pink-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-3 text-center shadow-md`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-black text-xl">{stat.value}</div>
              <div className="text-white/80 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Topics */}
        <h2 className="text-xl font-black text-gray-800 mb-3">📖 Темы для изучения</h2>
        {loading && <p className="text-xs text-gray-500 mb-2">Загрузка расписания тем…</p>}

        <div className="space-y-3 mb-6">
          {topics.map((topic, i) => {
            const isCompleted = user.completedTopics.includes(topic.id);
            const score = user.topicScores[topic.id] || 0;

            return (
              <motion.div
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                className="relative overflow-hidden bg-white rounded-2xl shadow-md cursor-pointer active:scale-98"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${topic.bgGradient} opacity-10`} />
                <div className="relative flex items-center gap-4 p-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${topic.bgGradient} rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                    {topic.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-800 text-sm leading-tight">{topic.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{topic.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{topic.lessons.length} уроков</span>
                      {score > 0 && (
                        <span className="text-xs font-bold text-yellow-600">⭐ {score} очков</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    {isCompleted ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                    ) : (
                      <div className="text-gray-400 text-xl">›</div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mixed test */}
        <motion.div
          onClick={() => { setCurrentTopic('mixed'); setScreen('quiz'); }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-4 cursor-pointer shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎲</span>
            <div>
              <h3 className="font-black text-lg">Смешанный тест</h3>
              <p className="text-indigo-200 text-sm">Все темы вместе • До 200 XP</p>
            </div>
            <div className="ml-auto text-2xl">→</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
