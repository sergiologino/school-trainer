import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ALL_ACHIEVEMENTS_LIST } from '../store/useStore';
import { buildEnglishLeaderboard } from '../leaderboard';
import { fetchSubjectLeaderboard, submitSubjectScore } from '@/leaderboard/leaderboardApi';

function ShareCard({ name, xp, streak, wordsLearned, achievements }: {
  name: string; xp: number; streak: number; wordsLearned: number; achievements: number;
}) {
  const handleShare = async () => {
    const text = `🏆 Мои успехи в изучении английского!\n⚡ ${xp} XP | 🔥 ${streak} дней серия | 📚 ${wordsLearned} слов\n🏅 ${achievements} достижений\n\nПрисоединяйся и учи английский вместе! 🦉`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Мои успехи в English Pro', text });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      alert('Результат скопирован в буфер обмена!');
    }
  };

  return (
    <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-5 text-white mb-5 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🦅</div>
        <div>
          <h3 className="font-extrabold text-lg">{name}</h3>
          <p className="text-violet-200 text-sm">English Pro</p>
        </div>
        <div className="ml-auto text-2xl">🏆</div>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'XP', value: xp, emoji: '⚡' },
          { label: 'Серия', value: `${streak}д`, emoji: '🔥' },
          { label: 'Слов', value: wordsLearned, emoji: '📚' },
          { label: 'Наград', value: achievements, emoji: '🏅' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/15 rounded-xl p-2 text-center">
            <div className="text-lg">{stat.emoji}</div>
            <div className="font-extrabold text-sm">{stat.value}</div>
            <div className="text-violet-300 text-[10px]">{stat.label}</div>
          </div>
        ))}
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleShare}
        className="w-full bg-white text-violet-700 font-bold py-3 rounded-2xl shadow text-sm"
      >
        📤 Поделиться результатом
      </motion.button>
    </div>
  );
}

export default function LeaderboardSection() {
  const { leaderboard, user, stats, setCurrentSection } = useStore();
  const [filter, setFilter] = useState<'all' | 4 | 5 | 6>('all');
  const [remoteBoard, setRemoteBoard] = useState<typeof leaderboard | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    submitSubjectScore({
      userId: user.id,
      subject: 'english',
      name: user.name,
      avatar: user.avatar,
      score: stats.totalXP,
      level: Math.floor(stats.totalXP / 100) + 1,
      streak: stats.streakDays,
    })
      .then(() => fetchSubjectLeaderboard('english'))
      .then((entries) => {
        if (cancelled) return;
        setRemoteBoard(entries.map((entry) => ({
          id: entry.id,
          name: entry.name,
          avatar: entry.avatar,
          xp: entry.score,
          grade: user.grade,
          streak: entry.streak,
        })));
      })
      .catch(() => {
        if (!cancelled) setRemoteBoard(null);
      });
    return () => {
      cancelled = true;
    };
  }, [stats.streakDays, stats.totalXP, user]);

  const fullBoard = remoteBoard ?? buildEnglishLeaderboard(leaderboard, user, stats);

  const filtered = filter === 'all'
    ? fullBoard
    : fullBoard.filter(e => e.grade === filter);

  const sorted = [...filtered].sort((a, b) => b.xp - a.xp);
  const userRank = sorted.findIndex(e => e.id === user?.id) + 1;

  const getMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-4">🏆 Рейтинг</h1>

      {user && (
        <ShareCard
          name={user.name}
          xp={stats.totalXP}
          streak={stats.streakDays}
          wordsLearned={stats.wordsLearned}
          achievements={stats.achievements.length}
        />
      )}

      {!user && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-4 text-center">
          <p className="text-violet-800 font-semibold text-sm">Войди в аккаунт чтобы попасть в рейтинг!</p>
          <button
            onClick={() => setCurrentSection('login')}
            className="mt-2 bg-violet-600 text-white px-5 py-2 rounded-xl font-bold text-sm"
          >
            Войти
          </button>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[{ val: 'all' as const, label: 'Все' }, { val: 4 as const, label: '4 кл.' }, { val: 5 as const, label: '5 кл.' }, { val: 6 as const, label: '6 кл.' }].map(f => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
              filter === f.val ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* User position */}
      {user && userRank > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 flex items-center gap-3">
          <span className="text-2xl font-extrabold text-amber-600">{getMedal(userRank)}</span>
          <div>
            <p className="text-amber-800 font-bold text-sm">Твоя позиция</p>
            <p className="text-amber-600 text-xs">{userRank} место из {sorted.length}</p>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-2">
        {sorted.map((entry, i) => {
          const rank = i + 1;
          const isMe = entry.id === user?.id;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                isMe
                  ? 'bg-violet-50 border-violet-400'
                  : rank <= 3
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-white border-gray-100'
              }`}
            >
              <div className="w-8 text-center font-extrabold text-sm">
                {rank <= 3 ? <span className="text-xl">{getMedal(rank)}</span> : <span className="text-gray-500">#{rank}</span>}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-blue-100 rounded-xl flex items-center justify-center text-xl">
                {entry.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className={`font-bold text-sm ${isMe ? 'text-violet-700' : 'text-gray-800'}`}>
                    {entry.name}
                  </span>
                  {isMe && <span className="text-xs text-violet-500 font-semibold">(ты)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{entry.grade} класс</span>
                  <span className="text-xs text-orange-500">🔥 {entry.streak}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-violet-600 text-sm">⚡ {entry.xp}</p>
                <p className="text-xs text-gray-400">XP</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">🏅 Все достижения</h2>
        <div className="grid grid-cols-2 gap-3">
          {ALL_ACHIEVEMENTS_LIST.map(ach => {
            const unlocked = stats.achievements.find(a => a.id === ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-2xl p-3 flex items-center gap-3 border-2 transition-all ${
                  unlocked ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              >
                <span className="text-2xl">{ach.emoji}</span>
                <div>
                  <p className={`text-xs font-bold ${unlocked ? 'text-amber-800' : 'text-gray-500'}`}>{ach.titleRu}</p>
                  {unlocked && <p className="text-[10px] text-amber-600">Получено!</p>}
                  {!unlocked && <p className="text-[10px] text-gray-400">{ach.requirement}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
