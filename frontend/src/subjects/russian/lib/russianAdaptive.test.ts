import { describe, it, expect, vi } from 'vitest';
import { repeatWeight, orderIndicesByWeights, mcqPracticeKey } from './russianAdaptive';

describe('russianAdaptive', () => {
  it('repeatWeight: errors raise priority, correct answers lower it', () => {
    expect(repeatWeight(undefined)).toBe(1);
    expect(repeatWeight({ wrong: 0, right: 0 })).toBe(1);
    expect(repeatWeight({ wrong: 2, right: 0 })).toBeGreaterThan(repeatWeight({ wrong: 0, right: 0 }));
    expect(repeatWeight({ wrong: 0, right: 8 })).toBeLessThan(repeatWeight({ wrong: 0, right: 0 }));
    expect(repeatWeight({ wrong: 3, right: 10 })).toBeGreaterThan(0.09);
  });

  it('orderIndicesByWeights respects higher weights more often (deterministic rng)', () => {
    const weights = [0.2, 5, 0.2];
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const o = orderIndicesByWeights(weights);
    expect(o).toHaveLength(3);
    expect(o[0]).toBe(1);
    vi.restoreAllMocks();
  });

  it('mcqPracticeKey is stable', () => {
    expect(mcqPracticeKey('pos-1', 'q1')).toBe('mcq|pos-1|q1');
  });
});
