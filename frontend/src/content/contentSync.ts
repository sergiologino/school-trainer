type ContentManifest = {
  packages: Array<{
    key: string;
    version: number;
    checksum: string;
    downloadUrl: string;
  }>;
};

type CachedPackage<T> = {
  key: string;
  version: number;
  checksum: string;
  payload: T;
};

type ContentPackageEnvelope<T> = {
  key: string;
  version?: number;
  checksum?: string;
  payload: T;
};

const CACHE_PREFIX = 'school-trainer-content-package:';

function cacheKey(key: string) {
  return `${CACHE_PREFIX}${key}`;
}

function readCachedPackage<T>(key: string): CachedPackage<T> | null {
  try {
    const raw = localStorage.getItem(cacheKey(key));
    return raw ? (JSON.parse(raw) as CachedPackage<T>) : null;
  } catch {
    return null;
  }
}

function writeCachedPackage<T>(pkg: CachedPackage<T>) {
  localStorage.setItem(cacheKey(pkg.key), JSON.stringify(pkg));
}

export async function syncContentPackages(grade: number, subject?: string) {
  const url = new URL('/api/content/manifest', window.location.origin);
  url.searchParams.set('grade', String(grade));
  url.searchParams.set('platform', 'web');
  if (subject) url.searchParams.set('subject', subject);

  const manifestResponse = await fetch(url);
  if (!manifestResponse.ok) throw new Error('content manifest unavailable');
  const manifest = (await manifestResponse.json()) as ContentManifest;

  await Promise.all(
    manifest.packages.map(async (entry) => {
      const cached = readCachedPackage(entry.key);
      if (cached?.checksum === entry.checksum && cached.version === entry.version) return;

      const packageResponse = await fetch(entry.downloadUrl);
      if (!packageResponse.ok) throw new Error(`content package unavailable: ${entry.key}`);
      const body = (await packageResponse.json()) as ContentPackageEnvelope<unknown>;
      writeCachedPackage({
        key: entry.key,
        version: entry.version,
        checksum: entry.checksum,
        payload: body.payload,
      });
    })
  );
}

export async function getSyncedPackage<T>(
  key: string,
  options: { grade: number; subject?: string; fallback: T }
): Promise<T> {
  const cachedBeforeSync = readCachedPackage<T>(key);

  try {
    await syncContentPackages(options.grade, options.subject);
    return readCachedPackage<T>(key)?.payload ?? cachedBeforeSync?.payload ?? options.fallback;
  } catch {
    return cachedBeforeSync?.payload ?? options.fallback;
  }
}
