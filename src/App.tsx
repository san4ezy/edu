import { useRef } from 'react';
import './App.css';
import Footer from './components/Global/Footer.tsx';
import Header from './components/Global/Header.tsx';
import Routing from './components/Global/Routing.tsx';
import { Link } from 'react-router-dom';

function App() {
    // Create a ref to access the drawer toggle checkbox element
    const drawerCheckboxRef = useRef<HTMLInputElement>(null);

    // Function to close the drawer
    const closeDrawer = () => {
        if (drawerCheckboxRef.current) {
            drawerCheckboxRef.current.checked = false;
        }
    };

    return (
        <div className="drawer">
            {/* Associate the ref with the input checkbox */}
            <input
                id="my-drawer"
                type="checkbox"
                className="drawer-toggle"
                ref={drawerCheckboxRef}
            />
            <div className="drawer-content">
                {/* Page content here */}
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="container mx-auto p-4 flex-grow flex flex-col md:flex-row">
                        {/* Content */}
                        <section className="flex-1 bg-base-100 p-4 rounded-box w-full md:w-auto">
                            <Routing />
                        </section>
                    </main>
                    <Footer />
                </div>
            </div>
            <div className="drawer-side">
                <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <ul className="menu menu-lg bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <a className="btn btn-ghost text-xl">eDoo</a>

                    {/* Call closeDrawer when a Link is clicked */}
                    <li>
                        <Link to="/" onClick={closeDrawer}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/events" onClick={closeDrawer}>
                            Events
                        </Link>
                    </li>
                    <li>
                        <Link to="/courses" onClick={closeDrawer}>
                            Courses
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default App;