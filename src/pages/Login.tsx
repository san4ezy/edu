import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    loginWithPhonePassword,
    loginWithTelegramMiniApp,
    loginWithTelegramWidget
} from "../services/authService";

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
            };
        };
        onTelegramAuth: (user: any) => void;
    }
}

function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    // TODO: need to move it
    // const API_URL = import.meta.env.VITE_API_URL;
    const BOT_USERNAME = import.meta.env.VITE_BOT_USERNAME;

    // TG AUTH /////////////////////////////////////////////////////////////////////////

    const handleTelegramMiniAppAuth = async (initData: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await loginWithTelegramMiniApp(initData);
            const { access, refresh } = response.data;
            login({ access, refresh });
            navigate("/profile");
        } catch (err) {
            console.error("Telegram Mini App authentication failed:", err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.detail || err.response.data?.error || "Telegram authentication failed");
            } else {
                setError("Unexpected error occurred on Telegram authorization.");
            }
            setLoading(false);
        }
    };

    const handleTelegramWidgetAuth = async (user: any) => {
        setLoading(true);
        setError('');

        try {
            // Here you should use a different endpoint for widget authentication
            const response = await loginWithTelegramWidget(user);
            const { access, refresh } = response.data;
            login({ access, refresh });
            navigate("/profile");
        } catch (err) {
            console.error("Telegram Widget authentication failed:", err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.detail || err.response.data?.error || "Telegram authentication failed");
            } else {
                setError("Unexpected error occurred on Telegram authorization.");
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
            console.log("Running as Telegram Mini App.");
            handleTelegramMiniAppAuth(window.Telegram.WebApp.initData);
        } else {
            console.log("Running as Web App.");
            // Initialize Telegram Login Widget
            const script = document.createElement('script');
            script.src = 'https://telegram.org/js/telegram-widget.js?22';
            script.setAttribute('data-telegram-login', BOT_USERNAME);
            script.setAttribute('data-size', 'large');
            script.setAttribute('data-radius', '8');
            script.setAttribute('data-request-access', 'write');
            script.setAttribute('data-userpic', 'false');
            script.setAttribute('data-onauth', 'onTelegramAuth(user)');
            script.setAttribute('data-lang', 'en');
            script.setAttribute('data-corner-radius', '8');
            script.async = true;
            
            // Add error handling for script loading
            script.onerror = (error) => {
                console.error('Failed to load Telegram login widget:', error);
                setError('Failed to load Telegram login. Please try again later.');
            };
            
            // Add the callback function
            window.onTelegramAuth = (user: any) => {
                if (!user) {
                    setError('Telegram authentication failed. Please try again.');
                    return;
                }
                handleTelegramWidgetAuth(user);
            };
            
            // Add the script to the page
            const container = document.getElementById('telegram-login-button');
            if (container) {
                container.appendChild(script);
            } else {
                console.error('Telegram login button container not found');
                setError('Failed to initialize Telegram login. Please refresh the page.');
            }
        }
    }, []);

    // LOGIN/PASSWORD AUTH /////////////////////////////////////////////////////////////

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await loginWithPhonePassword(phone, password);
            const { access, refresh } = response.data["data"];
            login({access, refresh});
            navigate("/profile");
        } catch (err) {
            console.error("Login failed:", err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.detail || err.response.data?.error || "Login failed.");
            } else {
                setError("Unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Login Page</h2>

            {loading && <p>Loading...</p>}
            {error && <div style={{ color: "red" }}>{error}</div>}

            {!loading && (
                <>
                {!(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) && (
                    <form onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="phone">Phone Number:</label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                )}
                {!(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) && (
                    <div>
                        <p>or login with Telegram:</p>
                        <div id="telegram-login-button"></div>
                    </div>
                )}
                </>
            )}

        </div>
    );
}

export default LoginPage;
