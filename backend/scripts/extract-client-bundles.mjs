import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const fe = join(root, "..", "frontend", "src", "subjects");
const outDir = join(root, "content", "_generated");
const legacyOutDir = join(root, "src", "content", "_generated");
mkdirSync(outDir, { recursive: true });
mkdirSync(legacyOutDir, { recursive: true });

function sliceExportArray(source, exportName) {
  const marker = `export const ${exportName}`;
  const mi = source.indexOf(marker);
  if (mi < 0) throw new Error(`export ${exportName} not found`);
  const eq = source.indexOf("=", mi);
  if (eq < 0) throw new Error(`${exportName}: no =`);
  const start = source.indexOf("[", eq);
  if (start < 0) throw new Error(`[ not found for ${exportName}`);
  let depth = 0;
  for (let j = start; j < source.length; j++) {
    const c = source[j];
    if (c === "[") depth++;
    if (c === "]") {
      depth--;
      if (depth === 0) {
        return source.slice(start, j + 1);
      }
    }
  }
  throw new Error(`unclosed array ${exportName}`);
}

function appendMissingById(items, extras) {
  const existingIds = new Set(items.map((item) => item.id));
  return [...items, ...extras.filter((item) => !existingIds.has(item.id))];
}

const mathSrc = readFileSync(join(fe, "math", "data", "topics.ts"), "utf8");
const mathArrStr = sliceExportArray(mathSrc, "TOPICS");
const mathTopics = new Function(`return ${mathArrStr}`)();

const ruSrc = readFileSync(join(fe, "russian", "data", "tasks.ts"), "utf8");
const ruTasksStr = sliceExportArray(ruSrc, "tasks");
const ruDictStr = sliceExportArray(ruSrc, "dictants");
const russianTasks = new Function(`return ${ruTasksStr}`)();
let russianDictants = new Function(`return ${ruDictStr}`)();

const EXTRA_RU_TASKS = [
  {
    id: "lex-1",
    mode: "lexicon",
    title: "Синонимы и антонимы",
    description: "Подбери слово близкого или противоположного значения",
    icon: "🔤",
    color: "from-cyan-500 to-blue-600",
    difficulty: "medium",
    xpReward: 70,
    questions: [
      {
        id: "q1",
        question: "Синоним к слову «быстрый»",
        options: ["медленный", "скорый", "тяжёлый", "тихий"],
        correct: 1,
        explanation: "«Скорый» близко по смыслу к «быстрый».",
        visual: "🏃",
      },
      {
        id: "q2",
        question: "Антоним к слову «холодный»",
        options: ["замёрзший", "тёплый", "снежный", "льдяной"],
        correct: 1,
        explanation: "Противоположность холода — тепло.",
        visual: "☀️",
      },
      {
        id: "q3",
        question: "Синоним к слову «говорить»",
        options: ["молчать", "рассказывать", "спать", "бежать"],
        correct: 1,
        explanation: "«Рассказывать» — близко к «говорить» в нейтральном стиле.",
        visual: "💬",
      },
      {
        id: "q4",
        question: "Антоним к слову «радость»",
        options: ["веселье", "печаль", "смех", "улыбка"],
        correct: 1,
        explanation: "«Печаль» противопоставляется «радости».",
        visual: "🎭",
      },
    ],
  },
  {
    id: "morph-3",
    mode: "grammar",
    title: "Приставки и суффиксы",
    description: "Разбери значение частей слова",
    icon: "🧩",
    color: "from-indigo-500 to-violet-600",
    difficulty: "medium",
    xpReward: 75,
    questions: [
      {
        id: "q1",
        question: "Что меняет приставка «пере-» в слове «переехать»?",
        options: ["повторность", "движение через/смена места", "отрицание", "размер"],
        correct: 1,
        explanation: "«Пере-» часто указывает на смену места, объекта или степени.",
        visual: "🚚",
      },
      {
        id: "q2",
        question: "Суффикс «-ик» в слове «ученик» обозначает",
        options: ["действие", "лицо по признаку", "предмет", "место"],
        correct: 1,
        explanation: "«-ик» часто образует существительные, обозначающие лицо.",
        visual: "🎒",
      },
      {
        id: "q3",
        question: "Приставка «под-» в «подписать» указывает на",
        options: ["направление вниз/приближение", "отсутствие", "цвет", "время"],
        correct: 0,
        explanation: "«Под-» часто связывает с направлением или приближением (под линию).",
        visual: "✍️",
      },
    ],
  },
];

