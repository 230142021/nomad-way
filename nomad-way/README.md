# Nomad Way — Your Journey Begins Here

Двуязычный (EN/RU) туристический сайт о Кыргызстане, сделанный по ТЗ «Technical Requirements — Nomad Way Website».

**Стек (по ТЗ, раздел 9):** HTML · CSS · JavaScript (фронтенд) · Node.js + Express (бэкенд) · PostgreSQL (БД) · Leaflet.js (карта) · JSON-файлы переводов (EN/RU).

---

## Быстрый старт

```bash
npm install
cp .env.example .env          # укажите DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET
createdb nomad_way            # или создайте БД в pgAdmin
npm run db:seed               # создаёт таблицы, 23 направления, 8 шаблонов маршрутов и админа
npm start                     # http://localhost:3000
```

Админ-панель: `http://localhost:3000/#/admin` (логин/пароль из `.env`).

**Без PostgreSQL** (для быстрой демонстрации): оставьте `DATABASE_URL` пустым — сервер сохранит данные в `data/db.json`.

**Совсем без сервера:** `npm run build:static` собирает один файл `dist/nomad-way-demo.html`, который открывается двойным кликом. В этом режиме данные админки, избранное и сообщения хранятся в браузере (демо-вход: `admin` / `admin123`).

---

## Структура проекта

```
nomad-way/
├── public/                 # Фронтенд (SPA)
│   ├── index.html
│   ├── css/style.css       # Дизайн: палитра и шрифты из ТЗ (раздел 8)
│   ├── js/app.js           # Роутер и все страницы
│   ├── js/api.js           # Работа с REST API (или с localStorage в демо-режиме)
│   ├── js/planner.js       # Движок Trip Planner (общий для браузера и сервера)
│   ├── js/scenes.js        # SVG-иллюстрации пейзажей (если у места нет фото)
│   ├── i18n/en.json, ru.json   # Переводы
│   └── data/destinations.json, routes.json   # Исходные данные для сидера
├── server/
│   ├── index.js            # Express-приложение
│   ├── routes/public.js    # Публичное API
│   ├── routes/admin.js     # API администратора (с авторизацией)
│   ├── auth.js             # scrypt-хэши паролей + подписанные токены
│   ├── validate.js         # Валидация входных данных
│   └── storage/            # postgres.js (основное) и jsonfile.js (запасное)
├── db/schema.sql           # Схема PostgreSQL
├── db/seed.js              # Заполнение БД
└── scripts/build-static.js # Сборка автономной демо-версии
```

## Страницы (ТЗ, раздел 4)

| Маршрут | Страница |
|---|---|
| `#/` | Главная: hero, поиск, популярные места, категории, рекомендуемые маршруты |
| `#/explore` | Каталог: поиск по названию + фильтры по региону, категории, сезону, сложности |
| `#/destination/:slug` | Детали: фотогалерея (лайтбокс), описание, занятия, советы, мини-карта |
| `#/map` | Интерактивная карта Leaflet с кликабельными маркерами |
| `#/planner` | Trip Planner: длительность, интересы, сезон, стиль → маршрут по дням + карта |
| `#/guide` | Путеводитель: транспорт, сезоны, культура, полезная информация |
| `#/about` | О Кыргызстане |
| `#/favorites` | Избранное (localStorage) |
| `#/contact` | Форма обратной связи и соцсети |
| `#/admin` | Панель администратора |

## API (ТЗ, раздел 9)

| Метод | Endpoint | Назначение |
|---|---|---|
| GET | `/api/destinations` | Список (поддерживает `?q=&region=&category=&season=&difficulty=`) |
| GET | `/api/destinations/:slug` | Детали направления |
| GET | `/api/routes` | Шаблоны маршрутов |
| POST | `/api/planner` | Сгенерировать маршрут `{duration, interests[], season, style}` |
| POST | `/api/contact` | Отправить сообщение |
| POST | `/api/admin/login` | Вход администратора → `{token}` |
| POST | `/api/admin/destinations` | Добавить направление 🔒 |
| PUT | `/api/admin/destinations/:slug` | Изменить направление 🔒 |
| DELETE | `/api/admin/destinations/:slug` | Удалить направление 🔒 |
| PUT | `/api/admin/routes` | Обновить шаблоны маршрутов 🔒 |
| GET | `/api/admin/messages` | Сообщения из формы 🔒 |

🔒 — заголовок `Authorization: Bearer <token>`.

## Соответствие требованиям (раздел 7)

| ID | Требование | Где реализовано |
|---|---|---|
| FR-01 | Адаптивная главная | `pageHome`, медиа-запросы в `style.css` |
| FR-02 | Переключение EN/RU | `i18n/*.json`, переключатель в шапке (выбор запоминается) |
| FR-03 | Каталог и детали | `#/explore`, `#/destination/:slug` — 23 направления |
| FR-04 | Поиск и фильтры | `filterDestinations` + `GET /api/destinations?...` |
| FR-05 | Интерактивная карта | Leaflet + OpenStreetMap, `#/map` |
| FR-06 | Trip Planner | `js/planner.js`, `POST /api/planner` |
| FR-07 | Избранное в браузере | localStorage `nw_favorites` |
| FR-08 | Фотогалереи | Галерея + лайтбокс (←/→/Esc) |
| FR-09 | Путеводитель и контакты | `#/guide`, `#/about`, `#/contact` |
| FR-10 | Вход и редактирование админом | `#/admin`, `/api/admin/*` |
| FR-11 | Сохранение маршрутов (S) | «Сохранить маршрут» → localStorage |
| FR-12 | Экспорт маршрута в PDF (S) | «Экспорт в PDF» → печать в PDF с отдельной print-вёрсткой |

## Фотографии

У направлений есть поле `images` — в админке вставьте ссылки на фото (по одной в строке), и они заменят встроенные SVG-иллюстрации в карточках, галерее и на карте.

## Фотографии

Все фото мест взяты с Wikimedia Commons (свободные лицензии CC). Ссылки и авторы лежат в `public/data/destinations.json` (поля `images` и `credits`) и показываются под галереей каждого места. Если фото не загрузилось (например, нет интернета), вместо него автоматически подставляется иллюстрация. Свои фото можно поставить через админку.

## Telegram

- Каждое сообщение из формы обратной связи пересылается в Telegram владельцу сайта. Для этого задайте переменные `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` (инструкция в `.env.example`).
- Кнопка Telegram в углу каждой страницы и на странице контактов ведёт на @playc4u.
- В планировщике готовый маршрут можно отправить в Telegram кнопкой «Отправить в Telegram».

## Деплой на Render

В корне репозитория лежит `render.yaml` (код в папке `nomad-way`, на неё указывает `rootDir`). Render по нему создаёт базу PostgreSQL и веб-сервис.

1. На render.com: **New → Blueprint**, выберите репозиторий.
2. Введите `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
3. **Deploy Blueprint**. При запуске сервер сам создаёт таблицы и заполняет базу.

Бесплатный сервис засыпает после 15 минут без посещений, а бесплатная база Render живёт 30 дней. Повторный запуск сидера не затирает правки из админки (он только добавляет недостающее, включая фото). Чтобы сбросить контент к исходному, выполните `npm run db:seed -- --force`.
