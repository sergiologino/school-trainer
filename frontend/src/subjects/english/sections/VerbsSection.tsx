import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IRREGULAR_VERBS } from '../data/grammar';
import type { IrregularVerb } from '../data/grammar';
import { useStore } from '../store/useStore';

function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.85;
    window.speechSynthesis.speak(utt);
  }
}

function VerbCard({ verb, flipped, onFlip }: { verb: IrregularVerb; flipped: boolean; onFlip: () => void }) {
  return (
    <motion.div
      className="w-full max-w-sm cursor-pointer mx-auto"
      onClick={onFlip}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', height: 200 }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-xl flex flex-col items-center justify-center text-white p-6"
        >
          <span className="text-5xl mb-3">{verb.emoji}</span>
          <h2 className="text-2xl font-extrabold">{verb.v1}</h2>
          <p className="text-orange-200 text-sm mt-1">{verb.transcription1}</p>
          <p className="text-orange-100 text-xs mt-1">{verb.russian}</p>
          <p className="text-orange-200 text-xs mt-3 opacity-70">Нажми → увидишь все формы</p>
        </div>
        {/* Back */}
        <div
          style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}
          className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl shadow-xl flex flex-col items-center justify-center text-white p-6"
        >
          <span className="text-3xl mb-2">{verb.emoji}</span>
          <div className="grid grid-cols-3 gap-3 text-center w-full">
            <div className="bg-white/20 rounded-xl p-2">
              <p className="text-[10px] text-red-200">V1</p>
              <p className="font-extrabold text-sm">{verb.v1}</p>
              <p className="text-[10px] text-red-200">{verb.transcription1}</p>
            </div>
            <div className="bg-white/30 rounded-xl p-2">
              <p className="text-[10px] text-red-200">V2</p>
              <p className="font-extrabold text-sm">{verb.v2}</p>
              <p className="text-[10px] text-red-200">{verb.transcription2}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-2">
              <p className="text-[10px] text-red-200">V3</p>
              <p className="font-extrabold text-sm">{verb.v3}</p>
              <p className="text-[10px] text-red-200">{verb.transcription3}</p>
            </div>
          </div>
          <p className="text-red-100 text-xs mt-3 italic">{verb.memoryTip}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VerbQuiz({ verbs, onFinish }: { verbs: IrregularVerb[]; onFinish: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [formType, setFormType] = useState<'v2' | 'v3'>(() => Math.random() > 0.5 ? 'v2' : 'v3');

  const verb = verbs[current];

  const options = useMemo(() => {
    const correct = formType === 'v2' ? verb.v2 : verb.v3;
    const others = verbs.filter(v => v.id !== verb.id)
      .map(v => formType === 'v2' ? v.v2 : v.v3)
      .filter(v => v !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [...others, correct].sort(() => Math.random() - 0.5);
  }, [verb, formType, verbs]);

  const correct = formType === 'v2' ? verb.v2 : verb.v3;

  const handleAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    speak(verb.v1);
    if (opt === correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= verbs.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
        setFormType(Math.random() > 0.5 ? 'v2' : 'v3');
      }
    }, 1200);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-3">{score >= verbs.length * 0.8 ? '🏆' : '💪'}</div>
        <h2 className="text-2xl font-extrabold">{score}/{verbs.length}</h2>
        <p className="text-gray-500 text-sm mt-1">+{score * 8} XP заработано!</p>
        <button onClick={() => onFinish(score)} className="mt-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-2xl w-full">
          Готово!
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>{current + 1}/{verbs.length}</span>
        <span className="text-green-600 font-bold">✅ {score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
        <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${(current / verbs.length) * 100}%` }} />
      </div>
      <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-5 text-white text-center mb-5 shadow-xl">
        <div className="text-4xl mb-2">{verb.emoji}</div>
        <p className="text-orange-100 text-xs mb-1">V1 → ?</p>
        <h2 className="text-2xl font-extrabold">{verb.v1}</h2>
        <p className="text-orange-200 text-xs mt-1">{verb.russian}</p>
        <div className="mt-2 bg-white/20 rounded-lg px-3 py-1 inline-block">
          <span className="text-sm font-bold">Выбери {formType === 'v2' ? 'V2 (Past Simple)' : 'V3 (Past Participle)'}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(opt)}
            className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
              selected === null
                ? 'bg-white border-gray-200 text-gray-800'
                : opt === correct
                ? 'bg-green-100 border-green-500 text-green-700'
                : selected === opt
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

export default function VerbsSection() {
  const { addXP, incrementVerbsLearned, incrementPerfectQuizzes } = useStore();
  const [mode, setMode] = useState<'browse' | 'flashcard' | 'quiz' | 'list'>('browse');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learned, setLearned] = useState<Set<string>>(new Set());

  const handleKnew = () => {
    addXP(8);
    incrementVerbsLearned();
    setLearned(l => new Set([...l, IRREGULAR_VERBS[cardIndex].id]));
    setFlipped(false);
    setTimeout(() => {
      setCardIndex(i => (i + 1) % IRREGULAR_VERBS.length);
    }, 100);
  };

  const handleDidntKnow = () => {
    setFlipped(false);
    setTimeout(() => {
      setCardIndex(i => (i + 1) % IRREGULAR_VERBS.length);
    }, 100);
  };

  const handleQuizFinish = (score: number) => {
    addXP(score * 8);
    if (score >= IRREGULAR_VERBS.slice(0, 10).length * 0.9) incrementPerfectQuizzes();
    setMode('browse');
  };

  if (mode === 'flashcard') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setMode('browse')} className="text-gray-500 text-xl">←</button>
          <h1 className="text-xl font-extrabold text-gray-800">Карточки глаголов</h1>
          <span className="ml-auto text-sm text-gray-400">{cardIndex + 1}/{IRREGULAR_VERBS.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
          <div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${(learned.size / IRREGULAR_VERBS.length) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <VerbCard verb={IRREGULAR_VERBS[cardIndex]} flipped={flipped} onFlip={() => { setFlipped(f => !f); speak(IRREGULAR_VERBS[cardIndex].v1); }} />
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-3">
          <p className="text-xs text-amber-700 italic">{IRREGULAR_VERBS[cardIndex].memoryTip}</p>
        </div>

        <div className="flex gap-3 mt-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleDidntKnow} className="flex-1 bg-red-100 text-red-600 font-bold py-3 rounded-2xl border-2 border-red-200 text-sm">
            😕 Не знаю
          </motion.button>
          <button onClick={() => speak(`${IRREGULAR_VERBS[cardIndex].v1}, ${IRREGULAR_VERBS[cardIndex].v2}, ${IRREGULAR_VERBS[cardIndex].v3}`)} className="bg-orange-100 text-orange-600 font-bold py-3 px-4 rounded-2xl border-2 border-orange-200">
            🔊
          </button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleKnew} className="flex-1 bg-green-100 text-green-600 font-bold py-3 rounded-2xl border-2 border-green-200 text-sm">
            ✅ Знаю!
          </motion.button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">Изучено: {learned.size}/{IRREGULAR_VERBS.length}</p>
      </div>
    );
  }

  if (mode === 'quiz') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setMode('browse')} className="text-gray-500 text-xl">←</button>
          <h1 className="text-xl font-extrabold text-gray-800">Квиз по глаголам</h1>
        </div>
        <VerbQuiz verbs={IRREGULAR_VERBS.slice(0, 10)} onFinish={handleQuizFinish} />
      </div>
    );
  }

  if (mode === 'list') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setMode('browse')} className="text-gray-500 text-xl">←</button>
          <h1 className="text-xl font-extrabold text-gray-800">Все глаголы</h1>
        </div>
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-4 bg-gray-200 text-xs font-bold text-gray-600 px-3 py-2 gap-1">
            <span></span>
            <span>V1</span>
            <span>V2</span>
            <span>V3</span>
          </div>
          {IRREGULAR_VERBS.map((verb) => (
            <motion.div
              key={verb.id}
              className="grid grid-cols-4 items-center px-3 py-2.5 border-b border-gray-100 last:border-0 bg-white gap-1"
            >
              <button onClick={() => speak(`${verb.v1}, ${verb.v2}, ${verb.v3}`)} className="text-lg">{verb.emoji}</button>
              <div>
                <p className="text-sm font-bold text-gray-800">{verb.v1}</p>
                <p className="text-[10px] text-gray-400">{verb.russian}</p>
              </div>
              <p className="text-sm font-semibold text-orange-700">{verb.v2}</p>
              <p className="text-sm font-semibold text-red-700">{verb.v3}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">🔥 Неправильные глаголы</h1>
      <p className="text-sm text-gray-500 mb-5">Три формы глаголов — V1, V2, V3</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setCardIndex(0); setFlipped(false); setLearned(new Set()); setMode('flashcard'); }}
          className="bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl p-4 text-center shadow-md"
        >
          <div className="text-3xl mb-1">🃏</div>
          <div className="text-sm font-bold">Карточки</div>
          <div className="text-xs opacity-80 mt-0.5">+8 XP за глагол</div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setMode('quiz')}
          className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl p-4 text-center shadow-md"
        >
          <div className="text-3xl mb-1">🧠</div>
          <div className="text-sm font-bold">Тест V2/V3</div>
          <div className="text-xs opacity-80 mt-0.5">+8 XP за вопрос</div>
        </motion.button>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setMode('list')}
        className="w-full bg-white border-2 border-orange-200 text-orange-700 font-bold py-3 rounded-2xl mb-5 flex items-center justify-center gap-2"
      >
        📋 Все глаголы (таблица)
      </motion.button>

      {/* Preview top verbs */}
      <h2 className="font-bold text-gray-800 mb-3">Самые важные глаголы</h2>
      <div className="space-y-2">
        {IRREGULAR_VERBS.slice(0, 8).map((verb) => (
          <div key={verb.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
            <span className="text-2xl">{verb.emoji}</span>
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <span className="font-bold text-gray-800 text-sm">{verb.v1}</span>
                <span className="text-orange-600 font-semibold text-sm">→ {verb.v2}</span>
                <span className="text-red-600 font-semibold text-sm">→ {verb.v3}</span>
              </div>
              <p className="text-xs text-gray-500">{verb.russian}</p>
            </div>
            <button onClick={() => speak(`${verb.v1}, ${verb.v2}, ${verb.v3}`)} className="text-orange-400 text-lg">🔊</button>
          </div>
        ))}
      </div>
    </div>
  );
}
