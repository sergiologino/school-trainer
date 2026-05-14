import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerPwa } from './pwa';

describe('registerPwa', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers the service worker on window load', () => {
    const register = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register },
    });

    const addEventListener = vi.spyOn(window, 'addEventListener');

    registerPwa();

    expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function));

    const onLoad = addEventListener.mock.calls.find(([event]) => event === 'load')?.[1];
    expect(onLoad).toBeTypeOf('function');

    (onLoad as EventListener)(new Event('load'));

    expect(register).toHaveBeenCalledWith('/sw.js');
  });
});

