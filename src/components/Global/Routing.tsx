// import React from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "../../pages/Home.tsx";
import LoginPage from "../../pages/Login.tsx";
import EventList from "../../pages/events/EventList.tsx";
import PrivateRoute from "../PrivateRoute.tsx";
import ProfilePage from "../../pages/profile/Profile.tsx";
import SettingsPage from "../../pages/profile/Settings.tsx";
import NotFoundPage from "../../pages/NotFound.tsx";

function Routing() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/events" element={<EventList />} />

            {/* PRIVATE */}
            <Route
                path="/profile"
                element={
                    <PrivateRoute element={<ProfilePage />} />
                }
            />
            <Route
                path="/settings"
                element={
                    <PrivateRoute element={<SettingsPage />} />
                }
            />

            {/* Catch all 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default Routing;