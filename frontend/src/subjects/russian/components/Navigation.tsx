import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Главная', icon: '🏠' },
  { id: 'learn', label: 'Учёба', icon: '📚' },
  { id: 'tasks', label: 'Задания', icon: '🎯' },
  { id: 'rating', label: 'Рейтинг', icon: '🏆' },
  { id: 'profile', label: 'Профиль', icon: '👤' },
];

interface NavigationProps {
  current: string;
  onChange: (id: string) => void;
}

export default function Navigation({ current, onChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-2xl">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = current === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.85 }}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center gap-0.5 relative px-2 py-1 rounded-2xl min-w-[52px]"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-indigo-100 rounded-2xl"
                />
              )}
              <span
                className="relative text-xl"
                style={{ filter: isActive ? 'none' : 'grayscale(50%)' }}
              >
                {item.icon}
              </span>
              <span
                className={`relative text-[10px] font-bold transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
