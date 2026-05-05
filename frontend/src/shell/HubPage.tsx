import { NavLink, useNavigate } from 'react-router-dom';
import { useUnifiedStore } from '@/store/useUnifiedStore';

export function HubPage() {
  const navigate = useNavigate();
  const { user, logout } = useUnifiedStore();

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
