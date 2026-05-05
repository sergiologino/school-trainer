import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dictant } from '../data/tasks';
import { useStore } from '../store/useStore';
import {
  dictantSentenceKey,
  mapOrder,
  orderIndicesByWeights,
  repeatWeight,
} from '../lib/russianAdaptive';
import ResultScreen from './ResultScreen';

interface DictantGameProps {
  dictant: Dictant;
  onFinish: () => void;
}

interface SentenceQuestion {
  sentence: string;
  words: string[];
  blanks: { word: string; position: number; options: string[] }[];
  hint: string;
  sourceIndex: number;
}

function generateQuestions(sentences: { text: string; hint: string }[]): SentenceQuestion[] {
  return sentences.map((s, sourceIndex) => {
    const words = s.text.split(' ');
    const candidates = words
      .map((w, i) => ({ w: w.replace(/[.,!?]/g, ''), i }))
      .filter((x) => x.w.length > 3)
      .slice(0, 1);

    const blanks = candidates.map(({ w, i }) => {
      const wrongOptions = generateWrongOptions(w);
      const options = shuffle([w, ...wrongOptions.slice(0, 3)]);
      return { word: w, position: i, options };
    });

    return { sentence: s.text, words, blanks, hint: s.hint, sourceIndex };
  });
}

