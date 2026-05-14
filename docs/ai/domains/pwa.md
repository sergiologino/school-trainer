# PWA и профиль ученика

## Контракт PWA

- Web-клиент является installable PWA: `frontend/index.html` подключает `/manifest.webmanifest`, а `frontend/src/main.tsx` регистрирует service worker `/sw.js`.
- Service worker кеширует app shell, navigation fallback на `/index.html`, публичные ассеты manifest/icon/mascot и offline-first ответы `/api/content/*`.
- Контентные JSON-пакеты остаются главным offline-источником учебных данных; service worker только добавляет сетевой fallback поверх существующего `frontend/src/content/contentSync.ts`.
- PWA registration должен быть best-effort: ошибка регистрации service worker не должна ломать запуск приложения.

## Аватар

- Источник истины для выбранного аватара ученика: `frontend/src/store/useUnifiedStore.ts`, persist key `school-trainer-session`.
- Список доступных аватаров хранится в `frontend/src/store/profile.ts`.
- Предметные store получают аватар из unified session через `shell/*Portal.tsx`. Если предметный экран меняет аватар, он обязан обновить unified profile, чтобы hub и остальные предметы показывали тот же аватар.

## Рейтинг

- Текущие рейтинги предметов являются общими моковыми leaderboard-списками с добавлением текущего ученика в общий список.
- Нельзя создавать отдельный "персональный" fake leaderboard на каждого пользователя. При появлении backend progress API рейтинг должен перейти на серверный агрегат.

