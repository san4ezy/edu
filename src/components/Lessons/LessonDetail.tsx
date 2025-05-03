import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import lessonService from "../../services/lessonService.ts";
import { PaidLesson } from "../../types/Lesson.ts";

function LessonDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<PaidLesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await lessonService.retrieve(id);
                setLesson(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch lesson details:", err);
                setError("Failed to load lesson details. The lesson may not exist or there was a network issue.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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

    if (!lesson) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p>Lesson not found</p>
                <Link to="/lessons" className="btn btn-primary mt-4">Back to Lessons</Link>
            </div>
        );
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case "NEW":
                return "neutral";
            case "VIEWED":
                return "warning";
            case "PASSED":
                return "warning";
            default:
                return "neutral";
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 px-4 sm:px-0">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline btn-sm"
                >
                    ← Back to Course
                </button>
            </div>

            <div className="card bg-base-100 shadow-xl rounded-none sm:rounded-xl overflow-hidden">
                <div className="card-body p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6">
                        <h1 className="card-title text-2xl sm:text-3xl">{lesson.lesson.name}</h1>

                        {/* Lesson Details Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{new Date(lesson.lesson.start_dt).toLocaleDateString()}</span>
                                <div className={`badge badge-soft badge-${getStatusClass(lesson.status)}`}>{lesson.status.toLowerCase()}</div>
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-justify">{lesson.lesson.description}</p>
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-justify">{lesson.lesson.content}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default LessonDetail;
