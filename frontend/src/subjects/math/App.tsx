import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { LandingScreen } from './components/LandingScreen';
import { HomeScreen } from './components/HomeScreen';
import { TopicScreen } from './components/TopicScreen';
import { LessonScreen } from './components/LessonScreen';
import { QuizScreen } from './components/QuizScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ReferenceScreen } from './components/ReferenceScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNav } from './components/BottomNav';

import { TopicsProvider } from './context/TopicsContext';

function App() {
  const { currentScreen, isLoggedIn, updateLeaderboard } = useStore();

  useEffect(() => {
    if (isLoggedIn) {
      updateLeaderboard();
    }
  }, [isLoggedIn]);

  const renderScreen = () => {
    if (!isLoggedIn) return <LandingScreen />;

    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'topic': return <TopicScreen />;
      case 'lesson': return <LessonScreen />;
      case 'quiz': return <QuizScreen />;
      case 'leaderboard': return <LeaderboardScreen />;
      case 'reference': return <ReferenceScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <TopicsProvider>
      <div className="font-nunito bg-gray-50 min-h-screen max-w-md mx-auto relative overflow-x-hidden">
        {renderScreen()}
        {isLoggedIn && <BottomNav />}
      </div>
    </TopicsProvider>
  );
}

export default App;
