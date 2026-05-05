import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question, Task } from '../data/tasks';
import { useStore } from '../store/useStore';
import {
  mapOrder,
  mcqPracticeKey,
  orderIndicesByWeights,
  repeatWeight,
} from '../lib/russianAdaptive';
import ResultScreen from './ResultScreen';

interface QuizGameProps {
  task: Task;
  onFinish: () => void;
}

export default function QuizGame({ task, onFinish }: QuizGameProps) {
  const addTaskResult = useStore((s) => s.addTaskResult);
  const recordRussianPracticeOutcome = useStore((s) => s.recordRussianPracticeOutcome);

  const [sessionKey, setSessionKey] = useState(0);
  const orderedQuestions = useMemo(() => {
    const qs = task.questions;
    const stats = useStore.getState().russianPracticeStats;
    const weights = qs.map((q) => repeatWeight(stats[mcqPracticeKey(task.id, q.id)]));
    return mapOrder(qs, orderIndicesByWeights(weights));
  }, [task.id, sessionKey, task.questions]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);

  const question: Question | undefined = orderedQuestions[current];
  const isLast = current === orderedQuestions.length - 1;

  const answeredRef = useRef(false);
  useEffect(() => {
    answeredRef.current = selected !== null;
  }, [selected]);

  useEffect(() => {
    setTimeLeft(30);
    setSelected(null);
    setShowExplanation(false);
  }, [current, sessionKey]);

  useEffect(() => {
    if (!question || showResult) return;
    let sec = 30;
    setTimeLeft(30);
    answeredRef.current = false;
    const iv = window.setInterval(() => {
      if (answeredRef.current) {
        clearInterval(iv);
        return;
      }
      sec -= 1;
      setTimeLeft(sec);
      if (sec <= 0 && !answeredRef.current && question) {
        answeredRef.current = true;
        setSelected(-1);
        recordRussianPracticeOutcome(mcqPracticeKey(task.id, question.id), false);
        setAnswers((p) => [...p, false]);
        setShowExplanation(true);
        clearInterval(iv);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [question, showResult, recordRussianPracticeOutcome, task.id]);

  function handleSelect(idx: number) {
    if (!question) return;
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === question.correct;
    recordRussianPracticeOutcome(mcqPracticeKey(task.id, question.id), correct);
    setAnswers((prev) => [...prev, correct]);
    setShowExplanation(true);
  }

  function handleNext() {
    if (isLast) {
      const score = [...answers].filter(Boolean).length;
      addTaskResult({
        taskId: task.id,
        score,
        total: orderedQuestions.length,
        date: new Date().toISOString(),
        mode: task.mode,
      });
      setShowResult(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function restartSession() {
    setSessionKey((k) => k + 1);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setTimeLeft(30);
    setShowExplanation(false);
  }

  if (!question && !showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Нет вопросов в задании
      </div>
    );
  }

  if (showResult) {
    const score = answers.filter(Boolean).length;
    return (
      <ResultScreen
        score={score}
        total={orderedQuestions.length}
        xpEarned={Math.floor((score / orderedQuestions.length) * task.xpReward)}
        title={task.title}
        onShare={() => {}}
        onRetry={restartSession}
        onBack={onFinish}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-4 py-3 text-white text-xs text-center font-semibold opacity-95">
        Порядок вопросов подстраивается: то, что ты путаешь, попадается чаще; выученное — реже к началу списка.
      </div>
      <div className={`bg-gradient-to-r ${task.color} pt-10 pb-6 px-4`}>
        <div className="flex items-center justify-between mb-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onFinish}
            className="bg-white/20 text-white rounded-xl px-3 py-1.5 font-bold text-sm"
          >
            ← Назад
          </motion.button>
          <span className="text-white font-bold text-sm">
            {current + 1} / {orderedQuestions.length}
          </span>
          <div
            className={`rounded-xl px-3 py-1.5 font-black text-sm ${
              timeLeft <= 5 ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
            }`}
          >
            ⏱ {timeLeft}с
          </div>
        </div>

        <div className="bg-white/20 rounded-full h-2 mb-3">
          <motion.div
            animate={{ width: `${(current / orderedQuestions.length) * 100}%` }}
            className="h-full bg-white rounded-full"
            transition={{ duration: 0.3 }}
          />
        </div>

        {question.visual && (
          <motion.div
            key={current}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-5xl text-center my-2"
          >
            {question.visual}
          </motion.div>
        )}
      </div>

      <div className="px-4 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <h2 className="text-gray-800 font-black text-lg leading-snug">{question.question}</h2>
            </div>

            <div className="space-y-3 mb-4">
              {question.options.map((option, i) => {
                let btnStyle = 'bg-white border-2 border-gray-200 text-gray-800';
                if (selected !== null) {
                  if (i === question.correct) {
                    btnStyle = 'bg-green-500 border-2 border-green-500 text-white';
                  } else if (i === selected && selected !== question.correct) {
                    btnStyle = 'bg-red-500 border-2 border-red-500 text-white';
                  } else {
                    btnStyle = 'bg-gray-100 border-2 border-gray-100 text-gray-400';
                  }
                }
                return (
                  <motion.button
                    key={i}
                    whileTap={selected === null ? { scale: 0.97 } : {}}
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null}
                    className={`w-full text-left rounded-2xl px-4 py-3.5 font-bold text-base transition-all ${btnStyle} flex items-center gap-3`}
                  >
                    <span className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-sm font-black flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{option}</span>
                    {selected !== null && i === question.correct && (
                      <span className="ml-auto text-xl">✅</span>
                    )}
                    {selected !== null && i === selected && selected !== question.correct && (
                      <span className="ml-auto text-xl">❌</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-4 mb-4 ${
                    answers[answers.length - 1]
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p className="font-black mb-1">
                    {answers[answers.length - 1] ? '🎉 Правильно!' : '❌ Неверно!'}
                  </p>
                  <p className="text-sm text-gray-700">{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {selected !== null && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-4 font-black text-lg shadow-lg"
              >
                {isLast ? '📊 Посмотреть результат' : 'Следующий вопрос →'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
