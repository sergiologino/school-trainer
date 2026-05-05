export interface Tense {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  formula: string;
  examples: { english: string; russian: string }[];
  signal: string[];
  emoji: string;
  color: string;
}

export interface IrregularVerb {
  id: string;
  v1: string;
  v2: string;
  v3: string;
  russian: string;
  emoji: string;
  transcription1: string;
  transcription2: string;
  transcription3: string;
  memoryTip: string;
}

export interface Preposition {
  id: string;
  word: string;
  russian: string;
  emoji: string;
  examples: { english: string; russian: string }[];
  imageHint: string;
}

export interface ArticleRule {
  id: string;
  article: string;
  rule: string;
  ruleRu: string;
  examples: { english: string; russian: string }[];
  emoji: string;
}

export const TENSES: Tense[] = [
  {
    id: 'present-simple',
    name: 'Present Simple',
    nameRu: 'Настоящее простое',
    description: 'Используется для регулярных действий, фактов и привычек',
    formula: 'I/You/We/They + V1 | He/She/It + V1(s/es)',
    examples: [
      { english: 'I go to school every day.', russian: 'Я хожу в школу каждый день.' },
      { english: 'She reads books in the evening.', russian: 'Она читает книги вечером.' },
      { english: 'The sun rises in the east.', russian: 'Солнце встаёт на востоке.' },
    ],
    signal: ['every day', 'always', 'usually', 'often', 'never', 'sometimes'],
    emoji: '☀️',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    id: 'present-continuous',
    name: 'Present Continuous',
    nameRu: 'Настоящее длительное',
    description: 'Используется для действий, происходящих прямо сейчас',
    formula: 'am/is/are + V-ing',
    examples: [
      { english: 'I am reading now.', russian: 'Я сейчас читаю.' },
      { english: 'They are playing football.', russian: 'Они играют в футбол.' },
      { english: 'She is cooking dinner.', russian: 'Она готовит ужин.' },
    ],
    signal: ['now', 'at the moment', 'look!', 'listen!', 'right now'],
    emoji: '⏰',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'past-simple',
    name: 'Past Simple',
    nameRu: 'Прошедшее простое',
    description: 'Используется для завершённых действий в прошлом',
    formula: 'V2 (правильные: +ed) | Неправильные глаголы',
    examples: [
      { english: 'I visited Moscow last year.', russian: 'Я посетил Москву в прошлом году.' },
      { english: 'She went to the market yesterday.', russian: 'Она ходила на рынок вчера.' },
      { english: 'We watched a film on Sunday.', russian: 'Мы смотрели фильм в воскресенье.' },
    ],
    signal: ['yesterday', 'last year', 'ago', 'in 2020', 'last Monday'],
    emoji: '📅',
    color: 'from-purple-400 to-violet-400',
  },
  {
    id: 'future-simple',
    name: 'Future Simple',
    nameRu: 'Будущее простое',
    description: 'Используется для будущих действий и предсказаний',
    formula: 'will + V1',
    examples: [
      { english: 'I will go to London next year.', russian: 'Я поеду в Лондон в следующем году.' },
      { english: 'She will help you.', russian: 'Она поможет тебе.' },
      { english: 'It will rain tomorrow.', russian: 'Завтра будет дождь.' },
    ],
    signal: ['tomorrow', 'next week', 'soon', 'in the future', 'next year'],
    emoji: '🚀',
    color: 'from-green-400 to-emerald-400',
  },
  {
    id: 'present-perfect',
    name: 'Present Perfect',
    nameRu: 'Настоящее совершённое',
    description: 'Действие в прошлом, связанное с настоящим результатом',
    formula: 'have/has + V3',
    examples: [
      { english: 'I have already done my homework.', russian: 'Я уже сделал домашнее задание.' },
      { english: 'She has never been to France.', russian: 'Она никогда не была во Франции.' },
      { english: 'Have you ever seen a bear?', russian: 'Ты когда-нибудь видел медведя?' },
    ],
    signal: ['already', 'just', 'never', 'ever', 'yet', 'since', 'for'],
    emoji: '✅',
    color: 'from-pink-400 to-rose-400',
  },
];

