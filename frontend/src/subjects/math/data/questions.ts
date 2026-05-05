export interface Question {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function shuffleOptions(options: string[]): string[] {
  return [...options].sort(() => Math.random() - 0.5);
}

function uniqueOptions(answer: string, candidates: string[], count = 4): string[] {
  const options = new Set<string>([answer]);
  for (const candidate of candidates) {
    if (options.size >= count) break;
    options.add(candidate);
  }

  let offset = 1;
  while (options.size < count) {
    const numericAnswer = Number(answer);
    if (Number.isFinite(numericAnswer)) {
      options.add(String(Math.max(0, Math.round((numericAnswer + offset) * 1000) / 1000)));
      options.add(String(Math.max(0, Math.round((numericAnswer - offset) * 1000) / 1000)));
    } else {
      options.add(`${offset}/${offset + 1}`);
    }
    offset++;
  }

  return shuffleOptions(Array.from(options).slice(0, count));
}

export function generateMultiplicationQuestions(): Question[] {
  const questions: Question[] = [];
  for (let i = 2; i <= 9; i++) {
    for (let j = 2; j <= 9; j++) {
      const answer = i * j;
      const answerStr = String(answer);
      const options = uniqueOptions(answerStr, [
        String(Math.max(1, answer - i)),
        String(answer + i),
        String(Math.max(1, answer - j)),
        String(answer + j),
        String(Math.max(1, answer - 1)),
        String(answer + 1),
      ]);
      questions.push({
        id: `mult-${i}-${j}`,
        topicId: 'multiplication',
        question: `${i} × ${j} = ?`,
        options,
        answer: answerStr,
        explanation: `${i} × ${j} = ${answer}. Это ${i} групп по ${j} предметов = ${answer} предметов!`,
        difficulty: i <= 5 && j <= 5 ? 1 : i <= 7 && j <= 7 ? 2 : 3,
      });
    }
  }
  return questions;
}

export function generateFractionAddSubQuestions(): Question[] {
  const questions: Question[] = [];
  // Same denominator
  for (let d = 2; d <= 12; d++) {
    for (let n1 = 1; n1 < d; n1++) {
      for (let n2 = 1; n2 < d; n2++) {
        if (n1 + n2 > d) continue;
        const ansNum = n1 + n2;
        const g = gcd(ansNum, d);
        const reducedNum = ansNum / g;
        const reducedDen = d / g;
        const answerStr = reducedDen === 1 ? String(reducedNum) : `${reducedNum}/${reducedDen}`;
        const opts = generateFractionOptions(reducedNum, reducedDen, 4);
        questions.push({
          id: `frac-add-same-${d}-${n1}-${n2}`,
          topicId: 'fractions-add-sub',
          question: `${n1}/${d} + ${n2}/${d} = ?`,
          options: opts.includes(answerStr) ? opts : [answerStr, ...opts.slice(0, 3)],
          answer: answerStr,
          explanation: `Знаменатели одинаковые (${d}), складываем числители: ${n1} + ${n2} = ${ansNum}. Получаем ${ansNum}/${d}${g > 1 ? ` = ${reducedNum}/${reducedDen}` : ''}.`,
          difficulty: 1,
        });
        if (questions.length > 30) break;
      }
      if (questions.length > 30) break;
    }
    if (questions.length > 30) break;
  }
  // Different denominators
  const pairs = [[2,3],[3,4],[2,5],[4,6],[3,6],[2,4],[5,10],[3,9]];
  for (const [d1, d2] of pairs) {
    for (let n1 = 1; n1 < d1; n1++) {
      for (let n2 = 1; n2 < d2; n2++) {
        const L = lcm(d1, d2);
        const sumNum = n1 * (L / d1) + n2 * (L / d2);
        const g = gcd(sumNum, L);
        const rn = sumNum / g, rd = L / g;
        if (rn > rd * 2) continue;
        const answerStr = rd === 1 ? String(rn) : `${rn}/${rd}`;
        const opts = generateFractionOptions(rn, rd, 4);
        questions.push({
          id: `frac-add-diff-${d1}-${d2}-${n1}-${n2}`,
          topicId: 'fractions-add-sub',
          question: `${n1}/${d1} + ${n2}/${d2} = ?`,
          options: opts.includes(answerStr) ? opts : [answerStr, ...opts.slice(0, 3)],
          answer: answerStr,
          explanation: `НОК(${d1}, ${d2}) = ${L}. Приводим: ${n1*L/d1}/${L} + ${n2*L/d2}/${L} = ${sumNum}/${L}${g>1?` = ${rn}/${rd}`:''}`,
          difficulty: 2,
        });
      }
    }
  }
  return questions.slice(0, 60);
}

export function generateFractionMulDivQuestions(): Question[] {
  const questions: Question[] = [];
  const fracs = [[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5],[3,5],[1,6],[5,6]];
  for (const [n1, d1] of fracs) {
    for (const [n2, d2] of fracs) {
      // Multiply
      const mulNum = n1 * n2, mulDen = d1 * d2;
      const g1 = gcd(mulNum, mulDen);
      const rn = mulNum / g1, rd = mulDen / g1;
      const answerStr = rd === 1 ? String(rn) : `${rn}/${rd}`;
      const opts = generateFractionOptions(rn, rd, 4);
      questions.push({
        id: `frac-mul-${n1}-${d1}-${n2}-${d2}`,
        topicId: 'fractions-mul-div',
        question: `${n1}/${d1} × ${n2}/${d2} = ?`,
        options: opts.includes(answerStr) ? opts : [answerStr, ...opts.slice(0, 3)],
        answer: answerStr,
        explanation: `Умножаем числители: ${n1}×${n2}=${mulNum}, знаменатели: ${d1}×${d2}=${mulDen}. Получаем ${mulNum}/${mulDen}${g1>1?` = ${rn}/${rd}`:''}`,
        difficulty: 1,
      });
      // Divide
      const divNum = n1 * d2, divDen = d1 * n2;
      const g2 = gcd(divNum, divDen);
      const dn = divNum / g2, dd = divDen / g2;
      const divAns = dd === 1 ? String(dn) : `${dn}/${dd}`;
      const divOpts = generateFractionOptions(dn, dd, 4);
      questions.push({
        id: `frac-div-${n1}-${d1}-${n2}-${d2}`,
        topicId: 'fractions-mul-div',
        question: `${n1}/${d1} ÷ ${n2}/${d2} = ?`,
        options: divOpts.includes(divAns) ? divOpts : [divAns, ...divOpts.slice(0, 3)],
        answer: divAns,
        explanation: `Делим на дробь = умножаем на перевёрнутую: ${n1}/${d1} × ${d2}/${n2} = ${divNum}/${divDen}${g2>1?` = ${dn}/${dd}`:''}`,
        difficulty: 2,
      });
    }
  }
  return questions.slice(0, 60);
}

export function generateDecimalIntroQuestions(): Question[] {
  const questions: Question[] = [];
  const pairs: [number, number][] = [[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,10],[3,10],[7,10],[1,25],[1,8],[3,8]];
  for (const [n, d] of pairs) {
    const dec = (n / d).toFixed(d <= 10 ? 1 : d <= 100 ? 2 : 3);
    const decNum = parseFloat(dec);
    const options = uniqueOptions(dec, [
      String(Math.round((decNum + 0.1) * 1000) / 1000),
      String(Math.max(0, Math.round((decNum - 0.1) * 1000) / 1000)),
      String(Math.round((decNum + 0.5) * 1000) / 1000),
      String(Math.max(0, Math.round((decNum - 0.5) * 1000) / 1000)),
    ]);
    questions.push({
      id: `dec-conv-${n}-${d}`,
      topicId: 'decimals-intro',
      question: `Переведи дробь ${n}/${d} в десятичную`,
      options,
      answer: dec,
      explanation: `${n}/${d} = ${n}÷${d} = ${dec}`,
      difficulty: 1,
    });
  }
  // Reverse: decimal to fraction
  const decPairs: [string, string][] = [['0.5','1/2'],['0.25','1/4'],['0.75','3/4'],['0.2','1/5'],['0.4','2/5'],['0.1','1/10'],['0.6','3/5']];
  for (const [dec, frac] of decPairs) {
    questions.push({
      id: `dec-tofrac-${dec}`,
      topicId: 'decimals-intro',
      question: `Что равно ${dec} в виде дроби?`,
      options: uniqueOptions(frac, [
        `${parseInt(dec.replace('0.',''))+1}/10`,
        `1/${dec.replace('0.','').replace(/^0+/,'')}`,
        `${dec.replace('0.','')}/${dec.replace('0.','').length*10}`,
        `${dec.replace('0.','')}/100`,
      ]),
      answer: frac,
      explanation: `${dec} = ${frac}`,
      difficulty: 2,
    });
  }
  return questions;
}

export function generateDecimalAddSubQuestions(): Question[] {
  const questions: Question[] = [];
  const nums = [0.1,0.2,0.3,0.5,1.1,1.5,2.5,3.7,4.2,0.25,0.75,1.25];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i; j < nums.length; j++) {
      const a = nums[i], b = nums[j];
      const sum = Math.round((a + b) * 1000) / 1000;
      const diff = Math.round(Math.abs(a - b) * 1000) / 1000;
      const sumStr = String(sum);
      const diffStr = String(diff);
      questions.push({
        id: `decas-add-${a}-${b}`,
        topicId: 'decimals-add-sub',
        question: `${a} + ${b} = ?`,
        options: uniqueOptions(sumStr, [String(sum+0.1), String(Math.max(0,sum-0.1)), String(sum+1)]),
        answer: sumStr,
        explanation: `Складываем в столбик, выравнивая запятые: ${a} + ${b} = ${sum}`,
        difficulty: 1,
      });
      if (a !== b) {
        questions.push({
          id: `decas-sub-${Math.max(a,b)}-${Math.min(a,b)}`,
          topicId: 'decimals-add-sub',
          question: `${Math.max(a,b)} - ${Math.min(a,b)} = ?`,
          options: uniqueOptions(diffStr, [String(diff+0.1), String(Math.max(0,diff-0.1)), String(diff+0.5)]),
          answer: diffStr,
          explanation: `Вычитаем в столбик, выравнивая запятые: ${Math.max(a,b)} - ${Math.min(a,b)} = ${diff}`,
          difficulty: 1,
        });
      }
      if (questions.length >= 50) break;
    }
    if (questions.length >= 50) break;
  }
  return questions;
}

