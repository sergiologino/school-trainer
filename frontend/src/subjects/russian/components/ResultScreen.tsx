import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ResultScreenProps {
  score: number;
  total: number;
  xpEarned: number;
  title: string;
  onShare: () => void;
  onRetry: () => void;
  onBack: () => void;
}

const getGrade = (pct: number) => {
  if (pct >= 90) return { grade: '5', emoji: '🌟', label: 'Отлично!', color: 'text-green-600', bg: 'from-green-400 to-emerald-500' };
  if (pct >= 70) return { grade: '4', emoji: '😊', label: 'Хорошо!', color: 'text-blue-600', bg: 'from-blue-400 to-indigo-500' };
  if (pct >= 50) return { grade: '3', emoji: '😐', label: 'Неплохо', color: 'text-orange-600', bg: 'from-orange-400 to-amber-500' };
  return { grade: '2', emoji: '😔', label: 'Надо повторить', color: 'text-red-600', bg: 'from-red-400 to-rose-500' };
};

const tips = [
  'Продолжай учиться — каждый день делай хотя бы одно задание!',
  'Используй справочник правил для повторения!',
  'Поделись результатом с друзьями — пусть тоже учатся!',
  'Попробуй задание снова, чтобы улучшить результат!',
];

export default function ResultScreen({ score, total, xpEarned, title, onShare, onRetry, onBack }: ResultScreenProps) {
  const pct = Math.round((score / total) * 100);
  const { grade, emoji, label, bg } = getGrade(pct);
  const [confettiDone, setConfettiDone] = useState(false);
  const tip = tips[Math.floor(Math.random() * tips.length)];

  useEffect(() => {
    if (pct >= 70 && !confettiDone) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
      });
      setConfettiDone(true);
    }
  }, []);

  const shareText = `🎉 Я выполнил задание "${title}" на ${pct}% в приложении РусЯз! Мой результат: ${score}/${total}. Попробуй тоже! #РусЯз #РусскийЯзык`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Мой результат в РусЯз', text: shareText });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Текст скопирован в буфер обмена!');
      } catch {}
    }
    onShare();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-sm"
      >
        {/* Grade card */}
        <div className={`bg-gradient-to-br ${bg} rounded-3xl p-8 text-white text-center mb-4 shadow-2xl`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-7xl mb-2"
          >
            {emoji}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl font-black mb-1">{grade}</div>
            <div className="text-2xl font-black mb-1">{label}</div>
            <div className="text-white/80 text-lg">{score} из {total} верных</div>
            <div className="text-white/70 text-sm">{pct}% правильных ответов</div>
          </motion.div>
        </div>

        {/* XP earned */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <div className="font-black text-gray-800 text-lg">+{xpEarned} XP</div>
              <div className="text-gray-500 text-sm">Опыт получен!</div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-4xl"
          >
            🎁
          </motion.div>
        </motion.div>

        {/* Score breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-black text-green-500">{score}</div>
              <div className="text-xs text-gray-500 font-semibold">Верно ✅</div>
            </div>
            <div>
              <div className="text-2xl font-black text-red-500">{total - score}</div>
              <div className="text-xs text-gray-500 font-semibold">Ошибок ❌</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-500">{pct}%</div>
              <div className="text-xs text-gray-500 font-semibold">Точность</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${pct >= 70 ? 'bg-green-400' : pct >= 50 ? 'bg-orange-400' : 'bg-red-400'}`}
              />
            </div>
          </div>
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 mb-5 text-indigo-800 text-sm font-semibold text-center"
        >
          💡 {tip}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-3.5 font-black text-base shadow-lg flex items-center justify-center gap-2"
          >
            📤 Поделиться результатом
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onRetry}
              className="bg-white border-2 border-indigo-200 text-indigo-600 rounded-2xl py-3 font-black text-sm"
            >
              🔄 Ещё раз
            </button>
            <button
              onClick={onBack}
              className="bg-white border-2 border-gray-200 text-gray-600 rounded-2xl py-3 font-black text-sm"
            >
              ← Назад
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
