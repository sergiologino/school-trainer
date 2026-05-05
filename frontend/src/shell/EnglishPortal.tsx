import { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EnglishApp from '@/subjects/english/App';
import { useUnifiedStore } from '@/store/useUnifiedStore';
import { useStore as useEnglishStore } from '@/subjects/english/store/useStore';

export function EnglishPortal() {
  const user = useUnifiedStore((s) => s.user);
  const setUser = useEnglishStore((s) => s.setUser);
  const setSection = useEnglishStore((s) => s.setCurrentSection);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!user) return;
    setUser({
      id: user.id,
      name: user.name,
      email: user.email ?? '',
      avatar: user.avatar,
      grade: user.grade,
    });
    setSection('home');
    setReady(true);
  }, [user, setUser, setSection]);

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
      <EnglishApp />
    </>
  );
}
