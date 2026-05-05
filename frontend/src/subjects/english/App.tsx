import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import Navigation from './components/Navigation';
import HomeSection from './sections/HomeSection';
import WordsSection from './sections/WordsSection';
import GrammarSection from './sections/GrammarSection';
import VerbsSection from './sections/VerbsSection';
import DictationSection from './sections/DictationSection';
import LeaderboardSection from './sections/LeaderboardSection';
import LoginSection from './sections/LoginSection';

const sectionMap: Record<string, React.ComponentType> = {
  home: HomeSection,
  words: WordsSection,
  grammar: GrammarSection,
  verbs: VerbsSection,
  dictation: DictationSection,
  leaderboard: LeaderboardSection,
};

export default function App() {
  const { currentSection, user } = useStore();

  useEffect(() => {
    // Request notification permission for streak reminders
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Show login if no user and on home
  if (!user && currentSection !== 'login') {
    const SectionComp = sectionMap[currentSection];
    if (!SectionComp || currentSection === 'home') {
      return <LoginSection />;
    }
  }

  if (currentSection === 'login' || (!user && currentSection === 'home')) {
    return <LoginSection />;
  }

  const SectionComp = sectionMap[currentSection] || HomeSection;

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          className="overflow-x-clip overflow-y-visible"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          <SectionComp />
        </motion.div>
      </AnimatePresence>
      <Navigation />
    </div>
  );
}