export function generateDecimalMulDivQuestions(): Question[] {
  const questions: Question[] = [];
  const muls = [[0.1,2],[0.2,3],[0.5,4],[1.2,3],[2.5,2],[0.4,5],[1.5,2],[0.3,3],[2.4,2],[1.1,4]];
  for (const [a, b] of muls) {
    const prod = Math.round(a * b * 1000) / 1000;
    const quot = Math.round(prod / b * 1000) / 1000;
    questions.push({
      id: `decmd-mul-${a}-${b}`,
      topicId: 'decimals-mul-div',
      question: `${a} × ${b} = ?`,
      options: uniqueOptions(String(prod), [String(prod+0.1), String(Math.max(0,prod-0.2)), String(prod*2)]),
      answer: String(prod),
      explanation: `${a} × ${b}: умножаем как целые (${a*10}×${b}=${a*10*b}), сдвигаем запятую = ${prod}`,
      difficulty: 1,
    });
    questions.push({
      id: `decmd-div-${prod}-${b}`,
      topicId: 'decimals-mul-div',
      question: `${prod} ÷ ${b} = ?`,
      options: uniqueOptions(String(quot), [String(quot+0.1), String(Math.max(0,quot-0.1)), String(quot*2)]),
      answer: String(quot),
      explanation: `${prod} ÷ ${b}: делим как целые, следим за запятой = ${quot}`,
      difficulty: 2,
    });
  }
  return questions;
}

