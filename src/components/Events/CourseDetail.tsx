import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import courseService from "../../services/courseService.ts";
import LessonCard from "../Lessons/LessonCard.tsx";
import {PaidCourse} from "../../types/Event.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faEdit,
    faExclamation,
    faPlus
} from "@fortawesome/free-solid-svg-icons";

function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isManager } = useAuth();
    const [course, setCourse] = useState<PaidCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await courseService.retrieve(id);
                setCourse(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch course details:", err);
                setError("Failed to load course details. The course may not exist or there was a network issue.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 text-center">
                <div className="alert alert-error max-w-md mx-auto">
                    <FontAwesomeIcon icon={faExclamation} className="h-6 w-6" />
                    <span>{error}</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-primary mt-4"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p>Course not found</p>
                <Link to="/courses" className="btn btn-primary mt-4">Back to Courses</Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6 px-4 sm:px-0">
                <Link to="/courses" className="btn btn-outline btn-sm">
                    ← Back to Courses
                </Link>
                {isManager && (
                    <Link to={`/courses/${course.id}/edit`} className="btn btn-outline btn-warning btn-sm ml-2">
                        <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                    </Link>
                )}
            </div>

            <div className="card bg-base-100 shadow-xl rounded-none sm:rounded-xl overflow-hidden">
                {course.image && (
                    <figure className="w-full h-64 sm:h-96 lg:h-[32rem]">
                        <img
                            src={course.image}
                            alt={course.name}
                            className="object-cover w-full h-full"
                        />
                    </figure>
                )}
                <div className="card-body p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6">
                        <h1 className="card-title text-2xl sm:text-3xl">{course.name}</h1>

                        {/* Course Details Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <FontAwesomeIcon icon={faCalendar} className="h-5 w-5" />
                                <span>{new Date(course.start_dt).toLocaleDateString()}</span>
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-justify">{course.description}</p>
                            </div>
                        </div>

                        {/* Lessons Section */}
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">
                                Lessons
                                {isManager && (
                                    <Link to={`/courses/${course.id}/edit`} className="btn btn-outline btn-warning btn-sm ml-2">
                                        <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                                    </Link>
                                )}
                            </h2>
                            <ul className="steps steps-vertical w-full mt-4">
                                {course.lessons.map((lesson) => (
                                    <LessonCard key={lesson.id} lesson={lesson} />
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetail;
