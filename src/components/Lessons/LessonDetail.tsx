import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import lessonService from "../../services/lessonService.ts";
import { PaidLesson } from "../../types/Lesson.ts";
import SafeHtmlRenderer from "../Common/SafeHtmlRenderer.tsx";
import ExternalFiles from "../Common/ExternalFiles.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faExclamation} from "@fortawesome/free-solid-svg-icons";

function LessonDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<PaidLesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchIdRef = useRef<string | null>(null);
    const isCurrentlyFetchingRef = useRef(false);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;

            // Check if we're already fetching this ID or if it's the same as the last fetch
            if (isCurrentlyFetchingRef.current || lastFetchIdRef.current === id) {
                return;
            }

            try {
                isCurrentlyFetchingRef.current = true;
                lastFetchIdRef.current = id;
                setLoading(true);
                setError(null);
                
                const data = await lessonService.retrieve(id);
                
                if (isMountedRef.current) {
                    setLesson(data);
                }
            } catch (err) {
                if (isMountedRef.current) {
                    console.error("Failed to fetch lesson details:", err);
                    setError("Failed to load lesson details. You should buy it first.");
                }
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
                isCurrentlyFetchingRef.current = false;
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
                                <FontAwesomeIcon icon={faCalendar} className="h-6 w-6" />
                                <span>{new Date(lesson.lesson.start_dt).toLocaleDateString()}</span>
                                <div className={`badge badge-soft badge-${getStatusClass(lesson.status)}`}>{lesson.status.toLowerCase()}</div>
                            </div>

                            <div className="prose max-w-none">
                                <SafeHtmlRenderer 
                                    html={lesson.lesson.short_description || ''} 
                                    fallback={<p className="text-gray-500 italic">No short description available</p>}
                                />
                            </div>

                            <div className="prose max-w-none">
                                <SafeHtmlRenderer 
                                    html={lesson.lesson.description || ''} 
                                    fallback={<p className="text-gray-500 italic">No description available</p>}
                                />
                            </div>

                            <div className="prose max-w-none">
                                <SafeHtmlRenderer 
                                    html={lesson.lesson.content || ''} 
                                    fallback={<p className="text-gray-500 italic">No content available</p>}
                                />
                            </div>

                            {/* External Files Section */}
                            {lesson.lesson.external_files && lesson.lesson.external_files.length > 0 && (
                                <div className="mt-8">
                                    <ExternalFiles files={lesson.lesson.external_files} />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default LessonDetail;
