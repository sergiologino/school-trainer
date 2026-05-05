import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VOCABULARY } from '../data/vocabulary';
import { useStore } from '../store/useStore';

type DictationMode = 'menu' | 'words' | 'verbs' | 'sentences' | 'pronunciation';

const SENTENCES = [
  { english: 'I go to school every day.', russian: 'Я хожу в школу каждый день.' },
  { english: 'She reads books in the evening.', russian: 'Она читает книги вечером.' },
  { english: 'We are playing football now.', russian: 'Мы сейчас играем в футбол.' },
  { english: 'I visited Moscow last year.', russian: 'Я посетил Москву в прошлом году.' },
  { english: 'The cat is on the table.', russian: 'Кошка на столе.' },
  { english: 'She has never been to France.', russian: 'Она никогда не была во Франции.' },
  { english: 'I will go to London next year.', russian: 'Я поеду в Лондон в следующем году.' },
  { english: 'My father works at a hospital.', russian: 'Мой папа работает в больнице.' },
  { english: 'The dog is under the chair.', russian: 'Собака под стулом.' },
  { english: 'I have already done my homework.', russian: 'Я уже сделал домашнее задание.' },
];

function speak(text: string, onEnd?: () => void) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.75;
    if (onEnd) utt.onend = onEnd;
    window.speechSynthesis.speak(utt);
  }
}

