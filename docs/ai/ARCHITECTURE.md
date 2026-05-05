# Архитектура

## Принцип

Монорепозиторий в корне проекта `1_school learning` с разделением:

- **Frontend** — одно приложение (`frontend/`): модули `src/subjects/{math,english,russian}`, общая оболочка (`src/shell/`), общий вход `src/main.tsx`.
- **Backend** (`backend/`) — один HTTP-сервис **API контента** (SQLite), готовность к добавлению API прогресса и учётных записей без смены URL-префикса `/api/`.

## Стек реализации (фактический)

| Слой | Технологии |
|------|-------------|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4, React Router 7, Zustand, Framer Motion |
| Backend | Node.js, Fastify 5, better-sqlite3, TypeScript (ESM) |

## Данные

- **Учебный контент**: canonical слой `subject`, `grade`, `content_item`, `content_package`; legacy-таблицы `curriculum_topic` и `content_bundle` сохранены для обратной совместимости текущих endpoints. Заполнение через сид после генерации артефактов (`backend/scripts/extract-client-bundles.mjs` → `backend/content/_generated/`).
- **Offline для web/mobile**: backend публикует версионированные JSON-пакеты через `/api/content/manifest` и `/api/content/packages/:key`. Web кеширует пакеты локально через `frontend/src/content/contentSync.ts`; mobile должен хранить эти же пакеты в локальной SQLite и использовать тот же checksum/version контракт.
- Часть **интерактивной математики** генерируется на клиенте по правилам (как раньше в PWA); перечень тем и метаданные уроков приходят с `/api/topics` после сидирования из БД.
- **Прогресс** пока в локальных Zustand-сторах по предметам; вынос на backend — следующий шаг.

## Интеграция с Altakid (перспектива)

Клиент приложения AltaKid в WebView/Android потребляет **те же HTTPS API** `/api/*`, что и веб (см. `docs/ai/domains/content.md`).

## Взаимодействие сервисов

```
Browser / Altakid WebView
        │
        ▼
   Frontend (SPA/PWA)  ──►  прокси /api → dev backend
        │
        HTTPS (/api/*)
        ▼
   Backend API ──► SQLite (контент)
```

Подробнее о контракте контента см. `docs/ai/domains/content.md`; актуальный фактический статус см. `CURRENT_STATE.md`.
