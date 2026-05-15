import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { fetchSubjectLeaderboard, submitSubjectScore } from '@/leaderboard/leaderboardApi';

const LEVEL_NAMES = ['', 'Новичок', 'Ученик', 'Знаток', 'Мастер', 'Эксперт', 'Гений', 'Чемпион', 'Легенда', 'Суперзвезда', 'Математик'];

export const LeaderboardScreen: React.FC = () => {
  const { leaderboard, user } = useStore();
  const [remoteBoard, setRemoteBoard] = useState(leaderboard);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    submitSubjectScore({
      userId: user.id,
      subject: 'math',
      name: user.name,
      avatar: user.avatar,
      score: user.totalScore,
      level: user.level,
    })
      .then(() => fetchSubjectLeaderboard('math'))
      .then((entries) => {
        if (cancelled) return;
        setRemoteBoard(entries.map((entry) => ({
          id: entry.id,
          name: entry.name,
          avatar: entry.avatar,
          totalScore: entry.score,
          level: entry.level,
        })));
      })
      .catch(() => {
        if (!cancelled) setRemoteBoard(leaderboard);
      });
    return () => {
      cancelled = true;
    };
  }, [leaderboard, user]);

  const sorted = [...remoteBoard].sort((a, b) => b.totalScore - a.totalScore);
  const userRank = sorted.findIndex(e => e.id === user?.id) + 1;

  const medalColors = ['#f59e0b', '#9ca3af', '#b45309'];
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 pt-8 pb-8 rounded-b-3xl">
        <h1 className="text-2xl font-black text-center mb-1">🏆 Рейтинг</h1>
        <p className="text-white/80 text-sm text-center">Соревнуйся с другими учениками!</p>

        {user && userRank > 0 && (
          <motion.div
            className="mt-4 bg-white/20 rounded-2xl p-3 flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="font-black text-2xl text-white/80">#{userRank}</div>
            <div className="text-3xl">{user.avatar}</div>
            <div className="flex-1">
              <div className="font-black">Ты — {user.name}</div>
              <div className="text-white/70 text-xs">Уровень {user.level} • {LEVEL_NAMES[Math.min(user.level, 10)]}</div>
            </div>
            <div className="text-right">
              <div className="font-black text-xl">{user.totalScore}</div>
              <div className="text-white/70 text-xs">очков</div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-4 pt-4">
        {/* Top 3 podium */}
        {sorted.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-6 h-36">
            {[1, 0, 2].map((idx, pos) => {
              const entry = sorted[idx];
              const heights = [28, 36, 24];
              const h = heights[pos];
              return (
                <motion.div
                  key={entry.id}
                  className="flex-1 flex flex-col items-center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <div className="text-2xl mb-1">{entry.avatar}</div>
                  <div className="text-xs font-bold text-gray-700 mb-1 truncate w-full text-center">{entry.name.split(' ')[0]}</div>
                  <div className="text-lg">{medals[idx]}</div>
                  <div
                    className="w-full rounded-t-xl flex items-center justify-center font-black text-white text-sm"
                    style={{ height: h * 2, backgroundColor: medalColors[idx] }}
                  >
                    {entry.totalScore}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {sorted.map((entry, i) => {
            const isUser = entry.id === user?.id;
            const rank = i + 1;
            return (
              <motion.div
                key={entry.id}
                className={`flex items-center gap-3 rounded-2xl p-3 ${isUser ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-white border border-gray-100'} shadow-sm`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                  {rank <= 3 ? medals[rank - 1] : rank}
                </div>
                <div className="text-2xl">{entry.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className={`font-black truncate ${isUser ? 'text-indigo-700' : 'text-gray-800'}`}>
                    {entry.name} {isUser && '(ты)'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Уровень {entry.level} • {LEVEL_NAMES[Math.min(entry.level, 10)]}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-black ${isUser ? 'text-indigo-700' : 'text-gray-800'}`}>{entry.totalScore}</div>
                  <div className="text-xs text-gray-400">очков</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Share button */}
        {user && (
          <motion.button
            onClick={() => {
              const text = `🧮 МатемаТика: я на ${userRank} месте в рейтинге! ${user.totalScore} очков, уровень ${user.level}. Присоединяйся и учи математику вместе!`;
              if (navigator.share) {
                navigator.share({ title: 'МатемаТика — мой рейтинг', text }).catch(() => {});
              } else {
                navigator.clipboard.writeText(text).then(() => alert('Скопировано!')).catch(() => {});
              }
            }}
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📤 Поделиться своим местом
          </motion.button>
        )}
      </div>
    </div>
  );
};