export function generateMeanQuestions(): Question[] {
  const questions: Question[] = [];
  const sets = [
    [2, 4, 6],
    [10, 20, 30],
    [5, 5, 10, 10],
    [1, 2, 3, 4, 5],
    [4, 8, 12],
    [15, 25, 35],
  ];
  for (const arr of sets) {
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = sum / arr.length;
    const meanStr = Number.isInteger(mean) ? String(mean) : mean.toFixed(2);
      questions.push({
        id: `mean-${arr.join('-')}`,
        topicId: 'mean-intro',
        question: `Среднее арифметическое чисел: ${arr.join(', ')}`,
        options: uniqueOptions(meanStr, [String(sum), String(mean + 2), String(Math.max(0, mean - 1))]),
        answer: meanStr,
        explanation: `Сумма ${sum}, чисел ${arr.length} → ${sum} ÷ ${arr.length} = ${meanStr}`,
        difficulty: 1,
    });
  }
  return questions;
}

export function generateAreaPerimeterQuestions(): Question[] {
  const questions: Question[] = [];
  for (let a = 2; a <= 9; a++) {
    for (let b = 2; b <= 9; b++) {
      if (questions.length > 48) break;
      const P = 2 * (a + b);
      const S = a * b;
      questions.push({
        id: `ap-p-${a}-${b}`,
        topicId: 'area-perimeter',
        question: `Периметр прямоугольника со сторонами ${a} и ${b}?`,
        options: uniqueOptions(String(P), [String(P + 2), String(S), String(a + b), String(P - 2)]),
        answer: String(P),
        explanation: `P = 2(a + b) = 2×(${a}+${b}) = ${P}`,
        difficulty: 1,
      });
      questions.push({
        id: `ap-s-${a}-${b}`,
        topicId: 'area-perimeter',
        question: `Площадь прямоугольника со сторонами ${a} и ${b}?`,
        options: uniqueOptions(String(S), [String(S + 3), String(P), String(a + b), String(Math.max(1, S - 3))]),
        answer: String(S),
        explanation: `S = a×b = ${a}×${b} = ${S}`,
        difficulty: 1,
      });
    }
  }
  return questions;
}

