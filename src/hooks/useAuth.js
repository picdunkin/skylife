import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async () => {
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('✅ Авторизация успешна:', result.user.email);
            return result;
        } catch (err) {
            console.error('❌ Ошибка авторизации:', err.code, err.message);
            setError(err);
            throw err;
        }
    };

    const logout = () => signOut(auth);

    return { user, loading, error, login, logout };
};