export const IRREGULAR_VERBS: IrregularVerb[] = [
  { id: 'iv1', v1: 'go', v2: 'went', v3: 'gone', russian: 'идти/ехать', emoji: '🚶', transcription1: '[ɡəʊ]', transcription2: '[went]', transcription3: '[ɡɒn]', memoryTip: 'go → went — запомни: совсем другое слово!' },
  { id: 'iv2', v1: 'come', v2: 'came', v3: 'come', russian: 'приходить', emoji: '🏃', transcription1: '[kʌm]', transcription2: '[keɪm]', transcription3: '[kʌm]', memoryTip: 'come-came-come: начало и конец одинаковые' },
  { id: 'iv3', v1: 'see', v2: 'saw', v3: 'seen', russian: 'видеть', emoji: '👀', transcription1: '[siː]', transcription2: '[sɔː]', transcription3: '[siːn]', memoryTip: 'see-saw: как пила по-английски!' },
  { id: 'iv4', v1: 'take', v2: 'took', v3: 'taken', russian: 'брать', emoji: '🤏', transcription1: '[teɪk]', transcription2: '[tʊk]', transcription3: '[ˈteɪkən]', memoryTip: 'take-took: короткий звук в прошлом' },
  { id: 'iv5', v1: 'give', v2: 'gave', v3: 'given', russian: 'давать', emoji: '🎁', transcription1: '[ɡɪv]', transcription2: '[ɡeɪv]', transcription3: '[ˈɡɪvən]', memoryTip: 'give-gave: звук меняется i→a' },
  { id: 'iv6', v1: 'get', v2: 'got', v3: 'got', russian: 'получать', emoji: '📬', transcription1: '[ɡet]', transcription2: '[ɡɒt]', transcription3: '[ɡɒt]', memoryTip: 'get-got-got: V2 и V3 одинаковые' },
  { id: 'iv7', v1: 'make', v2: 'made', v3: 'made', russian: 'делать/создавать', emoji: '🔨', transcription1: '[meɪk]', transcription2: '[meɪd]', transcription3: '[meɪd]', memoryTip: 'make-made: просто добавляем d' },
  { id: 'iv8', v1: 'know', v2: 'knew', v3: 'known', russian: 'знать', emoji: '🧠', transcription1: '[nəʊ]', transcription2: '[njuː]', transcription3: '[nəʊn]', memoryTip: 'know-knew: буква k не читается' },
  { id: 'iv9', v1: 'think', v2: 'thought', v3: 'thought', russian: 'думать', emoji: '💭', transcription1: '[θɪŋk]', transcription2: '[θɔːt]', transcription3: '[θɔːt]', memoryTip: 'think-thought: звук th в начале' },
  { id: 'iv10', v1: 'say', v2: 'said', v3: 'said', russian: 'говорить/сказать', emoji: '💬', transcription1: '[seɪ]', transcription2: '[sed]', transcription3: '[sed]', memoryTip: 'say-said: произносится [sed]!' },
  { id: 'iv11', v1: 'write', v2: 'wrote', v3: 'written', russian: 'писать', emoji: '✍️', transcription1: '[raɪt]', transcription2: '[rəʊt]', transcription3: '[ˈrɪtn]', memoryTip: 'write-wrote-written: w не читается!' },
  { id: 'iv12', v1: 'read', v2: 'read', v3: 'read', russian: 'читать', emoji: '📖', transcription1: '[riːd]', transcription2: '[red]', transcription3: '[red]', memoryTip: 'read: пишется одинаково, но читается [red]!' },
  { id: 'iv13', v1: 'run', v2: 'ran', v3: 'run', russian: 'бежать', emoji: '🏃', transcription1: '[rʌn]', transcription2: '[ræn]', transcription3: '[rʌn]', memoryTip: 'run-ran-run: V1 и V3 совпадают' },
  { id: 'iv14', v1: 'eat', v2: 'ate', v3: 'eaten', russian: 'есть/кушать', emoji: '🍽️', transcription1: '[iːt]', transcription2: '[eɪt]', transcription3: '[ˈiːtn]', memoryTip: 'eat-ate: как цифра 8 по-английски!' },
  { id: 'iv15', v1: 'drink', v2: 'drank', v3: 'drunk', russian: 'пить', emoji: '🥤', transcription1: '[drɪŋk]', transcription2: '[dræŋk]', transcription3: '[drʌŋk]', memoryTip: 'drink-drank-drunk: гласная i→a→u' },
  { id: 'iv16', v1: 'speak', v2: 'spoke', v3: 'spoken', russian: 'говорить', emoji: '🗣️', transcription1: '[spiːk]', transcription2: '[spəʊk]', transcription3: '[ˈspəʊkən]', memoryTip: 'speak-spoke: похоже на "smoke"' },
  { id: 'iv17', v1: 'swim', v2: 'swam', v3: 'swum', russian: 'плавать', emoji: '🏊', transcription1: '[swɪm]', transcription2: '[swæm]', transcription3: '[swʌm]', memoryTip: 'swim-swam-swum: гласная i→a→u (как drink!)' },
  { id: 'iv18', v1: 'sing', v2: 'sang', v3: 'sung', russian: 'петь', emoji: '🎤', transcription1: '[sɪŋ]', transcription2: '[sæŋ]', transcription3: '[sʌŋ]', memoryTip: 'sing-sang-sung: гласная i→a→u (снова!)' },
  { id: 'iv19', v1: 'find', v2: 'found', v3: 'found', russian: 'находить', emoji: '🔍', transcription1: '[faɪnd]', transcription2: '[faʊnd]', transcription3: '[faʊnd]', memoryTip: 'find-found: V2 и V3 одинаковые' },
  { id: 'iv20', v1: 'buy', v2: 'bought', v3: 'bought', russian: 'покупать', emoji: '🛒', transcription1: '[baɪ]', transcription2: '[bɔːt]', transcription3: '[bɔːt]', memoryTip: 'buy-bought: как "brought" (bring)' },
  { id: 'iv21', v1: 'bring', v2: 'brought', v3: 'brought', russian: 'приносить', emoji: '📦', transcription1: '[brɪŋ]', transcription2: '[brɔːt]', transcription3: '[brɔːt]', memoryTip: 'bring-brought: запомни пару buy-bought!' },
  { id: 'iv22', v1: 'teach', v2: 'taught', v3: 'taught', russian: 'обучать', emoji: '👩‍🏫', transcription1: '[tiːtʃ]', transcription2: '[tɔːt]', transcription3: '[tɔːt]', memoryTip: 'teach-taught: как "catch-caught"' },
  { id: 'iv23', v1: 'catch', v2: 'caught', v3: 'caught', russian: 'ловить', emoji: '⚾', transcription1: '[kætʃ]', transcription2: '[kɔːt]', transcription3: '[kɔːt]', memoryTip: 'catch-caught: запомни пару teach-taught!' },
  { id: 'iv24', v1: 'have', v2: 'had', v3: 'had', russian: 'иметь', emoji: '💰', transcription1: '[hæv]', transcription2: '[hæd]', transcription3: '[hæd]', memoryTip: 'have-had: просто меняем v→d' },
  { id: 'iv25', v1: 'be', v2: 'was/were', v3: 'been', russian: 'быть', emoji: '🌟', transcription1: '[biː]', transcription2: '[wɒz/wɜː]', transcription3: '[biːn]', memoryTip: 'be-was/were-been: самый важный глагол!' },
  { id: 'iv26', v1: 'do', v2: 'did', v3: 'done', russian: 'делать', emoji: '✅', transcription1: '[duː]', transcription2: '[dɪd]', transcription3: '[dʌn]', memoryTip: 'do-did-done: второй важнейший глагол!' },
  { id: 'iv27', v1: 'put', v2: 'put', v3: 'put', russian: 'класть/ставить', emoji: '📥', transcription1: '[pʊt]', transcription2: '[pʊt]', transcription3: '[pʊt]', memoryTip: 'put-put-put: все три формы одинаковые!' },
  { id: 'iv28', v1: 'cut', v2: 'cut', v3: 'cut', russian: 'резать', emoji: '✂️', transcription1: '[kʌt]', transcription2: '[kʌt]', transcription3: '[kʌt]', memoryTip: 'cut-cut-cut: как put, все одинаковые!' },
  { id: 'iv29', v1: 'meet', v2: 'met', v3: 'met', russian: 'встречать', emoji: '🤝', transcription1: '[miːt]', transcription2: '[met]', transcription3: '[met]', memoryTip: 'meet-met: длинный звук стал коротким' },
  { id: 'iv30', v1: 'leave', v2: 'left', v3: 'left', russian: 'уходить/оставлять', emoji: '🚪', transcription1: '[liːv]', transcription2: '[left]', transcription3: '[left]', memoryTip: 'leave-left: слышишь "left" = ушёл влево 😄' },
];

