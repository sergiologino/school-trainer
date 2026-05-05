import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WordDictation } from './DictationSection';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('WordDictation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps the same prompt while the learner types an answer', async () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1)
      .mockReturnValue(0.5);

    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);

    await act(async () => {
      root.render(<WordDictation onFinish={() => {}} />);
    });

    const input = host.querySelector('input');
    expect(input).not.toBeNull();
    const before = host.textContent;

    await act(async () => {
      input!.value = 'a';
      input!.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(host.textContent).toBe(before);

    await act(async () => {
      root.unmount();
    });
    host.remove();
  });
});
