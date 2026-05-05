import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VOCABULARY, type Word } from '../data/vocabulary';
import { useStore } from '../store/useStore';
import { getSyncedPackage } from '@/content/contentSync';

type Mode = 'browse' | 'flashcard' | 'quiz' | 'match';

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  }
}

function FlashCard({ word, onKnew, onDidntKnow }: {
  word: Word;
  onKnew: () => void;
  onDidntKnow: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-full max-w-sm cursor-pointer"
        onClick={() => { setFlipped(!flipped); if (!flipped) speak(word.english); }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', height: 220 }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
            className="bg-gradient-to-br from-violet-500 to-purple-700 rounded-3xl shadow-xl flex flex-col items-center justify-center text-white p-6"
          >
            <span className="text-7xl mb-3">{word.emoji}</span>
            <h2 className="text-3xl font-extrabold">{word.english}</h2>
            <p className="text-violet-200 text-sm mt-1">{word.transcription}</p>
            <p className="text-violet-200 text-xs mt-3 opacity-70">Нажми чтобы перевернуть</p>
          </div>
          {/* Back */}
          <div
            style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}
            className="bg-gradient-to-br from-indigo-500 to-blue-700 rounded-3xl shadow-xl flex flex-col items-center justify-center text-white p-6"
          >
            <span className="text-5xl mb-3">{word.emoji}</span>
            <h2 className="text-3xl font-extrabold">{word.russian}</h2>
            <p className="text-blue-200 text-sm mt-1">{word.english} {word.transcription}</p>
            <p className="text-blue-200 text-xs mt-2 italic">{word.category} • {word.grade} класс</p>
          </div>
        </motion.div>
      </motion.div>

      <div className="flex gap-3 mt-6 w-full max-w-sm">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onDidntKnow}
          className="flex-1 bg-red-100 text-red-600 font-bold py-3 rounded-2xl text-sm border-2 border-red-200"
        >
          😕 Не знаю
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => speak(word.english)}
          className="bg-violet-100 text-violet-600 font-bold py-3 px-4 rounded-2xl border-2 border-violet-200"
        >
          🔊
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onKnew}
          className="flex-1 bg-green-100 text-green-600 font-bold py-3 rounded-2xl text-sm border-2 border-green-200"
        >
          ✅ Знаю!
        </motion.button>
      </div>
    </div>
  );
}

