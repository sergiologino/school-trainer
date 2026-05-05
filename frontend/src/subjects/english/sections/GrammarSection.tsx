import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TENSES, PREPOSITIONS, ARTICLE_RULES } from '../data/grammar';
import type { Tense, Preposition, ArticleRule } from '../data/grammar';
import { useStore } from '../store/useStore';

type SubMode = 'tenses' | 'prepositions' | 'articles';
type ViewMode = 'list' | 'detail' | 'quiz';

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  }
}

function TenseCard({ tense, onClick }: { tense: Tense; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-12 h-12 bg-gradient-to-br ${tense.color} rounded-xl flex items-center justify-center text-2xl`}>
          {tense.emoji}
        </div>
        <div>
          <h3 className="font-extrabold text-gray-800">{tense.name}</h3>
          <p className="text-sm text-gray-500">{tense.nameRu}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-2">{tense.description}</p>
      <div className="bg-gray-50 rounded-xl p-2">
        <code className="text-xs font-mono text-violet-700">{tense.formula}</code>
      </div>
    </motion.button>
  );
}

function TenseDetail({ tense, onBack }: { tense: Tense; onBack: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <button onClick={onBack} className="text-gray-500 text-xl">←</button>
        <div className={`w-10 h-10 bg-gradient-to-br ${tense.color} rounded-xl flex items-center justify-center text-xl`}>
          {tense.emoji}
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-gray-800">{tense.name}</h1>
          <p className="text-xs text-gray-500">{tense.nameRu}</p>
        </div>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-4">
        <p className="text-xs font-semibold text-violet-600 mb-1">ФОРМУЛА</p>
        <code className="text-sm font-mono text-violet-800 font-bold">{tense.formula}</code>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
        <p className="text-xs font-semibold text-blue-600 mb-1">КОГДА ИСПОЛЬЗУЕМ</p>
        <p className="text-sm text-blue-800">{tense.description}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
        <p className="text-xs font-semibold text-amber-600 mb-2">СЛОВА-СИГНАЛЫ</p>
        <div className="flex flex-wrap gap-2">
          {tense.signal.map(s => (
            <span key={s} className="bg-amber-200 text-amber-800 text-xs font-semibold px-2 py-1 rounded-lg">
              {s}
            </span>
          ))}
        </div>
      </div>

      <h3 className="font-bold text-gray-800 mb-3">Примеры</h3>
      <div className="space-y-3">
        {tense.examples.map((ex, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-gray-800 text-sm">{ex.english}</p>
                <p className="text-gray-500 text-sm mt-1">{ex.russian}</p>
              </div>
              <button onClick={() => speak(ex.english)} className="text-violet-400 text-lg shrink-0 mt-0.5">🔊</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TenseQuiz({ onFinish }: { onFinish: (score: number) => void }) {
  const questions = [
    { question: 'Какое время использовать: "Я хожу в школу каждый день."', options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Future Simple'], correct: 0 },
    { question: 'Какое время использовать: "Она сейчас читает."', options: ['Present Simple', 'Present Continuous', 'Past Perfect', 'Future Simple'], correct: 1 },
    { question: 'Какое время использовать: "Мы смотрели фильм вчера."', options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Future Simple'], correct: 2 },
    { question: 'Какое время использовать: "Я поеду в Лондон завтра."', options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Future Simple'], correct: 3 },
    { question: 'Слово-сигнал "always" → какое время?', options: ['Present Continuous', 'Present Simple', 'Past Simple', 'Future Simple'], correct: 1 },
    { question: 'Слово-сигнал "yesterday" → какое время?', options: ['Present Simple', 'Present Perfect', 'Past Simple', 'Future Simple'], correct: 2 },
    { question: 'Формула "am/is/are + V-ing" — это...', options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Present Perfect'], correct: 1 },
    { question: 'Формула "have/has + V3" — это...', options: ['Future Simple', 'Past Simple', 'Present Continuous', 'Present Perfect'], correct: 3 },
  ];

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = questions[current];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1000);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-3">{score >= 6 ? '🏆' : score >= 4 ? '👍' : '😅'}</div>
        <h2 className="text-2xl font-extrabold text-gray-800">{score}/{questions.length}</h2>
        <p className="text-gray-500 text-sm mt-1">{score >= 6 ? 'Отлично! Ты знаешь времена!' : 'Повтори правила и попробуй снова!'}</p>
        <button onClick={() => onFinish(score)} className="mt-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg w-full">
          Готово! +{score * 10} XP
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Вопрос {current + 1}/{questions.length}</span>
        <span className="text-green-600 font-bold">✅ {score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white text-center mb-5 shadow-xl">
        <p className="font-bold text-sm leading-snug">{q.question}</p>
      </div>
      <div className="space-y-2">
        {q.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAnswer(idx)}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-left transition-all border-2 ${
              selected === null
                ? 'bg-white border-gray-200 text-gray-800'
                : idx === q.correct
                ? 'bg-green-100 border-green-500 text-green-700'
                : selected === idx
                ? 'bg-red-100 border-red-400 text-red-700'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PrepCard({ prep }: { prep: Preposition }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">{prep.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-gray-800 text-lg">{prep.word}</span>
            <button onClick={(e) => { e.stopPropagation(); speak(prep.word); }} className="text-blue-400 text-sm">🔊</button>
          </div>
          <span className="text-sm text-gray-500">{prep.russian}</span>
        </div>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {prep.examples.map((ex, i) => (
                <div key={i} className="bg-blue-50 rounded-xl p-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-bold text-blue-800">{ex.english}</p>
                      <p className="text-xs text-blue-600 mt-0.5">{ex.russian}</p>
                    </div>
                    <button onClick={() => speak(ex.english)} className="text-blue-400">🔊</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ArticleCard({ rule }: { rule: ArticleRule }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full p-4 flex items-center gap-3 text-left">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">{rule.emoji}</div>
        <div className="flex-1">
          <span className="font-extrabold text-gray-800 text-lg">{rule.article}</span>
          <p className="text-xs text-gray-500 mt-0.5 leading-tight">{rule.ruleRu}</p>
        </div>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4">
              <p className="text-xs text-gray-600 mb-3 bg-amber-50 rounded-xl p-3">{rule.rule}</p>
              <div className="space-y-2">
                {rule.examples.map((ex, i) => (
                  <div key={i} className="bg-amber-50 rounded-xl p-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-bold text-amber-800">{ex.english}</p>
                        <p className="text-xs text-amber-600 mt-0.5">{ex.russian}</p>
                      </div>
                      <button onClick={() => speak(ex.english)} className="text-amber-400">🔊</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GrammarSection() {
  const { addXP } = useStore();
  const [subMode, setSubMode] = useState<SubMode>('tenses');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTense, setSelectedTense] = useState<Tense | null>(null);

  const SUB_TABS = [
    { id: 'tenses' as SubMode, label: 'Времена', emoji: '⏱️' },
    { id: 'prepositions' as SubMode, label: 'Предлоги', emoji: '📍' },
    { id: 'articles' as SubMode, label: 'Артикли', emoji: '📰' },
  ];

  const handleQuizFinish = (score: number) => {
    addXP(score * 10);
    setViewMode('list');
  };

  if (viewMode === 'quiz' && subMode === 'tenses') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => setViewMode('list')} className="text-gray-500 text-xl">←</button>
          <h1 className="text-xl font-extrabold text-gray-800">Квиз по временам</h1>
        </div>
        <TenseQuiz onFinish={handleQuizFinish} />
      </div>
    );
  }

  if (selectedTense) {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <TenseDetail tense={selectedTense} onBack={() => setSelectedTense(null)} />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-4">📝 Грамматика</h1>

      {/* Sub tabs */}
      <div className="flex gap-2 mb-5 bg-gray-100 rounded-2xl p-1">
        {SUB_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSubMode(tab.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              subMode === tab.id ? 'bg-white shadow-sm text-violet-700' : 'text-gray-500'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {subMode === 'tenses' && (
        <div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setViewMode('quiz')}
            className="w-full mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2"
          >
            <span>🧠</span> Проверь знания времён
          </motion.button>
          <div className="space-y-3">
            {TENSES.map(tense => (
              <TenseCard key={tense.id} tense={tense} onClick={() => setSelectedTense(tense)} />
            ))}
          </div>
        </div>
      )}

      {subMode === 'prepositions' && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-2">
            <p className="text-xs text-blue-700 font-semibold">💡 Нажми на предлог чтобы увидеть примеры и нажми 🔊 чтобы услышать произношение!</p>
          </div>
          {PREPOSITIONS.map(prep => (
            <PrepCard key={prep.id} prep={prep} />
          ))}
        </div>
      )}

      {subMode === 'articles' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-2">
            <p className="text-xs text-amber-700 font-semibold">💡 Артикли — одна из сложнейших тем в английском! Запоминай примеры.</p>
          </div>
          {ARTICLE_RULES.map(rule => (
            <ArticleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  );
}
