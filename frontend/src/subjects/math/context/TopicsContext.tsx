import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Topic } from '../data/topics';
import { TOPICS as FALLBACK_TOPICS } from '../data/topics';
import { getSyncedPackage } from '@/content/contentSync';

const TopicsContext = createContext<{
  topics: Topic[];
  loading: boolean;
  refreshed: boolean;
}>({ topics: FALLBACK_TOPICS, loading: true, refreshed: false });

export function TopicsProvider({ children }: { children: ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>(FALLBACK_TOPICS);
  const [loading, setLoading] = useState(true);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    getSyncedPackage<{ topics: Topic[] }>('math_grade5_curriculum', {
      grade: 5,
      subject: 'math',
      fallback: { topics: FALLBACK_TOPICS },
    })
      .then((data) => {
        if (Array.isArray(data.topics) && data.topics.length > 0) {
          setTopics(data.topics);
          setRefreshed(true);
        }
      })
      .catch(() => {
        /* офлайн или бэкенд не запущен — остаётся FALLBACK_TOPICS */
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ topics, loading, refreshed }), [topics, loading, refreshed]);
  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
}

export function useTopics() {
  return useContext(TopicsContext);
}
