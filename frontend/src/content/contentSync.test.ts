import { afterEach, describe, expect, it, vi } from 'vitest';
import { getSyncedPackage } from './contentSync';

describe('contentSync', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('downloads and caches published content packages', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/content/manifest')) {
        return new Response(
          JSON.stringify({
            packages: [
              {
                key: 'math_grade5_curriculum',
                version: 1,
                checksum: 'abc',
                downloadUrl: '/api/content/packages/math_grade5_curriculum',
              },
            ],
          }),
          { status: 200 }
        );
      }

      return new Response(
        JSON.stringify({
          key: 'math_grade5_curriculum',
          payload: { topics: [{ id: 'multiplication' }] },
        }),
        { status: 200 }
      );
    });
    vi.stubGlobal('fetch', fetchMock);

    const payload = await getSyncedPackage<{ topics: Array<{ id: string }> }>(
      'math_grade5_curriculum',
      { grade: 5, subject: 'math', fallback: { topics: [] } }
    );

    expect(payload.topics).toEqual([{ id: 'multiplication' }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('uses cached package when backend is offline', async () => {
    localStorage.setItem(
      'school-trainer-content-package:math_grade5_curriculum',
      JSON.stringify({
        key: 'math_grade5_curriculum',
        version: 1,
        checksum: 'abc',
        payload: { topics: [{ id: 'cached-topic' }] },
      })
    );
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));

    const payload = await getSyncedPackage<{ topics: Array<{ id: string }> }>(
      'math_grade5_curriculum',
      { grade: 5, subject: 'math', fallback: { topics: [] } }
    );

    expect(payload.topics).toEqual([{ id: 'cached-topic' }]);
  });
});
