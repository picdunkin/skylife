---
description: Деплой на Vercel
---

# Деплой приложения Skylife на Vercel

## Предварительные требования
1. Аккаунт на GitHub
2. Проект загружен в GitHub репозиторий
3. Аккаунт на Vercel (можно войти через GitHub)

## Шаги деплоя

### 1. Подготовка проекта
Убедитесь, что:
- Файл `.env` добавлен в `.gitignore` (уже сделано)
- Создан файл `.env.example` с примерами переменных (уже сделано)
- Создан файл `vercel.json` с конфигурацией (уже сделано)

### 2. Загрузка на GitHub (если еще не сделано)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 3. Деплой на Vercel

#### Вариант A: Через веб-интерфейс (проще)
1. Перейдите на https://vercel.com
2. Нажмите "Sign Up" и войдите через GitHub
3. Нажмите "Add New..." → "Project"
4. Выберите ваш репозиторий `skylife`
5. Настройте переменные окружения:
   - Нажмите "Environment Variables"
   - Добавьте все переменные из `.env`:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
6. Нажмите "Deploy"
7. Дождитесь завершения деплоя (1-3 минуты)

#### Вариант B: Через CLI
```bash
# Установить Vercel CLI
npm i -g vercel

# Войти в аккаунт
vercel login

# Деплой
vercel

# Следуйте инструкциям в терминале
```

### 4. Настройка переменных окружения (если используете CLI)
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
```

### 5. Продакшн деплой
```bash
vercel --prod
```

## После деплоя

1. **Обновите Firebase настройки:**
   - Перейдите в Firebase Console → Authentication → Settings
   - Добавьте ваш Vercel домен в "Authorized domains"
   - Формат: `your-project.vercel.app`

2. **Проверьте работу:**
   - Откройте ваш сайт по ссылке от Vercel
   - Проверьте авторизацию
   - Проверьте загрузку данных

3. **Автоматический деплой:**
   - Каждый push в main ветку будет автоматически деплоиться
   - Pull requests создают preview деплои

## Альтернативные бесплатные хостинги

### Netlify
```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Firebase Hosting
```bash
npm i -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### GitHub Pages (требует дополнительной настройки)
1. Установите `gh-pages`:
```bash
npm install --save-dev gh-pages
```

2. Добавьте в `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Обновите `vite.config.js`:
```javascript
export default defineConfig({
  base: '/skylife/',
  plugins: [react()],
})
```

4. Деплой:
```bash
npm run deploy
```

## Troubleshooting

### Проблема: Белый экран после деплоя
- Проверьте переменные окружения в Vercel
- Проверьте Console в браузере на ошибки
- Убедитесь, что домен добавлен в Firebase Authorized domains

### Проблема: 404 при переходе по URL
- Убедитесь, что `vercel.json` содержит правильные rewrites
- Проверьте, что файл загружен в репозиторий

### Проблема: Firebase ошибки
- Проверьте правильность всех Firebase переменных
- Убедитесь, что домен авторизован в Firebase Console