export function generatePercentQuestions(): Question[] {
  const questions: Question[] = [];
  const fracMap: [number, string][] = [
    [50, '1/2'],
    [25, '1/4'],
    [75, '3/4'],
    [20, '1/5'],
    [10, '1/10'],
  ];
  for (const [p, frac] of fracMap) {
      questions.push({
        id: `pct-frac-${p}`,
        topicId: 'percent-intro',
        question: `${p}% целого — это какая (несокращённая доля вида «a/b» нужна)? Выбери верное из смысловых.`,
      options: uniqueOptions(frac, ['2/7', '1/8', '3/8']),
      answer: frac,
      explanation: `${p}% = ${p}/100 ; сократи получишь знакомую долю (${frac}).`,
      difficulty: 1,
    });
  }
  const bases = [40, 50, 60, 80, 100, 120];
  for (const base of bases) {
    for (const pct of [10, 20, 25, 50]) {
      const ans = Math.round((base * pct) / 100);
      questions.push({
        id: `pct-of-${base}-${pct}`,
        topicId: 'percent-intro',
        question: `Сколько будет ${pct}% от ${base}?`,
        options: uniqueOptions(String(ans), [String(ans + 5), String(Math.max(0, ans - 5)), String(base + pct)]),
        answer: String(ans),
        explanation: `${pct}% от ${base}: ${base} × ${pct} ÷ 100 = ${ans}`,
        difficulty: 2,
      });
    }
  }
  return questions.slice(0, 55);
}

function generateFractionOptions(n: number, d: number, count: number): string[] {
  const answer = d === 1 ? String(n) : `${n}/${d}`;
  const opts = new Set([answer]);
  while (opts.size < count) {
    const offset = Math.floor(Math.random() * 3) + 1;
    const nn = Math.max(1, n + (Math.random() > 0.5 ? offset : -offset));
    const nd = Math.max(2, d + (Math.random() > 0.5 ? offset : -offset));
    opts.add(nd === 1 ? String(nn) : `${nn}/${nd}`);
    if (opts.size < count) opts.add(`${n+1}/${d}`);
    if (opts.size < count) opts.add(`${n}/${d+1}`);
    if (opts.size < count) opts.add(`${Math.max(1,n-1)}/${d}`);
  }
  return Array.from(opts).slice(0, count).sort(() => Math.random() - 0.5);
}

export function getQuestionsForTopic(topicId: string): Question[] {
  switch (topicId) {
    case 'multiplication':
      return generateMultiplicationQuestions();
    case 'fractions-add-sub':
      return generateFractionAddSubQuestions();
    case 'fractions-mul-div':
      return generateFractionMulDivQuestions();
    case 'decimals-intro':
      return generateDecimalIntroQuestions();
    case 'decimals-add-sub':
      return generateDecimalAddSubQuestions();
    case 'decimals-mul-div':
      return generateDecimalMulDivQuestions();
    case 'percent-intro':
      return generatePercentQuestions();
    case 'area-perimeter':
      return generateAreaPerimeterQuestions();
    case 'mean-intro':
      return generateMeanQuestions();
    case 'mixed': {
      const all = [
        ...generateMultiplicationQuestions().slice(0, 8),
        ...generateFractionAddSubQuestions().slice(0, 8),
        ...generateFractionMulDivQuestions().slice(0, 8),
        ...generateDecimalIntroQuestions().slice(0, 6),
        ...generateDecimalAddSubQuestions().slice(0, 6),
        ...generateDecimalMulDivQuestions().slice(0, 6),
        ...generatePercentQuestions().slice(0, 6),
        ...generateAreaPerimeterQuestions().slice(0, 6),
        ...generateMeanQuestions().slice(0, 4),
      ];
      return all.sort(() => Math.random() - 0.5);
    }
    default:
      return [];
  }
}
