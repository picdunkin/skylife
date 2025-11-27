# Quests Service — Полная документация

Сервис управления квестами, актами, сайдквестами, задачами (objectives) и метриками.

**База данных**: Firebase Firestore (без миграции на MySQL на данном этапе).

---

## 1. Обзор

Quests Service отвечает за:

- CRUD операции для **Актов** (Acts)
- CRUD операции для **Квестов** (Quests) внутри актов
- CRUD операции для **Сайдквестов** (Sidequests)
- Управление **задачами** (Objectives) и **метриками** (Metrics) квестов
- Логику **завершения квестов** и расчёт наград
- Логику **разблокировки актов**

---

## 2. Доменные сущности

### 2.1 Act (Акт)

Акт — это группа связанных квестов, представляющая этап или главу в жизни пользователя.

```typescript
interface Act {
  id: string;              // "act-1", "act-1732712345678"
  title: string;           // "АКТ I: ВЫЖИВАНИЕ"
  dateRange: string;       // "ДЕК 2025 – ФЕВ 2026"
  description: string;     // Описание акта
  quests: Quest[];         // Вложенные квесты
}
```

**Правила**:
- Первый акт (`act-1`) всегда разблокирован.
- Следующий акт разблокируется только после завершения **всех** квестов предыдущего акта.

### 2.2 Quest (Квест)

Квест — основная единица прогресса, содержащая задачи и метрики.

```typescript
interface Quest {
  id: string;              // "q-resume", "q-1732712345678"
  title: string;           // "Мастер Резюме"
  description: string;     // Подробное описание
  objectives: Objective[]; // Чекбокс-задачи
  metrics: Metric[];       // Числовые метрики
  rewards: string[];       // Текстовые награды ["Легендарный документ"]
}
```

### 2.3 Objective (Задача)

Булевая задача внутри квеста (чекбокс).

```typescript
interface Objective {
  id: string;              // "obj-remove-ambition"
  text: string;            // "Полностью удалить амбициозные формулировки"
  type: "boolean";         // Всегда "boolean"
}
```

**Состояние задач** хранится отдельно в `gameState.objectives`:

```typescript
objectives: {
  "obj-remove-ambition": true,
  "obj-keywords": false
}
```

### 2.4 Metric (Метрика)

Числовой счётчик внутри квеста.

```typescript
interface Metric {
  id: string;              // "m-applications"
  label: string;           // "Отправлено резюме"
  target: number;          // 30 (целевое значение)
  type: "limited" | "unlimited";
}
```

- **limited**: имеет конечную цель (прогресс-бар до `target`)
- **unlimited**: счётчик без верхней границы (`target: 0`)

**Состояние метрик** хранится в `gameState.metrics`:

```typescript
metrics: {
  "m-applications": 15,
  "m-interviews": 2
}
```

### 2.5 Sidequest (Сайдквест)

Лёгкая задача, не привязанная к актам.

```typescript
interface Sidequest {
  id: string;              // "sq-1732712345678"
  title: string;           // "Купить молоко"
  completed: boolean;
  createdAt: string;       // ISO timestamp
}
```

---

## 3. Состояние (State)

Текущее состояние квестовой системы хранится в Firestore документе пользователя (`users/{uid}`):

```typescript
interface QuestState {
  acts: Act[];                    // Все акты с вложенными квестами
  completedQuestIds: string[];    // ["q-resume", "q-contract"]
  unlockedActIds: string[];       // ["act-1"] (deprecated, вычисляется динамически)
  objectives: Record<string, boolean>;  // Состояние чекбоксов
  metrics: Record<string, number>;      // Состояние метрик
  sidequests: Sidequest[];
}
```

---

## 4. API Endpoints

### 4.1 Acts

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | `/api/acts` | Получить все акты пользователя |
| GET | `/api/acts/{actId}` | Получить конкретный акт |
| POST | `/api/acts` | Создать новый акт |
| PUT | `/api/acts/{actId}` | Обновить акт |
| DELETE | `/api/acts/{actId}` | Удалить акт (и все его квесты) |

#### POST /api/acts

**Request:**
```json
{
  "title": "АКТ VI: НОВЫЕ ГОРИЗОНТЫ",
  "dateRange": "ЯНВ 2027 – МАР 2027",
  "description": "Расширение возможностей"
}
```

**Response:**
```json
{
  "id": "act-1732712345678",
  "title": "АКТ VI: НОВЫЕ ГОРИЗОНТЫ",
  "dateRange": "ЯНВ 2027 – МАР 2027",
  "description": "Расширение возможностей",
  "quests": []
}
```

#### DELETE /api/acts/{actId}

При удалении акта:
1. Удаляются все квесты внутри акта
2. Удаляются `completedQuestIds` для этих квестов
3. Удаляются связанные `objectives` и `metrics`

---

### 4.2 Quests

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | `/api/acts/{actId}/quests` | Получить все квесты акта |
| GET | `/api/quests/{questId}` | Получить квест по ID |
| POST | `/api/acts/{actId}/quests` | Создать квест в акте |
| PUT | `/api/quests/{questId}` | Обновить квест |
| DELETE | `/api/quests/{questId}` | Удалить квест |
| POST | `/api/quests/{questId}/complete` | Завершить квест |

