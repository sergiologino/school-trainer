# История изменений (AI-память)

Кратко, 1–3 строки на запись.

- **2026-05-03** — Инициализированы `docs/ai/*`: обзор, архитектура, состояние, решения, конвенции. Репозиторий кода в каталоге проекта пока отсутствует.
- **2026-05-03** — Создан монорепо: объединённые три PWA в `frontend`, backend SQLite+seed+API контента 5 класса, математика с новыми темами и генераторами вопросов, автотесты backend+vitest frontend, обновлена доменная заметка `domains/content.md`.
- **2026-05-06** — Добавлен offline-first content storage: таблицы `subject`, `grade`, `content_item`, `content_package`, API `/api/content/manifest` и `/api/content/packages/:key`, web sync cache `contentSync.ts`, тесты backend/frontend и обновление документации контракта.
- **2026-05-06** — Исправлен UI-баг английских диктантов/quiz: ввод ответа больше не перетасовывает текущий вопрос или варианты; добавлен regression test.
