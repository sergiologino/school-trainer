import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStore } from '../store/useStore';
import { useTopics } from '../context/TopicsContext';
import { getQuestionsForTopic } from '../data/questions';
import type { Question } from '../data/questions';

const QUIZ_LENGTH = 10;

export const QuizScreen: React.FC = () => {
  const { currentTopic, setScreen, addScore, addXP, markTopicComplete, user } = useStore();
  const { topics } = useTopics();
  const topic = currentTopic === 'mixed' ? null : topics.find((t) => t.id === currentTopic);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const qs = getQuestionsForTopic(currentTopic || 'mixed');
    const shuffled = qs.sort(() => Math.random() - 0.5).slice(0, QUIZ_LENGTH);
    setQuestions(shuffled);
  }, [currentTopic]);

  useEffect(() => {
    if (!timerActive || finished || selectedAnswer) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, finished, selectedAnswer]);

  const handleAnswer = useCallback((answer: string | null) => {
    if (selectedAnswer !== null) return;
    setTimerActive(false);
    setSelectedAnswer(answer || '');
    const q = questions[currentIdx];
    const correct = answer === q?.answer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      const timeBonus = Math.floor(timeLeft / 10);
      const points = 10 + timeBonus;
      setScore(s => s + points);
      setStreak(s => {
        const ns = s + 1;
        setMaxStreak(ms => Math.max(ms, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  }, [questions, currentIdx, selectedAnswer, timeLeft]);

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      // Finish
      const finalScore = score;
      if (currentTopic) {
        addScore(currentTopic, finalScore);
        const xp = Math.floor(finalScore * 1.5);
        addXP(xp);
        markTopicComplete(currentTopic);
      }
      if (finalScore >= 70) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      setTimeLeft(30);
      setTimerActive(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚙️</div>
          <p className="text-gray-600">Подготавливаем вопросы...</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / (QUIZ_LENGTH * 10)) * 100);
    const stars = score >= 90 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
        >
          <motion.div
            className="text-6xl mb-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {stars === 3 ? '🏆' : stars === 2 ? '🥈' : stars === 1 ? '🥉' : '📚'}
          </motion.div>

          <h2 className="font-black text-2xl text-gray-800 mb-1">
            {stars === 3 ? 'Отлично!' : stars === 2 ? 'Хорошо!' : stars === 1 ? 'Неплохо!' : 'Попробуй ещё!'}
          </h2>

          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className={`text-4xl ${i < stars ? '' : 'opacity-20'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
              >
                ⭐
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-indigo-50 rounded-xl p-3">
              <div className="text-3xl font-black text-indigo-700">{score}</div>
              <div className="text-xs text-gray-500">Очков заработано</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="text-3xl font-black text-green-700">{percentage}%</div>
              <div className="text-xs text-gray-500">Правильных ответов</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <div className="text-3xl font-black text-orange-700">{maxStreak}</div>
              <div className="text-xs text-gray-500">Серия правильных</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="text-3xl font-black text-purple-700">+{Math.floor(score * 1.5)}</div>
              <div className="text-xs text-gray-500">XP получено</div>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={() => {
              const text = `🧮 МатемаТика: набрал ${score} очков (${percentage}%) по теме "${topic?.title || 'Смешанный тест'}"! ${stars === 3 ? '🏆🏆🏆' : stars === 2 ? '⭐⭐' : '⭐'} Уровень ${user?.level}. Учись математике со мной!`;
              if (navigator.share) {
                navigator.share({ title: 'МатемаТика', text }).catch(() => {});
              } else {
                navigator.clipboard.writeText(text).then(() => alert('Результат скопирован!')).catch(() => {});
              }
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 rounded-2xl mb-3"
          >
            📤 Поделиться результатом
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setCurrentIdx(0);
                setScore(0);
                setStreak(0);
                setMaxStreak(0);
                setFinished(false);
                setSelectedAnswer(null);
                setIsCorrect(null);
                setShowExplanation(false);
                setTimeLeft(30);
                setTimerActive(true);
                const qs = getQuestionsForTopic(currentTopic || 'mixed');
                setQuestions(qs.sort(() => Math.random() - 0.5).slice(0, QUIZ_LENGTH));
              }}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl"
            >
              🔄 Ещё раз
            </button>
            <button
              onClick={() => setScreen(currentTopic === 'mixed' ? 'home' : 'topic')}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-2xl"
            >
              ✅ Готово
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentIdx];
  const gradient = topic?.bgGradient || 'from-indigo-600 to-purple-600';
  const timerPercent = (timeLeft / 30) * 100;
  const timerColor = timeLeft > 15 ? '#10b981' : timeLeft > 7 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} text-white px-4 pt-6 pb-8`}>
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => setScreen(currentTopic === 'mixed' ? 'home' : 'topic')}
            className="text-white/80 hover:text-white text-sm"
          >
            ← Выйти
          </button>
          <div className="flex items-center gap-2">
            {streak > 1 && (
              <motion.div
                className="bg-white/20 rounded-full px-2 py-0.5 text-sm font-bold flex items-center gap-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
              >
                🔥 {streak}
              </motion.div>
            )}
            <div className="bg-white/20 rounded-full px-2 py-0.5 text-sm font-bold">
              ⭐ {score}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-3">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${i < currentIdx ? 'bg-white' : i === currentIdx ? 'bg-white/60' : 'bg-white/20'}`}
            />
          ))}
        </div>
        <div className="text-white/70 text-xs">Вопрос {currentIdx + 1} из {questions.length}</div>

        {/* Timer */}
        <div className="mt-2 bg-white/20 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full transition-all"
            style={{ width: `${timerPercent}%`, backgroundColor: timerColor }}
            animate={{ width: `${timerPercent}%` }}
          />
        </div>
        <div className="text-right text-white/70 text-xs mt-1">{timeLeft}с</div>
      </div>

      <div className="px-4 -mt-4">
        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            className="bg-white rounded-2xl shadow-lg p-5 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <div className="text-2xl font-black text-gray-800 text-center py-4">
              {question.question}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {question.options.map((option, i) => {
            const isSelected = selectedAnswer === option;
            const isAnswer = option === question.answer;
            let bgClass = 'bg-white border-2 border-gray-200 text-gray-800';

            if (selectedAnswer !== null) {
              if (isAnswer) bgClass = 'bg-green-100 border-2 border-green-500 text-green-800';
              else if (isSelected) bgClass = 'bg-red-100 border-2 border-red-500 text-red-800';
              else bgClass = 'bg-gray-100 border-2 border-gray-200 text-gray-400';
            }

            return (
              <motion.button
                key={option}
                onClick={() => selectedAnswer === null && handleAnswer(option)}
                className={`${bgClass} rounded-2xl p-4 font-black text-xl text-center shadow-sm transition-all`}
                whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {isSelected && isCorrect && '✅ '}
                {isSelected && !isCorrect && '❌ '}
                {!isSelected && selectedAnswer !== null && isAnswer && '✅ '}
                {option}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              className={`rounded-2xl p-4 mb-4 ${isCorrect ? 'bg-green-50 border border-green-300' : 'bg-red-50 border border-red-300'}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl">{isCorrect ? '✅' : '💡'}</span>
                <div>
                  <p className={`font-black text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? `Правильно! +${10 + Math.floor(timeLeft / 10)} очков` : 'Неправильно, но учиться — это нормально!'}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">{question.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showExplanation && (
          <motion.button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black py-4 rounded-2xl text-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {currentIdx + 1 >= questions.length ? '🏁 Завершить тест' : 'Следующий вопрос →'}
          </motion.button>
        )}
      </div>
    </div>
  );
};
