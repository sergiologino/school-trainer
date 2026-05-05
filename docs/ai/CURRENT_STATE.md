# Текущее состояние

## Репозиторий

Монорепозиторий `1_school learning` (npm workspaces):

- `frontend` — единое PWA/React (Vite, Tailwind 4): оболочка + три предметных модуля в `frontend/src/subjects/{math,english,russian}` (скопированы из старых PWA и подключены к общему роутингу).
- `backend` — Fastify 5 + SQLite (`better-sqlite3`), один процесс (`npm run dev -w backend`).

## Авторизация и навигация

- Общая сессия ученика: `frontend/src/store/useUnifiedStore.ts` (persist `school-trainer-session`), экран входа `shell/LoginPage.tsx`, выбор предмета `shell/HubPage.tsx`.
- Переход «К предметам» закреплён над каждым модулем (`shell/*Portal.tsx`). Внутренние Zustand-сторы предметов при входе синхронизируются с unified-пользователем.

## Контент и БД

- Пайплайн: `backend/scripts/extract-client-bundles.mjs` читает данные из `frontend/src/subjects/...`, дополняет расширенным материалом и пишет JSON в `backend/content/_generated/` и legacy-копию `backend/src/content/_generated/`.
- Сид SQLite: `backend/src/seed.ts` заполняет legacy `curriculum_topic`/`content_bundle`, а также новый canonical слой `subject`, `grade`, `content_item`, `content_package`.
- Offline-first API: `/api/content/manifest` отдаёт published packages с `version`, `checksum`, `sizeBytes`, `downloadUrl`; `/api/content/packages/:key` отдаёт JSON-пакет. Web-клиент кеширует пакеты через `frontend/src/content/contentSync.ts`, mobile должен использовать тот же контракт и хранить пакеты в локальной SQLite.
- Интерактивные уроки по новым темам математики (проценты, периметр/площадь, среднее): теория `Grade5ExtrasLesson.tsx`, тесты генерируются в `questions.ts`.
- Если API недоступен: математика использует локальный `data/topics.ts` (совпадает с сидом); русские/английские экраны — локальные массивы из `data/`, затем при успешном запросе подменяются ответом API.

### Английский язык — стабильность заданий при вводе

- В диктантах английского набор слов/предложений фиксируется на время сессии через `useMemo`; ввод в `input`/`textarea` не должен менять текущий вопрос.
- В словарных и глагольных quiz-вариантах ответы также фиксируются на текущий вопрос, чтобы выбор/изменение состояния не перетасовывали варианты.
- Регрессия покрыта тестом `frontend/src/subjects/english/sections/DictationSection.test.tsx`.

### Русский язык — адаптивные повторения

- Логика весов и порядка: `frontend/src/subjects/russian/lib/russianAdaptive.ts` (тесты `russianAdaptive.test.ts`).
- Статистика и persist: поле `russianPracticeStats` в `frontend/src/subjects/russian/store/useStore.ts`; запись после ответа/таймаута — `QuizGame.tsx`, после проверки предложений — `DictantGame.tsx`.
- Ключи элементов практики: `mcq|{taskId}|{questionId}` и `dict|{dictantId}|{sentenceIndex}`; порядок вопросов/предложений — внутри сессии, новый порядок при «Ещё раз» через локальный счётчик сессии (`sessionKey`).

## Эндпоинты HTTP

См. `docs/ai/domains/content.md`.

## Сборка и тесты

- Корень: `npm run dev` — параллельно backend и frontend не настроены в одном скрипте без `concurrently` в установленном виде уже есть — запускать в двух терминалах или `npm run dev` если подключены оба workspaces (пользователь уже имеет concurrently в root package.json).
- `npm run build`: backend `tsc` + frontend `vite build`.
- `npm test`: backend `node --test`, frontend `vitest run`.

## Не реализовано (следующие шаги)

- Отдельный админ-редактор контента и авторизация API (сейчас контент задаётся сидом/файлами).
- Связка прогресса с backend (локальный прогресс остаётся в Zustand по предметам).
- CI-файл под выбранный хостинг.