#### POST /api/acts/{actId}/quests

**Request:**
```json
{
  "title": "Новый Квест",
  "description": "Описание квеста",
  "objectives": [
    { "text": "Задача 1" },
    { "text": "Задача 2" }
  ],
  "metrics": [
    { "label": "Счётчик", "target": 10, "type": "limited" }
  ],
  "rewards": ["Награда 1", "Награда 2"]
}
```

**Response:**
```json
{
  "id": "q-1732712345678",
  "title": "Новый Квест",
  "description": "Описание квеста",
  "objectives": [
    { "id": "obj-1732712345678", "text": "Задача 1", "type": "boolean" },
    { "id": "obj-1732712345679", "text": "Задача 2", "type": "boolean" }
  ],
  "metrics": [
    { "id": "m-1732712345678", "label": "Счётчик", "target": 10, "type": "limited" }
  ],
  "rewards": ["Награда 1", "Награда 2"]
}
```

#### POST /api/quests/{questId}/complete

Завершает квест и начисляет награды.

**Request:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "rewards": {
    "xp": 1000,
    "money": 100
  },
  "levelUp": false,
  "newLevel": 5
}
```

**Бизнес-логика:**
1. Проверить, что акт квеста разблокирован
2. Проверить, что квест ещё не завершён
3. Добавить `questId` в `completedQuestIds`
4. Рассчитать награду: `BASE_XP * 10`, `BASE_MONEY * 10`
5. Обновить `globalXP`, `globalLevel`, `money` в Users Service
6. Вернуть информацию о награде

---

### 4.3 Objectives

| Method | Endpoint | Описание |
|--------|----------|----------|
| POST | `/api/objectives/{objectiveId}/toggle` | Переключить состояние задачи |

#### POST /api/objectives/{objectiveId}/toggle

**Request:**
```json
{}
```

**Response:**
```json
{
  "objectiveId": "obj-remove-ambition",
  "completed": true,
  "rewards": {
    "xp": 250,
    "money": 10
  }
}
```

**Бизнес-логика:**
- При отметке задачи (false → true): начислить XP и деньги
- При снятии отметки (true → false): не снимать награды (уже получены)

---

### 4.4 Metrics

| Method | Endpoint | Описание |
|--------|----------|----------|
| PUT | `/api/metrics/{metricId}` | Обновить значение метрики |

#### PUT /api/metrics/{metricId}

**Request:**
```json
{
  "value": 15
}
```

**Response:**
```json
{
  "metricId": "m-applications",
  "value": 15,
  "rewards": {
    "xp": 100,
    "money": 10
  }
}
```

**Бизнес-логика:**
- Каждое изменение метрики даёт награду (даже уменьшение — это трекинг)
- Награда: `BASE_XP * 1`, `BASE_MONEY * 1`

---

### 4.5 Sidequests

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | `/api/sidequests` | Получить все сайдквесты |
| POST | `/api/sidequests` | Создать сайдквест |
| POST | `/api/sidequests/{id}/toggle` | Переключить статус |
| DELETE | `/api/sidequests/{id}` | Удалить сайдквест |

#### POST /api/sidequests

**Request:**
```json
{
  "title": "Купить молоко"
}
```

**Response:**
```json
{
  "id": "sq-1732712345678",
  "title": "Купить молоко",
  "completed": false,
  "createdAt": "2025-11-27T09:30:00.000Z"
}
```

#### POST /api/sidequests/{id}/toggle

**Response:**
```json
{
  "id": "sq-1732712345678",
  "completed": true,
  "rewards": {
    "xp": 1000,
    "money": 100
  }
}
```

**Бизнес-логика:**
- Награда за завершение сайдквеста = награда за квест (`QUEST` type)

---

### 4.6 Act Unlock Check

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | `/api/acts/{actId}/unlocked` | Проверить, разблокирован ли акт |

**Response:**
```json
{
  "actId": "act-2",
  "unlocked": true,
  "reason": "All quests in act-1 completed"
}
```

**Логика разблокировки:**
```javascript
function isActUnlocked(actId, acts, completedQuestIds) {
  if (actId === 'act-1') return true;
  
  const actIndex = acts.findIndex(act => act.id === actId);
  if (actIndex <= 0) return true;
  
  const previousAct = acts[actIndex - 1];
  return previousAct.quests.every(quest => 
    completedQuestIds.includes(quest.id)
  );
}
```

---

## 5. Константы и правила наград

```javascript
// gameRules.js
export const BASE_XP = 100;
export const BASE_MONEY = 10;

