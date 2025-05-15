import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import {useRef} from "react";

function Header() {
    const { isAuthenticated, logout } = useAuth();
    const dropdownRef = useRef(null);
    const dropdownContentRef = useRef(null);

    const closeDropdown = () => {
        // This specifically targets the DaisyUI dropdown behavior
        // Remove focus from the dropdown to close it
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-sm">

            <div className="navbar-start">
                <label htmlFor="my-drawer" className="btn btn-ghost btn-circle drawer-button">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
                    </svg>
                </label>
            </div>

            <div className="navbar-center">
                <a className="btn btn-ghost text-xl">eDoo</a>
            </div>

            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                        </svg>
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>

                <div className="dropdown dropdown-end" ref={dropdownRef}>
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                    >
                        {isAuthenticated ? (
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        ) : (
                            <div className="bg-neutral text-neutral-content w-12 rounded-full">
                                <span>N</span>
                            </div>
                        )}
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        ref={dropdownContentRef}
                    >
                        <li>
                            <Link to="/profile" className="justify-between" onClick={closeDropdown}>
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/settings" className="justify-between" onClick={closeDropdown}>
                                Settings <span className="badge">New</span>
                            </Link>
                        </li>
                        <li>
                            {isAuthenticated ? (
                                <Link to="/" onClick={() => { closeDropdown(); logout(); }}>
                                    Logout
                                </Link>
                            ) : (
                                <Link to="/login" onClick={closeDropdown}>
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;