const EXTRA_DICT = {
  id: "dict-4",
  title: "Городской транспорт",
  level: "medium",
  topic: "Н и НН в наречиях, запятые",
  icon: "🚇",
  color: "from-teal-500 to-cyan-600",
  xpReward: 100,
  sentences: [
    { text: "Мы ехали на автобусе, который опаздывал.", hint: "Запятая перед «который» — придаточное" },
    { text: "Трамвай остановился у ярко освещённой остановки.", hint: "Наречие «ярко» + причастие: пример на согласование" },
    { text: "Вагон метро был переполнен.", hint: "«Переполнен» — НН в причастии (признак качества)" },
  ],
};

russianTasks.push(...EXTRA_RU_TASKS.filter((item) => !russianTasks.some((task) => task.id === item.id)));
russianDictants = appendMissingById(russianDictants, [EXTRA_DICT]);

const enSrc = readFileSync(join(fe, "english", "data", "vocabulary.ts"), "utf8");
const vocabStr = sliceExportArray(enSrc, "VOCABULARY");
let vocabulary = new Function(`return ${vocabStr}`)();

const EXTRA_EN = [
  { id: "w79", english: "library", russian: "библиотека", transcription: "[ˈlaɪbrəri]", emoji: "📚", category: "Школа", grade: 5, imageHint: "library building" },
  { id: "w80", english: "homework", russian: "домашнее задание", transcription: "[ˈhəʊmwɜːk]", emoji: "📝", category: "Школа", grade: 5, imageHint: "homework on desk" },
  { id: "w81", english: "science", russian: "наука", transcription: "[ˈsaɪəns]", emoji: "🔬", category: "Школа", grade: 5, imageHint: "science lab" },
  { id: "w82", english: "history", russian: "история", transcription: "[ˈhɪstri]", emoji: "🏛️", category: "Школа", grade: 5, imageHint: "ancient columns" },
  { id: "w83", english: "geography", russian: "география", transcription: "[dʒɪˈɒɡrəfi]", emoji: "🌍", category: "Школа", grade: 5, imageHint: "globe" },
  { id: "w84", english: "art", russian: "искусство", transcription: "[ɑːt]", emoji: "🎨", category: "Школа", grade: 5, imageHint: "palette" },
  { id: "w85", english: "music", russian: "музыка", transcription: "[ˈmjuːzɪk]", emoji: "🎵", category: "Школа", grade: 5, imageHint: "musical notes" },
  { id: "w86", english: "weather", russian: "погода", transcription: "[ˈweðə]", emoji: "🌤️", category: "Природа (5 класс)", grade: 5, imageHint: "sun and cloud" },
  { id: "w87", english: "season", russian: "время года / сезон", transcription: "[ˈsiːzn]", emoji: "🍂", category: "Природа (5 класс)", grade: 5, imageHint: "autumn leaves" },
  { id: "w88", english: "pollution", russian: "загрязнение", transcription: "[pəˈluːʃn]", emoji: "🏭", category: "Экология", grade: 5, imageHint: "factory smoke" },
];

vocabulary = appendMissingById(vocabulary, EXTRA_EN);

const bundlesJson = JSON.stringify({ vocabulary, russianTasks, russianDictants }, null, 0);
const mathTopicsJson = JSON.stringify(mathTopics);

for (const dir of [outDir, legacyOutDir]) {
  writeFileSync(join(dir, "bundles.json"), bundlesJson, "utf8");
  writeFileSync(join(dir, "mathTopics.json"), mathTopicsJson, "utf8");
}
console.log("Generated", outDir);
