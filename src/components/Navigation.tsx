import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
    const { isAuthenticated } = useAuth();

    return (
        <nav style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
            <ul style={{ display: 'flex', gap: '20px', listStyle: 'none' }}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;