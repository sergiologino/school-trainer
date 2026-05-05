import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { MultiplicationLesson } from './lessons/MultiplicationLesson';
import { FractionsAddSubLesson } from './lessons/FractionsAddSubLesson';
import { FractionsMulDivLesson } from './lessons/FractionsMulDivLesson';
import { DecimalsLesson } from './lessons/DecimalsLesson';
import { Grade5ExtrasLesson } from './lessons/Grade5ExtrasLesson';
import { useTopics } from '../context/TopicsContext';

const LESSON_TOPIC_MAP: Record<string, string> = {
  'mult-theory': 'multiplication',
  'mult-table': 'multiplication',
  'frac-intro': 'fractions-add-sub',
  'frac-same': 'fractions-add-sub',
  'frac-diff': 'fractions-add-sub',
  'frac-mul-theory': 'fractions-mul-div',
  'frac-div-theory': 'fractions-mul-div',
  'dec-intro': 'decimals-intro',
  'dec-convert': 'decimals-intro',
  'decas-theory': 'decimals-add-sub',
  'decmd-mul': 'decimals-mul-div',
  'decmd-div': 'decimals-mul-div',
  'pct-theory': 'percent-intro',
  'pct-convert': 'percent-intro',
  'pct-practice': 'percent-intro',
  'pct-test': 'percent-intro',
  'ap-theory': 'area-perimeter',
  'ap-practice': 'area-perimeter',
  'ap-test': 'area-perimeter',
  'mean-theory': 'mean-intro',
  'mean-practice': 'mean-intro',
  'mean-test': 'mean-intro',
};

export const LessonScreen: React.FC = () => {
  const { topics } = useTopics();
  const { currentLesson, currentTopic, setScreen, addXP, markTopicComplete } = useStore();
  const topicId = currentTopic || (currentLesson ? LESSON_TOPIC_MAP[currentLesson] : null);
  const topic = topics.find((t) => t.id === topicId);
  const lesson = topic?.lessons.find(l => l.id === currentLesson);

  if (!lesson || !topic) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <p className="font-bold text-gray-600">Урок не найден</p>
        <button onClick={() => setScreen('home')} className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-xl">На главную</button>
      </div>
    </div>
  );

  const handleComplete = () => {
    addXP(lesson.xpReward);
    markTopicComplete(lesson.id);
    setScreen('topic');
  };

  const renderLesson = () => {
    const props = { lessonId: lesson.id, onComplete: handleComplete };
    if (topicId === 'percent-intro' || topicId === 'area-perimeter' || topicId === 'mean-intro') {
      return <Grade5ExtrasLesson lessonId={lesson.id} topicId={topicId} onComplete={handleComplete} />;
    }
    if (topicId === 'multiplication') return <MultiplicationLesson {...props} />;
    if (topicId === 'fractions-add-sub') return <FractionsAddSubLesson {...props} />;
    if (topicId === 'fractions-mul-div') return <FractionsMulDivLesson {...props} />;
    if (topicId?.startsWith('decimal')) return <DecimalsLesson {...props} />;
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚧</div>
        <p className="text-gray-600">Урок в разработке!</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${topic.bgGradient} text-white px-4 pt-6 pb-6`}>
        <button
          onClick={() => setScreen('topic')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-3 transition-colors text-sm"
        >
          ← {topic.title}
        </button>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{lesson.emoji}</div>
          <div>
            <h1 className="font-black text-lg leading-tight">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white/90 text-xs px-2 py-0.5 rounded-full">+{lesson.xpReward} XP за урок</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {renderLesson()}
        </motion.div>
      </div>
    </div>
  );
};
