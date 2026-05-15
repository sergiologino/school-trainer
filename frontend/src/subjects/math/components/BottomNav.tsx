import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const NAV_ITEMS = [
  { id: 'home', emoji: '🏠', label: 'Главная' },
  { id: 'reference', emoji: '📚', label: 'Учёба' },
  { id: 'practice', emoji: '🎯', label: 'Задания' },
  { id: 'leaderboard', emoji: '🏆', label: 'Рейтинг' },
  { id: 'profile', emoji: '👤', label: 'Профиль' },
];

export const BottomNav: React.FC = () => {
  const { currentScreen, setScreen, setCurrentTopic } = useStore();

  const mainScreens = ['home', 'leaderboard', 'reference', 'profile', 'quiz'];
  if (!mainScreens.includes(currentScreen)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 safe-area-pb">
      <div className="flex justify-around max-w-md mx-auto">
        {NAV_ITEMS.map(item => {
          const isActive = currentScreen === item.id || (item.id === 'practice' && currentScreen === 'quiz');
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'practice') {
                  setCurrentTopic('mixed');
                  setScreen('quiz');
                  return;
                }
                setScreen(item.id);
              }}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all"
            >
              <motion.div
                className={`text-2xl transition-all ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`}
                animate={isActive ? { y: [-2, 0] } : {}}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item.emoji}
              </motion.div>
              <span className={`text-xs font-bold transition-all ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="w-1 h-1 bg-indigo-600 rounded-full"
                  layoutId="navDot"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