function generateWrongOptions(word: string): string[] {
  const vowels: Record<string, string[]> = {
    о: ['а', 'е'],
    а: ['о', 'е'],
    е: ['и', 'а'],
    и: ['е', 'ы'],
    ы: ['и', 'е'],
    ё: ['о', 'е'],
  };
  const variants: string[] = [];
  for (let i = 0; i < word.length; i++) {
    const ch = word[i].toLowerCase();
    if (vowels[ch]) {
      for (const v of vowels[ch]) {
        const variant =
          word.slice(0, i) +
          (word[i] === word[i].toUpperCase() ? v.toUpperCase() : v) +
          word.slice(i + 1);
        if (!variants.includes(variant) && variant !== word) {
          variants.push(variant);
        }
      }
    }
  }
  return variants.length >= 3
    ? variants
    : [word.slice(0, -1) + 'ь', word.charAt(0).toUpperCase() + word.slice(1), word + 'а'];
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function DictantGame({ dictant, onFinish }: DictantGameProps) {
  const addTaskResult = useStore((s) => s.addTaskResult);
  const recordRussianPracticeOutcome = useStore((s) => s.recordRussianPracticeOutcome);

  const [sessionKey, setSessionKey] = useState(0);
  const baseQuestions = useMemo(
    () => generateQuestions(dictant.sentences),
    [dictant.id, dictant.sentences]
  );

  const orderedQuestions = useMemo(() => {
    const stats = useStore.getState().russianPracticeStats;
    const weights = dictant.sentences.map((_, idx) =>
      repeatWeight(stats[dictantSentenceKey(dictant.id, idx)])
    );
    return mapOrder(baseQuestions, orderIndicesByWeights(weights));
  }, [baseQuestions, dictant.id, dictant.sentences, sessionKey]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const q = orderedQuestions[current];
  const isLast = current === orderedQuestions.length - 1;

  const handleSelect = (option: string) => {
    if (!q) return;
    if (selected !== null) return;
    setSelected(option);
    const correct = q.blanks.length === 0 || q.blanks[0].word.toLowerCase() === option.toLowerCase();
    recordRussianPracticeOutcome(dictantSentenceKey(dictant.id, q.sourceIndex), correct);
    setAnswers((prev) => [...prev, correct]);
  };

  const handleNext = () => {
    if (isLast) {
      const score = [...answers].filter(Boolean).length;
      addTaskResult({
        taskId: dictant.id,
        score,
        total: orderedQuestions.length,
        date: new Date().toISOString(),
        mode: 'dictant',
      });
      setShowResult(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowHint(false);
    }
  };

  const restartSession = () => {
    setSessionKey((k) => k + 1);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowHint(false);
    setShowResult(false);
  };

  if (!q && !showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Нет предложений
      </div>
    );
  }

  if (showResult) {
    const score = answers.filter(Boolean).length;
    return (
      <ResultScreen
        score={score}
        total={orderedQuestions.length}
        xpEarned={Math.floor((score / orderedQuestions.length) * dictant.xpReward)}
        title={dictant.title}
        onShare={() => {}}
        onRetry={restartSession}
        onBack={onFinish}
      />
    );
  }

  const blank = q.blanks[0];

  const renderSentence = () => {
    if (!blank) return <span>{q.sentence}</span>;
    const words = q.sentence.split(' ');
    return words.map((w, i) => {
      const cleanW = w.replace(/[.,!?]/g, '');
      if (i === blank.position) {
        const punct = w.slice(cleanW.length);
        return (
          <span key={i}>
            {' '}
            <span
              className={`inline-block px-2 py-0.5 rounded-lg border-b-2 border-dashed font-black ${
                selected === null
                  ? 'border-indigo-400 text-indigo-600 bg-indigo-50'
                  : selected.toLowerCase() === blank.word.toLowerCase()
                    ? 'border-green-400 text-green-700 bg-green-50'
                    : 'border-red-400 text-red-700 bg-red-50'
              }`}
            >
              {selected !== null ? selected : '___'}
            </span>
            {punct}
          </span>
        );
      }
      return <span key={i}> {w}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-teal-50 border-b border-teal-200 px-3 py-2 text-center text-xs font-semibold text-teal-900">
        Сложные предложения в диктанте появятся раньше в этом проходе; выученные — ближе к концу.
      </div>
      <div className={`bg-gradient-to-r ${dictant.color} pt-10 pb-6 px-4`}>
        <div className="flex items-center justify-between mb-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onFinish}
            className="bg-white/20 text-white rounded-xl px-3 py-1.5 font-bold text-sm"
          >
            ← Назад
          </motion.button>
          <span className="text-white font-bold text-sm">
            Предложение {current + 1} / {orderedQuestions.length}
          </span>
          <div className="text-white font-bold text-sm">{dictant.icon}</div>
        </div>

        <div className="bg-white/20 rounded-full h-2">
          <motion.div
            animate={{ width: `${(current / orderedQuestions.length) * 100}%` }}
            className="h-full bg-white rounded-full"
          />
        </div>

        <h2 className="text-white font-black text-lg mt-3">{dictant.title}</h2>
      </div>

      <div className="px-4 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="bg-indigo-50 rounded-2xl p-3 mb-4 border border-indigo-200">
              <p className="text-indigo-700 font-bold text-sm">
                Выбери правильное слово для вставки в предложение:
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
              <p className="text-gray-800 font-bold text-lg leading-relaxed">{renderSentence()}</p>
            </div>

            {blank && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {blank.options.map((option, i) => {
                  let style = 'bg-white border-2 border-gray-200 text-gray-800';
                  if (selected !== null) {
                    if (option.toLowerCase() === blank.word.toLowerCase()) {
                      style = 'bg-green-500 border-2 border-green-500 text-white';
                    } else if (option === selected && option.toLowerCase() !== blank.word.toLowerCase()) {
                      style = 'bg-red-500 border-2 border-red-500 text-white';
                    } else {
                      style = 'bg-gray-100 border-2 border-gray-100 text-gray-400';
                    }
                  }
                  return (
                    <motion.button
                      key={i}
                      whileTap={selected === null ? { scale: 0.95 } : {}}
                      onClick={() => handleSelect(option)}
                      disabled={selected !== null}
                      className={`rounded-2xl py-3.5 px-4 font-black text-center transition-all ${style}`}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="w-full text-center text-indigo-500 font-bold text-sm py-2 mb-3"
            >
              {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
            </button>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4 overflow-hidden"
                >
                  <p className="text-amber-800 font-semibold text-sm">Подсказка: {q.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selected !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-4 mb-4 ${
                    answers[answers.length - 1]
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p className="font-black mb-1 text-gray-800">
                    {answers[answers.length - 1] ? 'Правильно!' : 'Неверно!'}
                  </p>
                  <p className="text-sm text-gray-700">{q.hint}</p>
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
                {isLast ? 'Посмотреть результат' : 'Следующее'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
