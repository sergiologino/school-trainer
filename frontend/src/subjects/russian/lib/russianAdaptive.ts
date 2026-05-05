/** Ключи и веса для адаптивных повторов (русский язык). */

export type RussianItemStat = { wrong: number; right: number };

export function mcqPracticeKey(taskId: string, questionId: string): string {
  return `mcq|${taskId}|${questionId}`;
}

export function dictantSentenceKey(dictantId: string, sentenceIndex: number): string {
  return `dict|${dictantId}|${sentenceIndex}`;
}

/**
 * Чем выше вес — тем чаще элемент попадает в начало сессии / «в фокус».
 * Правильные ответы плавно снижают вес; ошибки заметно повышают.
 */
export function repeatWeight(stat: RussianItemStat | undefined): number {
  if (!stat) return 1;
  const { wrong, right } = stat;
  const w = 1 + 1.15 * wrong - 0.32 * Math.min(right, 10) - 0.05 * Math.max(0, right - 10);
  return Math.max(0.1, Math.min(14, w));
}

/** Перемешивание без повторов: на каждом шаге выбираем оставшийся индекс с вероятностью ∝ weight. */
export function orderIndicesByWeights(weights: number[]): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const remaining = new Set<number>(Array.from({ length: n }, (_, i) => i));
  const order: number[] = [];
  while (remaining.size > 0) {
    let total = 0;
    for (const i of remaining) {
      total += Math.max(0.05, weights[i] ?? 1);
    }
    let r = Math.random() * total;
    let chosen = 0;
    for (const i of remaining) {
      r -= Math.max(0.05, weights[i] ?? 1);
      if (r <= 0) {
        chosen = i;
        break;
      }
      chosen = i;
    }
    order.push(chosen);
    remaining.delete(chosen);
  }
  return order;
}

export function mapOrder<T>(items: readonly T[], indexOrder: number[]): T[] {
  return indexOrder.map((i) => items[i]);
}