export const REWARD_TYPES = {
  METRIC: { xpMultiplier: 1, moneyMultiplier: 1 },      // 100 XP, 10 🪙
  CHECKBOX: { xpMultiplier: 2.5, moneyMultiplier: 1 },  // 250 XP, 10 🪙
  QUEST: { xpMultiplier: 10, moneyMultiplier: 10 },     // 1000 XP, 100 🪙
};
```

---

## 6. Firestore структура

### Collection: `users`

Document ID: `{firebase_uid}`

```json
{
  "acts": [
    {
      "id": "act-1",
      "title": "АКТ I: ВЫЖИВАНИЕ",
      "dateRange": "ДЕК 2025 – ФЕВ 2026",
      "description": "...",
      "quests": [
        {
          "id": "q-resume",
          "title": "Мастер Резюме",
          "description": "...",
          "objectives": [
            { "id": "obj-remove-ambition", "text": "...", "type": "boolean" }
          ],
          "metrics": [
            { "id": "m-applications", "label": "...", "target": 30, "type": "limited" }
          ],
          "rewards": ["..."]
        }
      ]
    }
  ],
  "completedQuestIds": ["q-resume"],
  "unlockedActIds": ["act-1"],
  "objectives": {
    "obj-remove-ambition": true
  },
  "metrics": {
    "m-applications": 15
  },
  "sidequests": [
    {
      "id": "sq-123",
      "title": "...",
      "completed": false,
      "createdAt": "..."
    }
  ],
  "globalXP": 5000,
  "globalLevel": 3,
  "money": 500
}
```

---

## 7. Интеграция с другими сервисами

### 7.1 Users Service

При завершении квеста/сайдквеста/задачи Quests Service должен:

1. Вызвать Users Service для обновления `globalXP`, `globalLevel`, `money`
2. Или напрямую обновить Firestore (текущая реализация)

**Вариант A (текущий):** Quests Service напрямую пишет в Firestore.

**Вариант B (будущий):** 
```
POST /api/users/{uid}/add-rewards
{
  "xp": 1000,
  "money": 100,
  "source": "quest_complete",
  "sourceId": "q-resume"
}
```

### 7.2 Auth Service

- Quests Service получает `user_id` из JWT токена, выданного Auth Service
- Все операции привязаны к конкретному пользователю

---

## 8. Валидация

### 8.1 Создание квеста

- `title`: обязательно, 1-200 символов
- `description`: опционально, до 2000 символов
- `objectives`: массив, каждый элемент имеет `text` (1-500 символов)
- `metrics`: массив, каждый элемент имеет `label`, `target` (≥0), `type`
- `rewards`: массив строк

### 8.2 Завершение квеста

- Акт должен быть разблокирован
- Квест не должен быть уже завершён

### 8.3 Toggle objective

- Акт квеста должен быть разблокирован

---

## 9. Примеры использования (Frontend)

### Текущая реализация (React hooks)

```javascript
// useQuests.js
const completeQuest = (questId, event) => {
  if (gameState.completedQuestIds.includes(questId)) return;
  
  const { xp, money } = calculateGlobalReward('QUEST');
  const { newXp, newLevel, leveledUp } = calculateLevelUp(
    gameState.globalXP + xp, 
    gameState.globalLevel
  );
  
  saveState({
    ...gameState,
    completedQuestIds: [...gameState.completedQuestIds, questId],
    globalXP: newXp,
    globalLevel: newLevel,
    money: gameState.money + money
  });
};
```

### Будущая реализация (API calls)

```javascript
// questsApi.js
export const completeQuest = async (questId) => {
  const response = await fetch(`${API_URL}/quests/${questId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

---

## 10. План миграции

### Этап 1: API без изменения хранилища
1. Создать Laravel Quests Service
2. Реализовать все endpoints
3. Сервис читает/пишет в Firestore через Firebase Admin SDK
4. Frontend переключается на API вместо прямых Firestore вызовов

### Этап 2: Добавление кеширования
1. Redis для кеширования актов и квестов
2. Инвалидация кеша при изменениях

### Этап 3 (опционально): Миграция на MySQL
1. Создать MySQL схему
2. Миграция данных из Firestore
3. Переключение сервиса на MySQL
4. Firestore остаётся для real-time sync (опционально)

---

## 11. Laravel структура (планируемая)

```
services/quests/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── ActController.php
│   │   │   ├── QuestController.php
│   │   │   ├── ObjectiveController.php
│   │   │   ├── MetricController.php
│   │   │   └── SidequestController.php
│   │   ├── Requests/
│   │   │   ├── CreateActRequest.php
│   │   │   ├── CreateQuestRequest.php
│   │   │   └── ...
│   │   └── Middleware/
│   │       └── FirebaseAuth.php
│   ├── Services/
│   │   ├── ActService.php
│   │   ├── QuestService.php
│   │   ├── RewardService.php
│   │   └── FirestoreService.php
│   └── Models/
│       └── (не используются при Firestore)
├── config/
│   └── firebase.php
├── routes/
│   └── api.php
└── ...
```

---

## 12. Зависимости

### Composer packages

```json
{
  "require": {
    "kreait/laravel-firebase": "^5.0",
    "laravel/sanctum": "^3.0"
  }
}
```

### Environment variables

```env
FIREBASE_CREDENTIALS=/app/storage/firebase-credentials.json
FIREBASE_PROJECT_ID=skylife-xxxxx
```
