import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import courseService from "../../services/courseService.ts";
import planService from "../../services/planService.ts";
import LessonCard from "../Lessons/LessonCard.tsx";
import {PaidCourse, PlanManagement} from "../../types/Event.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faEdit,
    faExclamation,
    faPlus,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {formatDistanceToNow} from "date-fns";

function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isManager } = useAuth();
    const [course, setCourse] = useState<PaidCourse | null>(null);
    const [plans, setPlans] = useState<PlanManagement[]>([]);
    const [loading, setLoading] = useState(true);
    const [plansLoading, setPlansLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await courseService.retrieve(id);
                setCourse(data);
                setError(null);
                
                // Fetch plans if user is a manager
                if (isManager) {
                    setPlansLoading(true);
                    try {
                        const plansData = await planService.list(id);
                        setPlans(plansData.data);
                    } catch (planErr) {
                        console.error("Failed to fetch plans:", planErr);
                        // Don't set error for plans, just log it
                    } finally {
                        setPlansLoading(false);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch course details:", err);
                setError("Failed to load course details. The course may not exist or there was a network issue.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id, isManager]);

    const handleDeletePlan = async (planId: string) => {
        if (!id || !confirm('Are you sure you want to delete this plan?')) return;

        try {
            await planService.delete(id, planId);
            setPlans(plans.filter(plan => plan.id !== planId));
        } catch (err) {
            console.error("Failed to delete plan:", err);
            alert("Failed to delete plan. Please try again.");
        }
    };

    const getCurrencySymbol = (currency: string) => {
        switch (currency) {
            case "UAH": return "₴";
            case "USD": return "$";
            case "EUR": return "€";
            case "GBP": return "£";
            default: return "$";
        }
    };

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
                            </h2>
                            <ul className="steps steps-vertical w-full mt-4">
                                {course.lessons.map((lesson) => (
                                    <LessonCard key={lesson.id} lesson={lesson} />
                                ))}
                                {isManager && (
                                    <li className="step step-neutral" data-content="">
                                        <Link to={`/courses/${course.id}/lessons/add`} className="w-full">
                                            <div className="card bg-base-200 border-base-300 border-2 w-full p-4 border-dashed opacity-50 grayscale">
                                                <h3 className="card-title text-xl mt-8 opacity-75">New Lesson</h3>
                                                <div className="card-body text-justify p-4 sm:p-6 lg:p-8">
                                                    Create new lesson
                                                    <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faCalendar} className="h-5 w-5 text-gray-400" />
                                                        <span>Soon</span>
                                                    </div>
                                                </div>
                                                <div className="card-actions flex-col items-stretch gap-2">
                                                    <button className="btn w-full btn-disabled pointer-events-none">
                                                        Open
                                                    </button>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Plans Section - Only visible to managers */}
                        {isManager && (
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold">
                                    Plans
                                </h2>
                                {plansLoading ? (
                                    <div className="flex justify-center">
                                        <span className="loading loading-spinner loading-md"></span>
                                    </div>
                                ) : plans.length === 0 ? (
                                    <div className="text-center py-8 text-base-content/60">
                                        No plans created yet.
                                        <Link to={`/courses/${course.id}/plans/add`} className="link link-primary ml-2">
                                            Create the first plan?
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {plans.map((plan) => (
                                            <div key={plan.id} className="card bg-base-100 border border-base-300 shadow-sm">
                                                <div className="card-body p-4">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="card-title text-lg">{plan.name}</h3>
                                                        <div className="flex gap-1">
                                                            <Link 
                                                                to={`/courses/${course.id}/plans/${plan.id}/edit`}
                                                                className="btn btn-ghost btn-xs"
                                                                title="Edit Plan"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} className="h-3 w-3" />
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDeletePlan(plan.id)}
                                                                className="btn btn-ghost btn-xs text-error"
                                                                title="Delete Plan"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-2xl font-bold text-primary">
                                                        {getCurrencySymbol(plan.price.currency)}{plan.price.amount}
                                                    </div>
                                                    {plan.description && (
                                                        <p className="text-sm text-base-content/70 mt-2">
                                                            {plan.description}
                                                        </p>
                                                    )}
                                                    <div className="mt-3">
                                                        <div className="text-xs text-base-content/60">
                                                            {(plan.lesson_ids || []).length} lesson{(plan.lesson_ids || []).length !== 1 ? 's' : ''} included
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Link to={`/courses/${course.id}/plans/add`}>
                                            <div className="card bg-base-200 border-2 border-dashed border-base-300 opacity-50 grayscale">
                                                <div className="card-body p-4">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="card-title text-lg opacity-75">New Plan</h3>
                                                        <div className="flex gap-1"></div>
                                                    </div>
                                                    <div className="text-2xl font-bold text-primary">
                                                        $0.00
                                                    </div>
                                                    <p className="text-sm text-base-content/70 mt-2">
                                                        Create new plan
                                                    </p>
                                                    <div className="mt-3">
                                                        <div className="text-xs text-base-content/60">
                                                            <button>
                                                                <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetail;
