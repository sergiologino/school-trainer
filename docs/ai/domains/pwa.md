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

- Источник истины для общего рейтинга между реальными пользователями: backend API `/api/leaderboard`.
- Клиент отправляет предметный score через `POST /api/leaderboard/score` с `userId`, `subject`, `name`, `avatar`, `score`, `level`, `streak`.
- Предметные экраны рейтинга читают общий список через `GET /api/leaderboard?subject=math|russian|english`.
- Hub читает общий агрегат через `GET /api/leaderboard?subject=global`; backend суммирует очки пользователя по всем предметам.
- Локальные моковые leaderboard-списки остаются только fallback для offline/dev, когда backend недоступен.
- Нельзя создавать отдельный "персональный" fake leaderboard на каждого пользователя: два реальных пользователя одного backend должны видеть друг друга после успешной синхронизации score.

## Share

- На hub должна быть явная команда "Поделиться приложением".
- Web использует `navigator.share`, если доступен; fallback копирует ссылку на приложение в clipboard.

## Нижняя навигация

- Предметы должны придерживаться единого порядка нижнего меню: `Главная`, `Учёба`, `Задания`, `Рейтинг`, `Профиль`.
- Предмет может маппить эти пункты на свои внутренние экраны, но порядок и смысл пунктов не должны расходиться между предметами.

## Достижения

- Заблокированное достижение не может показываться только как "заблокировано": рядом должно быть короткое условие получения.
- Экран профиля и экран рейтинга/достижений должны использовать одинаковые условия для одного и того же достижения.