function normalizeAnswer(str: string): string {
  return str.toLowerCase()
    .replace(/[.,!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shuffleItems<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function pickWordDictationWords() {
  return shuffleItems(VOCABULARY).slice(0, 8);
}

export function pickSentenceDictationSentences() {
  return shuffleItems(SENTENCES).slice(0, 6);
}

export function WordDictation({ onFinish }: { onFinish: (score: number, total: number) => void }) {
  const words = useMemo(() => pickWordDictationWords(), []);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const word = words[current];

  useEffect(() => {
    setTimeout(() => speak(word.english), 300);
    inputRef.current?.focus();
  }, [current]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const correct = normalizeAnswer(input) === normalizeAnswer(word.english);
    const newResults = [...results, correct];
    setResults(newResults);
    if (correct) setScore(s => s + 1);
    setSubmitted(true);
    setTimeout(() => {
      if (current + 1 >= words.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setInput('');
        setSubmitted(false);
      }
    }, 1500);
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="text-6xl mb-3">{score >= words.length * 0.8 ? '🏆' : '💪'}</div>
        <h2 className="text-2xl font-extrabold text-gray-800">{score}/{words.length}</h2>
        <p className="text-gray-500 text-sm mt-1">Слов написано правильно</p>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {words.map((w, i) => (
            <div key={i} className={`px-3 py-1.5 rounded-full text-xs font-bold ${results[i] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {results[i] ? '✅' : '❌'} {w.english}
            </div>
          ))}
        </div>
        <button onClick={() => onFinish(score, words.length)} className="mt-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-2xl w-full shadow-lg">
          Готово! +{score * 15} XP
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Слово {current + 1}/{words.length}</span>
        <span className="text-green-600 font-bold">✅ {score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${(current / words.length) * 100}%` }} />
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white text-center mb-5 shadow-xl">
        <div className="text-5xl mb-3">{word.emoji}</div>
        <p className="text-green-100 text-sm mb-2">Послушай и напиши слово по-английски:</p>
        <p className="text-green-200 text-sm font-semibold">{word.russian}</p>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => speak(word.english)}
          className="mt-3 bg-white/20 text-white px-5 py-2 rounded-xl font-bold text-sm"
        >
          🔊 Ещё раз
        </motion.button>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Напиши слово по-английски..."
        disabled={submitted}
        className={`w-full border-2 rounded-2xl px-4 py-3 text-lg font-bold text-center outline-none transition-all ${
          submitted
            ? results[results.length - 1]
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-red-400 bg-red-50 text-red-700'
            : 'border-violet-300 focus:border-violet-500 bg-white text-gray-800'
        }`}
      />

      {submitted && !results[results.length - 1] && (
        <div className="mt-2 text-center text-sm text-green-700 font-semibold">
          Правильно: <strong>{word.english}</strong>
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={submitted || !input.trim()}
        className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-2xl shadow-md disabled:opacity-50"
      >
        Проверить ✓
      </motion.button>
    </div>
  );
}

export function SentenceDictation({ onFinish }: { onFinish: (score: number, total: number) => void }) {
  const sentences = useMemo(() => pickSentenceDictationSentences(), []);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);

  const sentence = sentences[current];

  const playSentence = () => {
    setPlaying(true);
    speak(sentence.english, () => setPlaying(false));
  };

  useEffect(() => {
    setTimeout(playSentence, 300);
  }, [current]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    const correct = normalizeAnswer(input) === normalizeAnswer(sentence.english);
    setResults(r => [...r, correct]);
    if (correct) setScore(s => s + 1);
    setSubmitted(true);
    setTimeout(() => {
      if (current + 1 >= sentences.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setInput('');
        setSubmitted(false);
      }
    }, 2000);
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="text-6xl mb-3">{score >= sentences.length * 0.7 ? '🏆' : '💪'}</div>
        <h2 className="text-2xl font-extrabold text-gray-800">{score}/{sentences.length}</h2>
        <p className="text-gray-500 text-sm mt-1">Предложений написано правильно</p>
        <button onClick={() => onFinish(score, sentences.length)} className="mt-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-2xl w-full shadow-lg">
          Готово! +{score * 15} XP
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Предложение {current + 1}/{sentences.length}</span>
        <span className="text-green-600 font-bold">✅ {score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-5">
        <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(current / sentences.length) * 100}%` }} />
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white text-center mb-5 shadow-xl">
        <div className="text-4xl mb-2">📢</div>
        <p className="text-emerald-100 text-sm mb-3">Послушай предложение и напиши его!</p>
        <p className="text-emerald-200 text-sm italic">{sentence.russian}</p>
        <motion.button
          whileTap={{ scale: 0.9 }}
          animate={playing ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={playing ? { repeat: Infinity, duration: 0.5 } : {}}
          onClick={playSentence}
          className="mt-3 bg-white/20 text-white px-5 py-2 rounded-xl font-bold text-sm"
        >
          {playing ? '🔊 Играет...' : '🔊 Прослушать'}
        </motion.button>
      </div>

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Напиши предложение по-английски..."
        disabled={submitted}
        rows={2}
        className={`w-full border-2 rounded-2xl px-4 py-3 text-base font-semibold outline-none transition-all resize-none ${
          submitted
            ? results[results.length - 1]
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-red-400 bg-red-50 text-red-700'
            : 'border-violet-300 focus:border-violet-500 bg-white text-gray-800'
        }`}
      />

      {submitted && !results[results.length - 1] && (
        <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-2 text-sm text-green-700 font-semibold">
          Правильно: <strong>{sentence.english}</strong>
        </div>
      )}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={submitted || !input.trim()}
        className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-2xl shadow-md disabled:opacity-50"
      >
        Проверить ✓
      </motion.button>
    </div>
  );
}

function PronunciationMode({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [supported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const items = [...VOCABULARY.slice(0, 5).map(w => w.english), ...SENTENCES.slice(0, 3).map(s => s.english)];
  const item = items[current];

  const startListening = () => {
    if (!supported) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    setTranscript('');
    setResult(null);
    recognition.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setTranscript(t);
      const correct = normalizeAnswer(t) === normalizeAnswer(item);
      setResult(correct ? 'correct' : 'wrong');
      if (correct) setScore(s => s + 1);
    };
    recognition.onerror = () => { setIsListening(false); };
    recognition.onend = () => { setIsListening(false); };
    recognition.start();
  };

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Фраза {current + 1}/{items.length}</span>
        <span className="text-green-600 font-bold">✅ {score}</span>
      </div>

      <div className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl p-6 text-white text-center mb-5 shadow-xl">
        <div className="text-4xl mb-3">🎙️</div>
        <p className="text-violet-200 text-xs mb-2">Произнеси по-английски:</p>
        <h2 className="text-xl font-extrabold">{item}</h2>
        <button onClick={() => speak(item)} className="mt-3 bg-white/20 px-4 py-2 rounded-xl text-sm font-bold">
          🔊 Образец
        </button>
      </div>

      {!supported && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 text-sm text-red-700">
          ⚠️ Распознавание речи недоступно в вашем браузере. Используйте Chrome.
        </div>
      )}

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl p-3 mb-4 text-center font-bold ${result === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {result === 'correct' ? '✅ Отлично! Правильное произношение!' : `❌ Ты сказал: "${transcript}"`}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={isListening ? { repeat: Infinity, duration: 0.8 } : {}}
          onClick={startListening}
          disabled={isListening || !supported}
          className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg text-sm ${
            isListening ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-indigo-600'
          }`}
        >
          {isListening ? '🎤 Говори...' : '🎤 Произнести'}
        </motion.button>
        {result && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setResult(null);
              setTranscript('');
              if (current + 1 < items.length) {
                setCurrent(c => c + 1);
              } else {
                onBack();
              }
            }}
            className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 text-sm"
          >
            Далее →
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default function DictationSection() {
  const { addXP, incrementDictations } = useStore();
  const [mode, setMode] = useState<DictationMode>('menu');

  const handleFinish = (score: number, _total: number) => {
    addXP(score * 15);
    incrementDictations();
    setMode('menu');
  };

  const CARDS = [
    { id: 'words' as DictationMode, emoji: '📝', title: 'Диктант слов', subtitle: 'Послушай и напиши слово', color: 'from-green-500 to-emerald-500', xp: '+15 XP за слово' },
    { id: 'sentences' as DictationMode, emoji: '📢', title: 'Диктант предложений', subtitle: 'Послушай и напиши предложение', color: 'from-teal-500 to-cyan-500', xp: '+15 XP за предложение' },
    { id: 'pronunciation' as DictationMode, emoji: '🎤', title: 'Произношение', subtitle: 'Произнеси слово — мы проверим!', color: 'from-violet-500 to-indigo-500', xp: '+10 XP за фразу' },
  ];

  if (mode === 'words') return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setMode('menu')} className="text-gray-500 text-xl">←</button>
        <h1 className="text-xl font-extrabold text-gray-800">Диктант слов</h1>
      </div>
      <WordDictation onFinish={handleFinish} />
    </div>
  );

  if (mode === 'sentences') return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setMode('menu')} className="text-gray-500 text-xl">←</button>
        <h1 className="text-xl font-extrabold text-gray-800">Диктант предложений</h1>
      </div>
      <SentenceDictation onFinish={handleFinish} />
    </div>
  );

  if (mode === 'pronunciation') return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setMode('menu')} className="text-gray-500 text-xl">←</button>
        <h1 className="text-xl font-extrabold text-gray-800">Проверка произношения</h1>
      </div>
      <PronunciationMode onBack={() => setMode('menu')} />
    </div>
  );

  return (
    <div className="pb-24 pt-4 px-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">🎤 Диктант</h1>
      <p className="text-sm text-gray-500 mb-5">Тренируй письмо и произношение</p>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-5">
        <p className="text-xs text-amber-800 font-semibold">
          💡 Слушай внимательно и пиши что слышишь! Для режима произношения нужен микрофон.
        </p>
      </div>

      <div className="space-y-4">
        {CARDS.map((card, i) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode(card.id)}
            className={`w-full bg-gradient-to-r ${card.color} text-white rounded-3xl p-5 text-left shadow-lg`}
          >
            <div className="text-4xl mb-2">{card.emoji}</div>
            <h3 className="font-extrabold text-lg">{card.title}</h3>
            <p className="text-white/80 text-sm mt-1">{card.subtitle}</p>
            <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{card.xp}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