function QuizMode({ words, onFinish }: { words: Word[]; onFinish: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const word = words[current];

  const options = useMemo(() => {
    const others = words.filter(w => w.id !== word.id);
    const shuffled = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    return [...shuffled, word].sort(() => Math.random() - 0.5);
  }, [word, words]);

  const handleAnswer = (opt: Word) => {
    if (selected) return;
    setSelected(opt.id);
    speak(word.english);
    if (opt.id === word.id) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (current + 1 >= words.length) {
        setShowResult(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1200);
  };

  if (showResult) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">{score === words.length ? '🏆' : score >= words.length / 2 ? '👍' : '😅'}</div>
        <h2 className="text-2xl font-extrabold text-gray-800">
          {score}/{words.length} правильно!
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          {score === words.length ? 'Отлично! Все ответы верны!' : 'Продолжай практиковаться!'}
        </p>
        <div className="mt-4 bg-violet-50 rounded-2xl p-3 inline-block">
          <span className="text-violet-700 font-bold text-lg">+{score * 5} XP заработано!</span>
        </div>
        <button
          onClick={() => onFinish(score)}
          className="mt-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg block w-full max-w-xs mx-auto"
        >
          Готово!
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">{current + 1}/{words.length}</span>
        <span className="text-sm font-bold text-violet-600">✅ {score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-violet-500 h-2 rounded-full transition-all"
          style={{ width: `${((current) / words.length) * 100}%` }}
        />
      </div>

      <div className="bg-gradient-to-br from-violet-500 to-purple-700 rounded-3xl p-8 text-center text-white mb-6 shadow-xl">
        <div className="text-5xl mb-2">{word.emoji}</div>
        <h2 className="text-2xl font-extrabold">{word.russian}</h2>
        <p className="text-violet-200 text-sm mt-1">Выбери правильный перевод</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <motion.button
            key={opt.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(opt)}
            className={`py-4 px-3 rounded-2xl font-bold text-sm transition-all border-2 ${
              selected === null
                ? 'bg-white border-gray-200 text-gray-800 hover:border-violet-400'
                : opt.id === word.id
                ? 'bg-green-100 border-green-500 text-green-700'
                : selected === opt.id
                ? 'bg-red-100 border-red-500 text-red-700'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            {opt.english}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function MatchMode({ words, onFinish }: { words: Word[]; onFinish: (score: number) => void }) {
  const limited = useMemo(() => words.slice(0, 6), [words]);
  const [matched, setMatched] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);

  const [left] = useState(() => [...limited].sort(() => Math.random() - 0.5));
  const [right] = useState(() => [...limited].sort(() => Math.random() - 0.5));

  const handleLeft = (id: string) => {
    if (matched.includes(id)) return;
    setSelectedLeft(id);
    if (selectedRight) {
      if (id === selectedRight) {
        setMatched(m => [...m, id]);
        setSelectedLeft(null);
        setSelectedRight(null);
        speak(limited.find(w => w.id === id)?.english || '');
        if (matched.length + 1 >= limited.length) {
          setTimeout(() => onFinish(limited.length), 500);
        }
      } else {
        setWrong(id);
        setTimeout(() => { setWrong(null); setSelectedLeft(null); setSelectedRight(null); }, 700);
      }
    }
  };

  const handleRight = (id: string) => {
    if (matched.includes(id)) return;
    setSelectedRight(id);
    if (selectedLeft) {
      if (id === selectedLeft) {
        setMatched(m => [...m, id]);
        setSelectedLeft(null);
        setSelectedRight(null);
        speak(limited.find(w => w.id === id)?.english || '');
        if (matched.length + 1 >= limited.length) {
          setTimeout(() => onFinish(limited.length), 500);
        }
      } else {
        setWrong(id);
        setTimeout(() => { setWrong(null); setSelectedLeft(null); setSelectedRight(null); }, 700);
      }
    }
  };

  return (
    <div>
      <p className="text-center text-gray-500 text-sm mb-4">Соедини слово с переводом!</p>
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-2">
          {left.map(w => (
            <motion.button
              key={w.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLeft(w.id)}
              className={`py-3 px-3 rounded-xl text-sm font-semibold text-center transition-all border-2 ${
                matched.includes(w.id)
                  ? 'bg-green-100 border-green-400 text-green-700 opacity-50'
                  : selectedLeft === w.id
                  ? 'bg-violet-100 border-violet-500 text-violet-700'
                  : wrong === w.id
                  ? 'bg-red-100 border-red-400'
                  : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              {w.emoji} {w.english}
            </motion.button>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {right.map(w => (
            <motion.button
              key={w.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRight(w.id)}
              className={`py-3 px-3 rounded-xl text-sm font-semibold text-center transition-all border-2 ${
                matched.includes(w.id)
                  ? 'bg-green-100 border-green-400 text-green-700 opacity-50'
                  : selectedRight === w.id
                  ? 'bg-violet-100 border-violet-500 text-violet-700'
                  : wrong === w.id
                  ? 'bg-red-100 border-red-400'
                  : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              {w.russian}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        Сопоставлено: {matched.length}/{limited.length}
      </div>
    </div>
  );
}

export default function WordsSection() {
  const { addXP, incrementWordsLearned, incrementPerfectQuizzes } = useStore();
  const [mode, setMode] = useState<Mode>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<number>(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [learned, setLearned] = useState<string[]>([]);
  const [vocabulary, setVocabulary] = useState<Word[]>(VOCABULARY);

  useEffect(() => {
    getSyncedPackage<{ words: Word[] }>('english_grade5_vocabulary', {
      grade: 5,
      subject: 'english',
      fallback: { words: VOCABULARY },
    })
      .then((d: { words: Word[] }) => {
        if (Array.isArray(d.words) && d.words.length) setVocabulary(d.words);
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => [...new Set(vocabulary.map((w) => w.category))], [vocabulary]);

  const filteredWords = vocabulary.filter(w =>
    (selectedCategory === 'all' || w.category === selectedCategory) &&
    (selectedGrade === 0 || w.grade === selectedGrade)
  );

  const quizWords = filteredWords.slice(0, 10);

  const handleKnew = () => {
    addXP(5);
    incrementWordsLearned();
    setLearned(l => [...l, filteredWords[cardIndex].id]);
    if (cardIndex + 1 < filteredWords.length) {
      setCardIndex(i => i + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handleDidntKnow = () => {
    if (cardIndex + 1 < filteredWords.length) {
      setCardIndex(i => i + 1);
    } else {
      setCardIndex(0);
    }
  };

  const handleQuizFinish = (score: number) => {
    addXP(score * 5);
    if (score === quizWords.length) incrementPerfectQuizzes();
    setMode('browse');
  };

  const handleMatchFinish = (score: number) => {
    addXP(score * 8);
    setMode('browse');
  };

  if (mode === 'flashcard') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setMode('browse')} className="text-gray-500 text-xl">←</button>
          <h1 className="text-xl font-extrabold text-gray-800">Карточки</h1>
          <span className="ml-auto text-sm text-gray-400">{cardIndex + 1}/{filteredWords.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${(learned.length / filteredWords.length) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <FlashCard
              word={filteredWords[cardIndex]}
              onKnew={handleKnew}
              onDidntKnow={handleDidntKnow}
            />
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 text-center text-sm text-gray-500">
          ✅ Изучено: {learned.length} слов (+{learned.length * 5} XP)
        </div>
      </div>
    );
  }

  if (mode === 'quiz') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setMode('browse')} className="text-gray-500 text-xl">←</button>
          <h1 className="text-xl font-extrabold text-gray-800">Квиз</h1>
        </div>
        <QuizMode words={quizWords} onFinish={handleQuizFinish} />
      </div>
    );
  }

  if (mode === 'match') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setMode('browse')} className="text-gray-500 text-xl">←</button>
          <h1 className="text-xl font-extrabold text-gray-800">Сопоставление</h1>
        </div>
        <MatchMode words={filteredWords} onFinish={handleMatchFinish} />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-4">📚 Слова</h1>

      {/* Filters */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2 font-semibold">Класс</p>
        <div className="flex gap-2">
          {[0, 4, 5, 6].map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                selectedGrade === g
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {g === 0 ? 'Все' : `${g} кл.`}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-semibold">Тема</p>
        <div className="flex gap-2 flex-wrap">
          {['all', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat === 'all' ? 'Все темы' : cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">Найдено слов: <strong className="text-gray-800">{filteredWords.length}</strong></p>

      {/* Mode buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setCardIndex(0); setLearned([]); setMode('flashcard'); }}
          className="bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-2xl p-4 text-center shadow-md"
        >
          <div className="text-2xl mb-1">🃏</div>
          <div className="text-xs font-bold">Карточки</div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode('quiz')}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-4 text-center shadow-md"
        >
          <div className="text-2xl mb-1">🧠</div>
          <div className="text-xs font-bold">Квиз</div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode('match')}
          className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-4 text-center shadow-md"
        >
          <div className="text-2xl mb-1">🔗</div>
          <div className="text-xs font-bold">Сопоставь</div>
        </motion.button>
      </div>

      {/* Word list preview */}
      <div className="space-y-2">
        {filteredWords.map((word, i) => (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-gray-100"
          >
            <span className="text-2xl">{word.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">{word.english}</span>
                <span className="text-gray-400 text-xs">{word.transcription}</span>
              </div>
              <span className="text-sm text-gray-500">{word.russian}</span>
            </div>
            <button
              onClick={() => speak(word.english)}
              className="text-violet-400 hover:text-violet-600 text-lg"
            >
              🔊
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
