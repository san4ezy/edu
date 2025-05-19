import React from "react";
import ReactDom from "react-dom/client";
import App from './App.tsx'
import './styles/global.css'
import './components/Common/SafeHtmlRenderer.css'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";

ReactDom.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
