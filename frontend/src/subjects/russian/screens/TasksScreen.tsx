import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tasks as localTasks, dictants as localDictants } from '../data/tasks';
import type { Task, Dictant } from '../data/tasks';
import QuizGame from '../components/QuizGame';
import DictantGame from '../components/DictantGame';
import { getSyncedPackage } from '@/content/contentSync';

type Tab = 'tasks' | 'dictant';
type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';

const difficultyLabel = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' };


export default function TasksScreen() {
  const [tab, setTab] = useState<Tab>('tasks');
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>('all');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeDictant, setActiveDictant] = useState<Dictant | null>(null);
  const [tasks, setTasks] = useState<Task[]>(localTasks);
  const [dictants, setDictants] = useState<Dictant[]>(localDictants);

  useEffect(() => {
    getSyncedPackage<{ tasks: Task[]; dictants: Dictant[] }>('russian_grade5_core', {
      grade: 5,
      subject: 'russian',
      fallback: { tasks: localTasks, dictants: localDictants },
    })
      .then((d: { tasks: Task[]; dictants: Dictant[] }) => {
        if (Array.isArray(d.tasks) && d.tasks.length) setTasks(d.tasks);
        if (Array.isArray(d.dictants) && d.dictants.length) setDictants(d.dictants);
      })
      .catch(() => {});
  }, []);

  const filteredTasks = tasks.filter((t) => diffFilter === 'all' || t.difficulty === diffFilter);

  if (activeTask) {
    return <QuizGame task={activeTask} onFinish={() => setActiveTask(null)} />;
  }
  if (activeDictant) {
    return <DictantGame dictant={activeDictant} onFinish={() => setActiveDictant(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 pt-12 pb-6 px-4 rounded-b-[2rem]">
        <h1 className="text-white text-2xl font-black mb-4">🎯 Задания и тесты</h1>
        {/* Tabs */}
        <div className="flex bg-white/20 rounded-2xl p-1 gap-1">
          {(['tasks', 'dictant'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-white text-orange-600 shadow' : 'text-white'
              }`}
            >
              {t === 'tasks' ? '📝 Тесты' : '🎙️ Диктанты'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-4 mt-4"
          >
            {/* Difficulty filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {(['all', 'easy', 'medium', 'hard'] as DifficultyFilter[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
                    diffFilter === d
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  {d === 'all' ? '🌟 Все' : difficultyLabel[d]}
                </button>
              ))}
            </div>

            {/* Task cards */}
            <div className="space-y-3">
              {filteredTasks.map((task, i) => (
                <motion.button
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTask(task)}
                  className="w-full text-left"
                >
                  <div className={`bg-gradient-to-r ${task.color} rounded-2xl p-4 text-white shadow-lg`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{task.icon}</span>
                        <div>
                          <h3 className="font-black text-lg leading-tight">{task.title}</h3>
                          <p className="text-white/80 text-sm mt-0.5">{task.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-white/20`}>
                        {difficultyLabel[task.difficulty]}
                      </span>
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                        ⭐ {task.xpReward} XP
                      </span>
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                        {task.questions.length} вопросов
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'dictant' && (
          <motion.div
            key="dictant"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 mt-4"
          >
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-4">
              <p className="text-orange-800 text-sm font-semibold">
                📣 В диктанте тебе нужно внимательно прочитать предложение и ответить на вопросы по правописанию.
              </p>
            </div>
            <div className="space-y-3">
              {dictants.map((dictant, i) => (
                <motion.button
                  key={dictant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveDictant(dictant)}
                  className="w-full text-left"
                >
                  <div className={`bg-gradient-to-r ${dictant.color} rounded-2xl p-4 text-white shadow-lg`}>
                    <div className="flex items-start gap-3">
                      <span className="text-4xl">{dictant.icon}</span>
                      <div>
                        <h3 className="font-black text-xl leading-tight">{dictant.title}</h3>
                        <p className="text-white/80 text-sm mt-1">Тема: {dictant.topic}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-white/20`}>
                        {difficultyLabel[dictant.level]}
                      </span>
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                        ⭐ {dictant.xpReward} XP
                      </span>
                      <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                        {dictant.sentences.length} предложений
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
