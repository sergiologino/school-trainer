import { describe, expect, it } from 'vitest';
import { VOCABULARY } from './vocabulary';

const expectedEmoji = new Map([
  ['desk', '🪵'],
  ['board', '🟩'],
  ['coat', '🧥'],
  ['jacket', '🧥'],
  ['socks', '🧦'],
]);

const forbiddenEmoji = new Map([
  ['desk', '🪑'],
  ['coat', '🧦'],
  ['jacket', '🧦'],
]);

describe('english vocabulary visuals', () => {
  it('keeps confusing school and clothes words mapped to correct visuals', () => {
    for (const [english, emoji] of expectedEmoji) {
      const word = VOCABULARY.find((item) => item.english === english);
      expect(word, english).toBeTruthy();
      expect(word?.emoji, english).toBe(emoji);
    }

    for (const [english, emoji] of forbiddenEmoji) {
      const word = VOCABULARY.find((item) => item.english === english);
      expect(word?.emoji, `${english} must not use ${emoji}`).not.toBe(emoji);
    }
  });
});

