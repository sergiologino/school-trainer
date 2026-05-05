import { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RussianApp from '@/subjects/russian/App';
import { useUnifiedStore } from '@/store/useUnifiedStore';
import { useStore as useRusStore } from '@/subjects/russian/store/useStore';

export function RussianPortal() {
  const user = useUnifiedStore((s) => s.user);
  const rusLogin = useRusStore((s) => s.login);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!user) return;
    rusLogin({
      id: user.id,
      name: user.name,
      email: user.email ?? '',
      avatar: user.avatar,
      level: 1,
      xp: 0,
      streak: 0,
      lastActivity: new Date().toDateString(),
      badges: [],
    });
    setReady(true);
  }, [user, rusLogin]);

  if (!user) return null;

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Загрузка…</div>;
  }

  return (
    <>
      <Link
        to="/app"
        className="fixed top-4 left-1/2 z-[200] flex -translate-x-1/2 items-center rounded-full bg-slate-900/90 px-4 py-2 text-[11px] font-bold tracking-wide text-white shadow-lg"
      >
        ← К предметам
      </Link>
      <RussianApp />
    </>
  );
}
