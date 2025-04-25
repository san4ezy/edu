import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

declare const Telegram: any;

function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    // TODO: need to move it
    const API_URL = import.meta.env.VITE_API_URL;
    const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN;


    // TG AUTH /////////////////////////////////////////////////////////////////////////

    const handleTelegramAuth = async (telegramData: any) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/api/v1/auth/social/telegram/`, telegramData);
            const { access, refresh } = response.data;
            login({ access, refresh });
            navigate("/profile");  // Redirect
        } catch (err) {
            console.error("Telegram authentication failed:", err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.detail || err.response.data?.error || "Telegram authentication failed");
            } else {
                setError("Unexpected error occurred on Telegram authorization.");
            }
            setLoading(false);
        } finally {
            // Something goes here
        }
    };

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
            console.log("Running as Telegram Mini App.");
            handleTelegramAuth({ init_data: window.Telegram.WebApp.initData });
        } else {
            console.log("Running as Web App.");
        }
    }, []);

    // LOGIN/PASSWORD AUTH /////////////////////////////////////////////////////////////

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${API_URL}/api/v1/auth/token/obtain/`, {
                phone_number: phone,
                password: password,
            });
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