export const PREPOSITIONS: Preposition[] = [
  {
    id: 'prep1',
    word: 'in',
    russian: 'в (внутри)',
    emoji: '📦',
    examples: [
      { english: 'The cat is in the box.', russian: 'Кот в коробке.' },
      { english: 'I live in Russia.', russian: 'Я живу в России.' },
      { english: 'in the morning', russian: 'утром' },
    ],
    imageHint: 'object inside container',
  },
  {
    id: 'prep2',
    word: 'on',
    russian: 'на (поверхности)',
    emoji: '📋',
    examples: [
      { english: 'The book is on the table.', russian: 'Книга на столе.' },
      { english: 'on Monday', russian: 'в понедельник' },
      { english: 'on 5th May', russian: '5 мая' },
    ],
    imageHint: 'object on surface',
  },
  {
    id: 'prep3',
    word: 'at',
    russian: 'у/в (точка)',
    emoji: '📍',
    examples: [
      { english: 'She is at school.', russian: 'Она в школе.' },
      { english: 'at 7 o\'clock', russian: 'в 7 часов' },
      { english: 'at home', russian: 'дома' },
    ],
    imageHint: 'pin pointing location',
  },
  {
    id: 'prep4',
    word: 'under',
    russian: 'под',
    emoji: '⬇️',
    examples: [
      { english: 'The dog is under the chair.', russian: 'Собака под стулом.' },
      { english: 'under the bridge', russian: 'под мостом' },
      { english: 'under the table', russian: 'под столом' },
    ],
    imageHint: 'object below surface',
  },
  {
    id: 'prep5',
    word: 'behind',
    russian: 'за/позади',
    emoji: '🔙',
    examples: [
      { english: 'The ball is behind the sofa.', russian: 'Мяч за диваном.' },
      { english: 'behind the door', russian: 'за дверью' },
      { english: 'hide behind the tree', russian: 'спрятаться за деревом' },
    ],
    imageHint: 'object behind another',
  },
  {
    id: 'prep6',
    word: 'between',
    russian: 'между',
    emoji: '↔️',
    examples: [
      { english: 'Sit between Tom and Mary.', russian: 'Сядь между Томом и Мэри.' },
      { english: 'between 5 and 7', russian: 'между 5 и 7' },
      { english: 'the book between the chairs', russian: 'книга между стульями' },
    ],
    imageHint: 'object between two others',
  },
  {
    id: 'prep7',
    word: 'near',
    russian: 'рядом/около',
    emoji: '📏',
    examples: [
      { english: 'The shop is near the school.', russian: 'Магазин рядом со школой.' },
      { english: 'near the window', russian: 'у окна' },
      { english: 'near the park', russian: 'рядом с парком' },
    ],
    imageHint: 'close proximity',
  },
  {
    id: 'prep8',
    word: 'from',
    russian: 'из/от',
    emoji: '↩️',
    examples: [
      { english: 'I am from Moscow.', russian: 'Я из Москвы.' },
      { english: 'from Monday to Friday', russian: 'с понедельника по пятницу' },
      { english: 'a letter from a friend', russian: 'письмо от друга' },
    ],
    imageHint: 'origin point arrow',
  },
  {
    id: 'prep9',
    word: 'to',
    russian: 'в/к (направление)',
    emoji: '➡️',
    examples: [
      { english: 'I go to school.', russian: 'Я иду в школу.' },
      { english: 'Give it to me.', russian: 'Дай мне это.' },
      { english: 'from 9 to 5', russian: 'с 9 до 5' },
    ],
    imageHint: 'direction arrow',
  },
  {
    id: 'prep10',
    word: 'with',
    russian: 'с (вместе)',
    emoji: '🤝',
    examples: [
      { english: 'I play with my friends.', russian: 'Я играю с друзьями.' },
      { english: 'tea with milk', russian: 'чай с молоком' },
      { english: 'write with a pen', russian: 'писать ручкой' },
    ],
    imageHint: 'two objects together',
  },
];

