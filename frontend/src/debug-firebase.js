// 🔍 Firebase Configuration Checker
// Импортируйте этот файл в App.jsx для диагностики: import './debug-firebase';

console.log('=== 🔥 Firebase Configuration Check ===');

// Проверка переменных окружения
const checks = {
    'API Key': import.meta.env.VITE_FIREBASE_API_KEY,
    'Auth Domain': import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    'Project ID': import.meta.env.VITE_FIREBASE_PROJECT_ID,
    'Storage Bucket': import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    'Messaging Sender ID': import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    'App ID': import.meta.env.VITE_FIREBASE_APP_ID
};

let allGood = true;
for (const [key, value] of Object.entries(checks)) {
    const status = value ? '✅' : '❌';
    const displayValue = value ? (value.substring(0, 20) + '...') : 'MISSING';
    console.log(`${status} ${key}: ${displayValue}`);
    if (!value) allGood = false;
}

if (allGood) {
    console.log('\n✅ Все переменные окружения настроены!');
    console.log('\n📋 Следующие шаги:');
    console.log('1. Откройте Firebase Console: https://console.firebase.google.com/');
    console.log('2. Перейдите в Authentication → Sign-in method');
    console.log('3. Убедитесь, что Google провайдер ВКЛЮЧЕН');
    console.log('4. Проверьте, что localhost добавлен в Authorized domains');
    console.log('\n🔄 Попробуйте авторизоваться. Если ошибка - смотрите сообщение в alert.');
} else {
    console.error('\n❌ Некоторые переменные окружения отсутствуют!');
    console.error('📝 Проверьте файл .env и убедитесь, что все значения заполнены.');
    console.error('📖 Смотрите .env.example для примера.');
}

console.log('=====================================');
