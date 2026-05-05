# Домен: учебный контент и API

## Назначение

Поставлять программу 5 класса (перспектива — другие параллели) без захардкоженной «истины» в клиентском коде для списков тем и крупных бандлов заданий.

## Репрезентация данных

| Хранилище | Назначение |
|-----------|-------------|
| `curriculum_topic` | Темы математики по `subject_slug` + `grade`, поле `lessons_json`. |
| `content_bundle` | Ключ→JSON: `russian_grade5` (tasks + dictants), `english_vocab_grade5` ({ words }). |
| `subject` | Справочник предметов (`math`, `russian`, `english`), расширяемый под новые предметы. |
| `grade` | Справочник школьных классов, сейчас сидируются 4-11. |
| `content_item` | Нормализованный опубликованный элемент контента: тема, задание, диктант, слово, будущий экзаменационный вопрос. Основные поля: `subject_slug`, `grade`, `kind`, `version`, `payload_json`, `checksum`. |
| `content_package` | Версионированный offline-пакет для web/mobile sync. Пакет имеет `key`, `subject_slug`, `grade`, `package_type`, `format`, `version`, `checksum`, `size_bytes`, `payload_json`. |

`curriculum_topic` и `content_bundle` оставлены как совместимый legacy API для текущих экранов. Новый контракт для роста контента и offline-first клиентов — `content_item` + `content_package`.

## HTTP

- `GET /api/health` — проверка.
- `GET /api/topics?subject=math&grade=5` — массив тем в форме фронтендовского `Topic` (поле `bgGradient`).
- `GET /api/bundle/russian` — объект `{ tasks, dictants }`.
- `GET /api/bundle/english` — объект `{ words }`.
- `GET /api/content/manifest?grade=5&subject=math&platform=web|mobile` — список опубликованных пакетов с версиями, checksum, размером и `downloadUrl`.
- `GET /api/content/packages/:key` — JSON-пакет с envelope `{ key, subject, grade, type, format, payload }`; заголовки `etag` и `x-content-version` помогают клиенту кешировать пакет.

## Offline sync

Канонический поток для web и mobile:

1. Клиент запрашивает manifest по классу и, при необходимости, предмету.
2. Клиент сравнивает `version` + `checksum` с локальным кешем.
3. Изменившиеся пакеты скачиваются через `/api/content/packages/:key`.
4. Web хранит JSON-пакеты в локальном кеше (`frontend/src/content/contentSync.ts`); mobile должен хранить те же пакеты в локальной SQLite.
5. Пользовательский прогресс хранится отдельно от контента и должен ссылаться на `content_item.id` и версию/пакет, чтобы исправления контента не портили историю попыток.

## Гибрид

Генерируемые по правилам задания (таблица умножения, дроби и т.д.) остаются в клиенте; список тем и метаданные уроков — из БД после сидирования из извлечённых описаний + расширений в скрипте извлечения.
