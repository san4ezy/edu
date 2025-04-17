import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export const Dashboard = () => {
    const { logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                        <p className="mb-4">Welcome to your dashboard!</p>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
