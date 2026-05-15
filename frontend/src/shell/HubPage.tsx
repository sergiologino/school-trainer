import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUnifiedStore } from '@/store/useUnifiedStore';
import { buildCurrentUserEntry, buildGlobalLeaderboard, type GlobalLeaderboardEntry } from '@/leaderboard/globalLeaderboard';
import { fetchGlobalLeaderboard, submitSubjectScore } from '@/leaderboard/leaderboardApi';

export function HubPage() {
  const navigate = useNavigate();
  const { user, logout } = useUnifiedStore();
  const [remoteBoard, setRemoteBoard] = useState<GlobalLeaderboardEntry[] | null>(null);
  const globalBoard = remoteBoard ?? buildGlobalLeaderboard(user);
  const userRank = user ? globalBoard.findIndex((entry) => entry.id === user.id) + 1 : 0;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const local = buildCurrentUserEntry(user);

    Promise.all([
      submitSubjectScore({ userId: user.id, subject: 'math', name: user.name, avatar: user.avatar, score: local.mathScore }),
      submitSubjectScore({ userId: user.id, subject: 'russian', name: user.name, avatar: user.avatar, score: local.russianScore }),
      submitSubjectScore({ userId: user.id, subject: 'english', name: user.name, avatar: user.avatar, score: local.englishScore }),
    ])
      .then(() => fetchGlobalLeaderboard())
      .then((entries) => {
        if (cancelled) return;
        setRemoteBoard(entries.map((entry) => ({
          id: entry.id,
          name: entry.name,
          avatar: entry.avatar,
          totalScore: entry.totalScore,
          mathScore: entry.mathScore,
          russianScore: entry.russianScore,
          englishScore: entry.englishScore,
        })));
      })
      .catch(() => {
        if (!cancelled) setRemoteBoard(null);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const shareApp = async () => {
    const shareUrl = window.location.origin;
    const text = 'Присоединяйся к School Trainer: математика, русский и английский для школьников.';
    if (navigator.share) {
      await navigator.share({ title: 'School Trainer', text, url: shareUrl }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(`${text} ${shareUrl}`);
    alert('Ссылка на приложение скопирована');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-100 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8 bg-white rounded-3xl shadow p-5 border border-indigo-100">
          <div className="text-5xl">{user?.avatar}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">Привет,</p>
            <p className="font-black text-xl text-gray-900 truncate">{user?.name}</p>
            <p className="text-sm text-gray-600">{user?.grade} класс • School Trainer</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
            className="text-xs font-semibold bg-gray-100 text-gray-700 rounded-xl px-3 py-2"
          >
            Выйти
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mb-4">Выбери предмет</p>

        <div className="space-y-4">
          <SubjectCard to="/math" emoji="📐" title="Математика" desc="Уроки, тренажёры и тесты" gradient="from-amber-500 to-orange-500" />
          <SubjectCard to="/russian" emoji="📜" title="Русский язык" desc="Грамматика, тесты, диктанты" gradient="from-rose-500 to-red-500" />
          <SubjectCard to="/english" emoji="🇬🇧" title="Английский" desc="Слова, грамматика, диктант" gradient="from-violet-500 to-purple-600" />
        </div>

        <section className="mt-6 rounded-3xl border border-indigo-100 bg-white p-5 shadow">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">Общий рейтинг</h2>
              <p className="text-xs text-gray-500">Сумма очков по всем предметам</p>
            </div>
            {userRank > 0 && <div className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-black text-indigo-700">#{userRank}</div>}
          </div>

          <div className="space-y-2">
            {globalBoard.slice(0, 6).map((entry, index) => {
              const isMe = entry.id === user?.id;
              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3 ${
                    isMe ? 'border-indigo-300 bg-indigo-50' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="w-8 text-center text-sm font-black text-gray-500">#{index + 1}</div>
                  <div className="text-2xl">{entry.avatar}</div>
                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-sm font-black ${isMe ? 'text-indigo-700' : 'text-gray-800'}`}>
                      {entry.name}{isMe ? ' (ты)' : ''}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Мат {entry.mathScore} · Рус {entry.russianScore} · Англ {entry.englishScore}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-gray-900">{entry.totalScore}</div>
                    <div className="text-[10px] text-gray-400">очков</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          onClick={shareApp}
          className="mt-4 w-full rounded-2xl bg-slate-900 px-5 py-4 text-sm font-black text-white shadow"
        >
          Поделиться приложением
        </button>
      </div>
    </div>
  );
}

function SubjectCard({
  to,
  emoji,
  title,
  desc,
  gradient,
}: {
  to: string;
  emoji: string;
  title: string;
  desc: string;
  gradient: string;
}) {
  return (
    <NavLink to={to} className="block rounded-3xl shadow-lg hover:shadow-xl transition overflow-hidden bg-white border border-gray-100">
      <div className={`bg-gradient-to-r ${gradient} p-6 text-white flex items-center gap-4`}>
        <span className="text-4xl">{emoji}</span>
        <div>
          <div className="font-black text-lg">{title}</div>
          <div className="text-white/90 text-sm">{desc}</div>
        </div>
        <span className="ml-auto text-2xl opacity-75">›</span>
      </div>
    </NavLink>
  );
}
