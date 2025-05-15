import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import {useRef} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faBell} from "@fortawesome/free-solid-svg-icons";

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
                    <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                </label>
            </div>

            <div className="navbar-center">
                <a className="btn btn-ghost text-xl">eDoo</a>
            </div>

            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
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