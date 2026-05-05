import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useTopics } from '../context/TopicsContext';

export const TopicScreen: React.FC = () => {
  const { currentTopic, setScreen, setCurrentLesson, user } = useStore();
  const { topics } = useTopics();
  const topic = topics.find((t) => t.id === currentTopic);

  if (!topic) return null;

  const handleLesson = (lessonId: string, type: string) => {
    setCurrentLesson(lessonId);
    if (type === 'theory') {
      setScreen('lesson');
    } else {
      setScreen('quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${topic.bgGradient} text-white px-4 pt-6 pb-10 rounded-b-3xl`}>
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
        >
          ← Назад
        </button>
        <motion.div
          className="text-6xl mb-3 text-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {topic.emoji}
        </motion.div>
        <h1 className="text-2xl font-black text-center mb-2">{topic.title}</h1>
        <p className="text-white/80 text-center text-sm">{topic.description}</p>
      </div>

      <div className="px-4 -mt-6">
        {/* Lessons */}
        <div className="space-y-3">
          {topic.lessons.map((lesson, i) => {
            const isCompleted = user?.completedTopics.includes(lesson.id);
            const typeColors: Record<string, string> = {
              theory: 'from-blue-50 to-indigo-50 border-blue-200',
              practice: 'from-green-50 to-emerald-50 border-green-200',
              test: 'from-yellow-50 to-orange-50 border-yellow-200',
            };
            const typeLabels: Record<string, string> = {
              theory: '📖 Теория',
              practice: '🎯 Практика',
              test: '🏆 Тест',
            };

            return (
              <motion.div
                key={lesson.id}
                onClick={() => handleLesson(lesson.id, lesson.type)}
                className={`bg-gradient-to-r ${typeColors[lesson.type]} border rounded-2xl p-4 cursor-pointer shadow-sm`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                    {lesson.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500 mb-0.5">{typeLabels[lesson.type]}</div>
                    <h3 className="font-black text-gray-800 text-sm leading-tight">{lesson.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-indigo-600 font-semibold">+{lesson.xpReward} XP</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                    ) : (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">›</div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick quiz button */}
        <motion.div
          onClick={() => { setCurrentLesson(null); setScreen('quiz'); }}
          className={`mt-4 bg-gradient-to-r ${topic.bgGradient} text-white rounded-2xl p-4 cursor-pointer shadow-lg`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h3 className="font-black">Тест по теме</h3>
              <p className="text-white/80 text-sm">Проверь все знания • До 100 XP</p>
            </div>
            <div className="ml-auto">→</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
