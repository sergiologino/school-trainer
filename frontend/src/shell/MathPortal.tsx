import { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MathApp from '@/subjects/math/App';
import { useUnifiedStore } from '@/store/useUnifiedStore';
import { useStore as useMathStore } from '@/subjects/math/store/useStore';

export function MathPortal() {
  const user = useUnifiedStore((s) => s.user);
  const login = useMathStore((s) => s.login);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!user) return;
    login({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
    setReady(true);
  }, [user, login]);

  if (!user) return null;

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Подготовка…</div>;
  }

  return (
    <>
      <Link
        to="/app"
        className="fixed top-4 left-1/2 z-[200] flex -translate-x-1/2 items-center rounded-full bg-slate-900/90 px-4 py-2 text-[11px] font-bold tracking-wide text-white shadow-lg"
      >
        ← К предметам
      </Link>
      <MathApp />
    </>
  );
}
