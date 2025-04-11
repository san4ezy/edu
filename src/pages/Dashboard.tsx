import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { logout } = useAuth();

    return (
        <div>
            <h1>Dashboard (Protected)</h1>
            <p>This page is only accessible to authenticated users.</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;