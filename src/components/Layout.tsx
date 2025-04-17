import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuthContext();
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <div className="mobile-layout">
            <header className="header">
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>React App</Link>
                </div>
                <button
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
                <nav>
                    <ul>
                        <li className={location.pathname === '/' ? 'active' : ''}>
                            <Link to="/" onClick={closeMenu}>Home</Link>
                        </li>
                        <li className={location.pathname === '/about' ? 'active' : ''}>
                            <Link to="/about" onClick={closeMenu}>About</Link>
                        </li>

                        {isAuthenticated ? (
                            <>
                                <li className={location.pathname === '/dashboard' ? 'active' : ''}>
                                    <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                                </li>
                                <li className={location.pathname === '/profile' ? 'active' : ''}>
                                    <Link to="/profile" onClick={closeMenu}>Profile</Link>
                                </li>
                                <li>
                                    <button
                                        className="logout-button"
                                        onClick={() => {
                                            logout();
                                            closeMenu();
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className={location.pathname === '/login' ? 'active' : ''}>
                                <Link to="/login" onClick={closeMenu}>Login</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>

            <main className="content">
                {children}
            </main>

            <footer className="footer">
                <p>© {new Date().getFullYear()} React Mobile App</p>
            </footer>
        </div>
    );
};

export default Layout;
