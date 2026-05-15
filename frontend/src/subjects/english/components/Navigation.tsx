import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'home', emoji: '🏠', label: 'Главная' },
  { id: 'words', emoji: '📚', label: 'Учёба' },
  { id: 'grammar', emoji: '🎯', label: 'Задания' },
  { id: 'leaderboard', emoji: '🏆', label: 'Рейтинг' },
  { id: 'profile', emoji: '👤', label: 'Профиль' },
];

export default function Navigation() {
  const { currentSection, setCurrentSection } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-pb">
      <div className="flex justify-around items-center py-1 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setCurrentSection(item.id)}
            whileTap={{ scale: 0.85 }}
            className={`flex flex-col items-center py-2 px-2 rounded-xl transition-colors min-w-[52px] ${
              currentSection === item.id
                ? 'text-violet-600'
                : 'text-gray-400'
            }`}
          >
            <motion.span
              animate={currentSection === item.id ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl leading-none"
            >
              {item.emoji}
            </motion.span>
            <span className={`text-[10px] mt-0.5 font-medium leading-tight ${
              currentSection === item.id ? 'text-violet-600' : 'text-gray-400'
            }`}>
              {item.label}
            </span>
            {currentSection === item.id && (
              <motion.div
                layoutId="nav-dot"
                className="absolute bottom-1 w-1 h-1 bg-violet-600 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>
    </nav>
  );
}
