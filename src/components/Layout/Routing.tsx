// import React from "react";
import {Route, Routes} from "react-router-dom";
import HomePage from "../../pages/Home.tsx";
import LoginPage from "../../pages/Login.tsx";
import PrivateRoute from "../PrivateRoute.tsx";
import ManagerRoute from "../ManagerRoute.tsx";
import ProfilePage from "../../pages/profile/Profile.tsx";
import SettingsPage from "../../pages/profile/Settings.tsx";
import NotFoundPage from "../../pages/NotFound.tsx";
import EventListPage from "../../pages/events/EventList.tsx";
import EventDetailPage from "../../pages/events/EventDetail.tsx";
import CourseListPage from "../../pages/courses/CourseList.tsx";
import CourseDetailPage from "../../pages/courses/CourseDetail.tsx";
import LessonDetailPage from "../../pages/lessons/LessonDetail.tsx";
import CourseEditPage from "../../pages/events/EventEdit.tsx";
import LessonEditPage from "../../pages/lessons/LessonEdit.tsx";

function Routing() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* PRIVATE */}
            <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
            <Route path="/settings" element={<PrivateRoute element={<SettingsPage />} />} />

            <Route path="/events" element={<PrivateRoute element={<EventListPage />} />} />
            <Route path="/events/:id" element={<PrivateRoute element={<EventDetailPage />} />} />
            {/*<Route path="/events/:id/edit" element={<ManagerRoute element={<EventEditPage />} />} />*/}

            <Route path="/courses" element={<PrivateRoute element={<CourseListPage />} />} />
            <Route path="/courses/:id" element={<PrivateRoute element={<CourseDetailPage />} />} />
            <Route path="/courses/:id/edit" element={<ManagerRoute element={<CourseEditPage />} />} />

            <Route path="/lessons/:id" element={<PrivateRoute element={<LessonDetailPage />} />} />
            <Route path="/lessons/:id/edit" element={<ManagerRoute element={<LessonEditPage />} />} />

            {/* Catch all 404 */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default Routing;