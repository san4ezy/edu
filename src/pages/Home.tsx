import { useAuthContext } from '../context/AuthContext';
import { telegramService } from '../services/api/telegram';
import { useEffect, useState } from 'react';

const Home = () => {
    const { isAuthenticated, isTelegramUser, isLoading } = useAuthContext();
    const telegramUser = telegramService.getTelegramUser();
    const [debugInfo, setDebugInfo] = useState<any>({});

    useEffect(() => {
        // Debug information
        setDebugInfo({
            windowTelegram: typeof window.Telegram !== 'undefined',
            telegramWebApp: typeof window.Telegram?.WebApp !== 'undefined',
            initData: window.Telegram?.WebApp?.initData,
            initDataUnsafe: window.Telegram?.WebApp?.initDataUnsafe,
        });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>
            
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">App Status</h2>
                <p>Running as Telegram Mini App: {telegramService.isTelegramWebApp() ? 'Yes' : 'No'}</p>
                <p>Authentication Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
                <p>Telegram User: {isTelegramUser ? 'Yes' : 'No'}</p>
            </div>

            {telegramUser && (
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-2">Telegram User Information</h2>
                    <p>User ID: {telegramUser.id}</p>
                    <p>First Name: {telegramUser.first_name}</p>
                    {telegramUser.last_name && <p>Last Name: {telegramUser.last_name}</p>}
                    {telegramUser.username && <p>Username: @{telegramUser.username}</p>}
                    {telegramUser.language_code && <p>Language: {telegramUser.language_code}</p>}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-4 mt-4">
                <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
                <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(debugInfo, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default Home;
