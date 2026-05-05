import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const levelColors = [
  'text-gray-500', 'text-green-500', 'text-blue-500', 'text-purple-500',
  'text-orange-500', 'text-red-500', 'text-yellow-500', 'text-pink-500',
  'text-indigo-500', 'text-emerald-500', 'text-cyan-500', 'text-rose-500',
];

export default function RatingScreen() {
  const { user, leaderboard } = useStore();
  const [tab, setTab] = useState<'global' | 'weekly'>('global');

  // Add current user to leaderboard if not there
  const fullBoard = user
    ? [
        ...leaderboard.filter((e) => e.id !== user.id),
        { id: user.id, name: user.name, avatar: user.avatar, xp: user.xp, level: user.level, streak: user.streak },
      ].sort((a, b) => b.xp - a.xp)
    : leaderboard;

  const userRank = user ? fullBoard.findIndex((e) => e.id === user.id) + 1 : -1;

  const weeklyBoard = [...fullBoard]
    .map((e) => ({ ...e, xp: Math.floor(e.xp * (0.1 + Math.random() * 0.3)) }))
    .sort((a, b) => b.xp - a.xp);

  const board = tab === 'global' ? fullBoard : weeklyBoard;



  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 pt-12 pb-6 px-4 rounded-b-[2rem]">
        <h1 className="text-white text-2xl font-black mb-3">🏆 Рейтинг</h1>

        {/* Tabs */}
        <div className="flex bg-white/20 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setTab('global')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'global' ? 'bg-white text-orange-600 shadow' : 'text-white'
            }`}
          >
            🌍 За всё время
          </button>
          <button
            onClick={() => setTab('weekly')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'weekly' ? 'bg-white text-orange-600 shadow' : 'text-white'
            }`}
          >
            📅 За неделю
          </button>
        </div>
      </div>

      {/* My rank banner */}
      {user && (
        <div className="px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 flex items-center gap-3 text-white shadow-lg"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-xl">
              {userRank}
            </div>
            <span className="text-3xl">{user.avatar}</span>
            <div className="flex-1">
              <div className="font-black">Ты на {userRank} месте!</div>
              <div className="text-white/70 text-sm">{user.xp} XP · Уровень {user.level}</div>
            </div>
            <div className="text-right">
              <div className="font-black text-yellow-300">🔥 {user.streak}</div>
              <div className="text-white/70 text-xs">дней</div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Top 3 podium */}
      <div className="px-4 mt-4 mb-2">
        <div className="flex items-end justify-center gap-3 h-36">
          {/* 2nd place */}
          {board[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center flex-1"
            >
              <span className="text-3xl mb-1">{board[1].avatar}</span>
              <div className="text-xs font-bold text-gray-700 text-center truncate w-full px-1">{board[1].name.split(' ')[0]}</div>
              <div className="text-lg font-black text-center">🥈</div>
              <div className="bg-gray-300 rounded-t-xl w-full h-20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white font-black text-sm">{board[1].xp}</div>
                  <div className="text-white/80 text-xs">XP</div>
                </div>
              </div>
            </motion.div>
          )}
          {/* 1st place */}
          {board[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center flex-1"
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-4xl mb-1"
              >
                {board[0].avatar}
              </motion.span>
              <div className="text-xs font-bold text-gray-700 text-center truncate w-full px-1">{board[0].name.split(' ')[0]}</div>
              <div className="text-2xl font-black text-center">🥇</div>
              <div className="bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-xl w-full h-28 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-white font-black">{board[0].xp}</div>
                  <div className="text-white/80 text-xs">XP</div>
                </div>
              </div>
            </motion.div>
          )}
          {/* 3rd place */}
          {board[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center flex-1"
            >
              <span className="text-3xl mb-1">{board[2].avatar}</span>
              <div className="text-xs font-bold text-gray-700 text-center truncate w-full px-1">{board[2].name.split(' ')[0]}</div>
              <div className="text-lg font-black text-center">🥉</div>
              <div className="bg-amber-700 rounded-t-xl w-full h-14 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white font-black text-sm">{board[2].xp}</div>
                  <div className="text-white/80 text-xs">XP</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Rest of leaderboard */}
      <div className="px-4 mt-2">
        <div className="space-y-2">
          {board.slice(3).map((entry, i) => {
            const rank = i + 4;
            const isMe = user && entry.id === user.id;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl p-3 flex items-center gap-3 ${
                  isMe
                    ? 'bg-indigo-50 border-2 border-indigo-300'
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                  isMe ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {rank}
                </div>
                <span className="text-2xl">{entry.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className={`font-black text-sm truncate ${isMe ? 'text-indigo-700' : 'text-gray-800'}`}>
                    {entry.name}{isMe ? ' (Ты)' : ''}
                  </div>
                  <div className="text-xs text-gray-500">Ур. {entry.level}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-black text-sm ${levelColors[Math.min(entry.level - 1, levelColors.length - 1)]}`}>
                    {entry.xp} XP
                  </div>
                  <div className="text-xs text-gray-400">🔥 {entry.streak}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
