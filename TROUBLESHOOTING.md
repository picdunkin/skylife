# 🔧 Решение проблем с Google авторизацией

## Проблема: Авторизация Google "вылетает" сразу при вызове

### Возможные причины и решения:

---

## ✅ 1. Проверьте настройки Firebase Console

### Шаг 1: Включите Google Authentication
1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект
3. Перейдите в **Authentication** → **Sign-in method**
4. Найдите **Google** в списке провайдеров
5. Убедитесь, что он **ВКЛЮЧЕН** (Enabled)
6. Если выключен - нажмите на него и включите
7. Укажите **Support email** (ваш email)
8. Сохраните

### Шаг 2: Добавьте Authorized domains
1. В том же разделе **Authentication** → **Settings** → **Authorized domains**
2. Убедитесь, что добавлены:
   - `localhost` (для локальной разработки)
   - Ваш будущий домен Vercel (после деплоя)

---

## ✅ 2. Проверьте переменные окружения

### Убедитесь, что `.env` файл заполнен правильно:

```bash
# Откройте .env файл и проверьте все значения
cat .env
```

**Все переменные должны быть заполнены реальными значениями из Firebase Console:**

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект
3. Перейдите в **Project Settings** (⚙️ иконка)
4. Прокрутите вниз до раздела **Your apps**
5. Если нет веб-приложения - создайте его (кнопка `</>`)
6. Скопируйте значения из `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // → VITE_FIREBASE_API_KEY
  authDomain: "xxx.firebaseapp.com", // → VITE_FIREBASE_AUTH_DOMAIN
  projectId: "xxx",                  // → VITE_FIREBASE_PROJECT_ID
  storageBucket: "xxx.appspot.com",  // → VITE_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456",       // → VITE_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc"            // → VITE_FIREBASE_APP_ID
};
```

### ⚠️ ВАЖНО: После изменения `.env` - перезапустите dev сервер!

```bash
# Остановите текущий сервер (Ctrl+C)
# Запустите заново:
npm run dev
```

---

## ✅ 3. Проверьте консоль браузера

Откройте DevTools (F12) и проверьте вкладку **Console** на наличие ошибок:

### Типичные ошибки и решения:

#### Ошибка: `auth/configuration-not-found`
**Решение:** Google Authentication не включен в Firebase Console (см. пункт 1)

#### Ошибка: `auth/unauthorized-domain`
**Решение:** Добавьте `localhost` в Authorized domains (см. пункт 1, шаг 2)

#### Ошибка: `auth/invalid-api-key`
**Решение:** Проверьте правильность `VITE_FIREBASE_API_KEY` в `.env`

#### Ошибка: `Firebase: Error (auth/popup-blocked)`
**Решение:** Браузер блокирует всплывающие окна. Разрешите popup для localhost

#### Ошибка: `Firebase: Error (auth/popup-closed-by-user)`
**Решение:** Пользователь закрыл окно авторизации - это нормально

---

## ✅ 4. Альтернатива: Используйте Redirect вместо Popup

Если popup не работает, можно использовать redirect метод:

### Измените `src/context/GameContext.jsx`:

```javascript
// Вместо:
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Используйте:
import { signInWithRedirect, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';

// И измените функцию login:
const login = () => signInWithRedirect(auth, googleProvider);

// Добавьте useEffect для обработки redirect:
useEffect(() => {
    getRedirectResult(auth)
        .then((result) => {
            if (result) {
                console.log('User signed in:', result.user);
            }
        })
        .catch((error) => {
            console.error('Redirect error:', error);
        });
}, []);
```

---

## ✅ 5. Проверьте Firestore правила

Убедитесь, что правила Firestore разрешают чтение/запись:

1. Откройте Firebase Console → **Firestore Database** → **Rules**
2. Установите правила (для разработки):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Нажмите **Publish**

---

## 🔍 Диагностический скрипт

Создайте файл `src/test-firebase.js` для проверки конфигурации:

```javascript
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

console.log('Firebase Config Check:');
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');

// Test auth
signInWithPopup(auth, googleProvider)
    .then((result) => {
        console.log('✅ Auth successful:', result.user.email);
    })
    .catch((error) => {
        console.error('❌ Auth failed:', error.code, error.message);
    });
```

Импортируйте его временно в `App.jsx`:
```javascript
import './test-firebase';
```

---

## 📋 Чек-лист быстрой проверки

- [ ] Google Authentication включен в Firebase Console
- [ ] `localhost` добавлен в Authorized domains
- [ ] Все переменные в `.env` заполнены правильными значениями
- [ ] Dev сервер перезапущен после изменения `.env`
- [ ] Консоль браузера открыта для просмотра ошибок
- [ ] Popup окна не блокируются браузером
- [ ] Firestore правила настроены

---

## 🆘 Если ничего не помогло

1. **Проверьте версию Firebase:**
```bash
npm list firebase
```
Должна быть версия 10.0.0 или выше

2. **Переустановите Firebase:**
```bash
npm uninstall firebase
npm install firebase@latest
```

3. **Очистите кэш браузера:**
   - Откройте DevTools (F12)
   - Правый клик на кнопке обновления
   - Выберите "Empty Cache and Hard Reload"

4. **Создайте новый Firebase проект** и попробуйте с ним

---

## 💡 Быстрое решение (90% случаев)

**Чаще всего проблема в том, что Google Authentication не включен в Firebase Console!**

1. Firebase Console → Authentication → Sign-in method
2. Включите Google
3. Укажите Support email
4. Сохраните
5. Перезагрузите страницу приложения

**Готово!** 🎉
