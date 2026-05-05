export interface Topic {
  id: string;
  title: string;
  emoji: string;
  color: string;
  bgGradient: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  type: 'theory' | 'practice' | 'test';
  xpReward: number;
}

export const TOPICS: Topic[] = [
  {
    id: 'multiplication',
    title: 'Таблица умножения',
    emoji: '✖️',
    color: '#f59e0b',
    bgGradient: 'from-amber-400 to-orange-500',
    description: 'Выучи таблицу умножения с помощью игр и запоминалок!',
    lessons: [
      { id: 'mult-theory', title: 'Как работает умножение', emoji: '📖', type: 'theory', xpReward: 20 },
      { id: 'mult-table', title: 'Таблица умножения', emoji: '📋', type: 'theory', xpReward: 30 },
      { id: 'mult-practice', title: 'Тренажёр умножения', emoji: '🎯', type: 'practice', xpReward: 50 },
      { id: 'mult-test', title: 'Проверь себя!', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
  {
    id: 'fractions-add-sub',
    title: 'Сложение и вычитание дробей',
    emoji: '➕',
    color: '#8b5cf6',
    bgGradient: 'from-violet-500 to-purple-600',
    description: 'Научись складывать и вычитать обыкновенные дроби!',
    lessons: [
      { id: 'frac-intro', title: 'Что такое дробь?', emoji: '🍕', type: 'theory', xpReward: 20 },
      { id: 'frac-same', title: 'Дроби с одинаковым знаменателем', emoji: '➕', type: 'theory', xpReward: 30 },
      { id: 'frac-diff', title: 'Дроби с разными знаменателями', emoji: '🔢', type: 'theory', xpReward: 40 },
      { id: 'frac-add-practice', title: 'Тренажёр', emoji: '🎯', type: 'practice', xpReward: 50 },
      { id: 'frac-add-test', title: 'Проверь себя!', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
  {
    id: 'fractions-mul-div',
    title: 'Умножение и деление дробей',
    emoji: '✖️',
    color: '#ec4899',
    bgGradient: 'from-pink-500 to-rose-600',
    description: 'Умножай и дели дроби как настоящий математик!',
    lessons: [
      { id: 'frac-mul-theory', title: 'Умножение дробей', emoji: '✖️', type: 'theory', xpReward: 30 },
      { id: 'frac-div-theory', title: 'Деление дробей', emoji: '➗', type: 'theory', xpReward: 30 },
      { id: 'frac-mul-practice', title: 'Тренажёр', emoji: '🎯', type: 'practice', xpReward: 50 },
      { id: 'frac-mul-test', title: 'Проверь себя!', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
  {
    id: 'decimals-intro',
    title: 'Десятичные дроби',
    emoji: '🔟',
    color: '#06b6d4',
    bgGradient: 'from-cyan-500 to-blue-600',
    description: 'Открой мир десятичных дробей!',
    lessons: [
      { id: 'dec-intro', title: 'Что такое десятичная дробь?', emoji: '💡', type: 'theory', xpReward: 20 },
      { id: 'dec-convert', title: 'Перевод обыкновенной дроби в десятичную', emoji: '🔄', type: 'theory', xpReward: 40 },
      { id: 'dec-practice', title: 'Тренажёр перевода', emoji: '🎯', type: 'practice', xpReward: 50 },
      { id: 'dec-test', title: 'Проверь себя!', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
  {
    id: 'decimals-add-sub',
    title: 'Сложение и вычитание десятичных',
    emoji: '➕',
    color: '#10b981',
    bgGradient: 'from-emerald-500 to-teal-600',
    description: 'Складывай и вычитай десятичные числа!',
    lessons: [
      { id: 'decas-theory', title: 'Как складывать и вычитать', emoji: '📖', type: 'theory', xpReward: 30 },
      { id: 'decas-practice', title: 'Тренажёр', emoji: '🎯', type: 'practice', xpReward: 50 },
      { id: 'decas-test', title: 'Проверь себя!', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
  {
    id: 'decimals-mul-div',
    title: 'Умножение и деление десятичных',
    emoji: '✖️',
    color: '#f43f5e',
    bgGradient: 'from-rose-500 to-red-600',
    description: 'Умножай и дели десятичные числа!',
    lessons: [
      { id: 'decmd-mul', title: 'Умножение десятичных', emoji: '✖️', type: 'theory', xpReward: 30 },
      { id: 'decmd-div', title: 'Деление десятичных', emoji: '➗', type: 'theory', xpReward: 30 },
      { id: 'decmd-practice', title: 'Тренажёр', emoji: '🎯', type: 'practice', xpReward: 50 },
      { id: 'decmd-test', title: 'Проверь себя!', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
  {
    id: 'percent-intro',
    title: 'Проценты: основы',
    emoji: '📊',
    color: '#0ea5e9',
    bgGradient: 'from-sky-500 to-blue-600',
    description: 'Пойми, что такое процент и как он связан с долей от 100.',
    lessons: [
      { id: 'pct-theory', title: 'Что такое процент', emoji: '💯', type: 'theory', xpReward: 25 },
      { id: 'pct-convert', title: 'Доли и проценты', emoji: '🔄', type: 'theory', xpReward: 35 },
      { id: 'pct-practice', title: 'Тренажёр процентов', emoji: '🎯', type: 'practice', xpReward: 55 },
      { id: 'pct-test', title: 'Проверь себя', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
  {
    id: 'area-perimeter',
    title: 'Периметр и площадь',
    emoji: '📐',
    color: '#84cc16',
    bgGradient: 'from-lime-500 to-green-600',
    description: 'Практика на прямоугольниках и составных фигурах.',
    lessons: [
      { id: 'ap-theory', title: 'Формулы', emoji: '📏', type: 'theory', xpReward: 25 },
      { id: 'ap-practice', title: 'Задачи', emoji: '🎯', type: 'practice', xpReward: 55 },
      { id: 'ap-test', title: 'Контроль', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
  {
    id: 'mean-intro',
    title: 'Среднее арифметическое',
    emoji: '⚖️',
    color: '#a855f7',
    bgGradient: 'from-purple-500 to-fuchsia-600',
    description: 'Найди «середину» набора чисел.',
    lessons: [
      { id: 'mean-theory', title: 'Идея среднего', emoji: '🧮', type: 'theory', xpReward: 25 },
      { id: 'mean-practice', title: 'Тренажёр', emoji: '🎯', type: 'practice', xpReward: 55 },
      { id: 'mean-test', title: 'Проверка', emoji: '🏆', type: 'test', xpReward: 100 },
    ],
  },
];

export const getTopic = (id: string) => TOPICS.find(t => t.id === id);
