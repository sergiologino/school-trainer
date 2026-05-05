import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from './store/useStore';
import AuthScreen from './components/AuthScreen';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import TasksScreen from './screens/TasksScreen';
import RatingScreen from './screens/RatingScreen';
import ProfileScreen from './screens/ProfileScreen';
import XPToast from './components/XPToast';

type Screen = 'home' | 'learn' | 'tasks' | 'rating' | 'profile';

const screenVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function App() {
  const { isAuthenticated, user, incrementStreak, taskResults } = useStore();
  const [screen, setScreen] = useState<Screen>('home');
  const [xpShow, setXpShow] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [prevResultsLength, setPrevResultsLength] = useState(0);

  useEffect(() => {
    if (user) {
      incrementStreak();
    }
  }, [user?.id]);

  // Watch for new task results and show XP toast
  useEffect(() => {
    if (taskResults.length > prevResultsLength && prevResultsLength > 0) {
      const last = taskResults[taskResults.length - 1];
      const earned = Math.floor((last.score / last.total) * 100);
      setXpAmount(earned);
      setXpShow(true);
    }
    setPrevResultsLength(taskResults.length);
  }, [taskResults.length]);

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onNavigate={(s) => setScreen(s as Screen)} />;
      case 'learn':
        return <LearnScreen />;
      case 'tasks':
        return <TasksScreen />;
      case 'rating':
        return <RatingScreen />;
      case 'profile':
        return <ProfileScreen onLogout={() => setScreen('home')} />;
      default:
        return <HomeScreen onNavigate={(s) => setScreen(s as Screen)} />;
    }
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen relative bg-gray-50 overflow-x-hidden">
      <XPToast amount={xpAmount} show={xpShow} onHide={() => setXpShow(false)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="overflow-x-clip overflow-y-visible"
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      <Navigation current={screen} onChange={(s) => setScreen(s as Screen)} />
    </div>
  );
}