export const ARTICLE_RULES: ArticleRule[] = [
  {
    id: 'art1',
    article: 'a / an',
    rule: 'Use before singular countable nouns mentioned for the first time or when saying what something is',
    ruleRu: 'Ставим перед единственным числом существительного, когда говорим о нём впервые или говорим, что это такое',
    examples: [
      { english: 'I have a cat.', russian: 'У меня есть кошка. (первый раз упоминаем)' },
      { english: 'She is a teacher.', russian: 'Она учительница. (профессия)' },
      { english: 'I eat an apple every day.', russian: 'Я ем яблоко каждый день.' },
    ],
    emoji: '1️⃣',
  },
  {
    id: 'art2',
    article: 'the',
    rule: 'Use before nouns already mentioned, unique things, or when both speaker and listener know which one',
    ruleRu: 'Ставим когда предмет уже упоминался, когда он единственный в своём роде, или оба понимают о чём речь',
    examples: [
      { english: 'I have a cat. The cat is black.', russian: 'У меня есть кот. Этот кот чёрный. (уже упоминали)' },
      { english: 'The sun rises in the east.', russian: 'Солнце встаёт на востоке. (единственное)' },
      { english: 'Please close the door.', russian: 'Закрой дверь. (понятно какую)' },
    ],
    emoji: '☝️',
  },
  {
    id: 'art3',
    article: '∅ (нет)',
    rule: 'No article before plural nouns in general meaning, uncountable nouns, proper nouns (names, countries, cities)',
    ruleRu: 'Артикль НЕ ставим: перед именами, городами, странами, множественным числом в общем смысле, с неисчисляемыми существительными',
    examples: [
      { english: 'Dogs are clever animals.', russian: 'Собаки — умные животные. (в целом)' },
      { english: 'I live in Russia.', russian: 'Я живу в России. (страна)' },
      { english: 'Water is important.', russian: 'Вода важна. (неисчисляемое)' },
    ],
    emoji: '🚫',
  },
];
