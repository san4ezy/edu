import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import planService from "../../services/planService";
import courseService from "../../services/courseService";
import { Plan, PlanManagement, Lesson } from "../../types/Event";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faSave, faCheck } from "@fortawesome/free-solid-svg-icons";

interface PlanFormData {
    name: string;
    description: string;
    price_amount: number;
    price_currency: string;
    lesson_ids: string[];
}

function PlanEdit() {
    const { courseId, planId } = useParams<{ courseId: string; planId?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const isNewPlan = location.pathname.includes("/add") || !planId;
    
    const [plan, setPlan] = useState<PlanManagement | null>(null);
    const [formData, setFormData] = useState<PlanFormData>({
        name: "",
        description: "",
        price_amount: 0,
        price_currency: "UAH",
        lesson_ids: []
    });
    const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId) return;

            try {
                setLoading(true);
                
                // Fetch course details to get lessons
                const courseData = await courseService.managementRetrieve(courseId);
                setCourseLessons(courseData.lessons);

                if (!isNewPlan && planId) {
                    // Fetch existing plan details
                    const planData = await planService.retrieve(courseId, planId);
                    setPlan(planData);
                    setFormData({
                        name: planData.name,
                        description: planData.description || "",
                        price_amount: planData.price.amount,
                        price_currency: planData.price.currency,
                        lesson_ids: planData.lesson_ids || []
                    });
                }
                setError(null);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Failed to load plan details. The plan may not exist or there was a network issue.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, planId, isNewPlan]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price_amount' ? parseFloat(value) || 0 : value
        }));
    };

    const handleLessonToggle = (lessonId: string) => {
        setFormData(prev => ({
            ...prev,
            lesson_ids: prev.lesson_ids.includes(lessonId)
                ? prev.lesson_ids.filter(id => id !== lessonId)
                : [...prev.lesson_ids, lessonId]
        }));
    };

    const handleSave = async () => {
        if (!courseId) return;

        try {
            setSaving(true);

            let savedPlan;
            if (isNewPlan) {
                savedPlan = await planService.create(courseId, formData);
            } else if (planId) {
                savedPlan = await planService.update(courseId, planId, formData);
            } else {
                throw new Error("Missing plan ID");
            }

            setSaveSuccess(true);
            setPlan(savedPlan);

            // Reset success message after 3 seconds and navigate back to course
            setTimeout(() => {
                setSaveSuccess(false);
                navigate(`/courses/${courseId}`);
            }, 1500);
        } catch (err) {
            console.error("Failed to save plan:", err);
            setError("Failed to save plan details. Please try again.");
        } finally {
            setSaving(false);
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

    const backUrl = `/courses/${courseId}`;

    return (
        <div className="w-full">
            <div className="mb-6 px-4 sm:px-0 flex justify-between items-center">
                <Link to={backUrl} className="btn btn-outline btn-sm">
                    ← Back to Course
                </Link>
                <div className="flex items-center gap-2">
                    {saveSuccess && (
                        <div className="alert alert-success py-2 px-4">
                            <span>Plan saved successfully!</span>
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        className="btn btn-primary btn-sm"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faSave} className="h-4 w-4" />
                                Save
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl rounded-none sm:rounded-xl overflow-hidden">
                <div className="card-body p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            {isNewPlan ? 'Create New Plan' : 'Edit Plan'}
                        </h1>

                        {/* Plan Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Plan Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                placeholder="Enter plan name"
                                required
                            />
                        </div>

                        {/* Plan Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered"
                                placeholder="Enter plan description"
                                rows={3}
                            />
                        </div>

                        {/* Price Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Price Amount</span>
                                </label>
                                <input
                                    type="number"
                                    name="price_amount"
                                    value={formData.price_amount}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Currency</span>
                                </label>
                                <select
                                    name="price_currency"
                                    value={formData.price_currency}
                                    onChange={handleInputChange}
                                    className="select select-bordered"
                                >
                                    <option value="UAH">UAH (₴)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        {/* Lessons Selection */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text text-lg font-semibold">Included Lessons</span>
                                <span className="label-text-alt">
                                    {formData.lesson_ids.length} of {courseLessons.length} selected
                                </span>
                            </label>
                            <div className="space-y-2 max-h-64 overflow-y-auto border border-base-300 rounded-lg p-4">
                                {courseLessons.length === 0 ? (
                                    <div className="text-center py-4 text-base-content/60">
                                        No lessons available in this course.
                                        <Link to={`/courses/${courseId}/lessons/add`} className="link link-primary ml-2">
                                            Add a lesson?
                                        </Link>
                                    </div>
                                ) : (
                                    courseLessons.map(lesson => (
                                        <div key={lesson.id} className="flex items-center gap-3 p-2 hover:bg-base-200 rounded">
                                            <input
                                                type="checkbox"
                                                id={`lesson-${lesson.id}`}
                                                checked={formData.lesson_ids.includes(lesson.id)}
                                                onChange={() => handleLessonToggle(lesson.id)}
                                                className="checkbox checkbox-primary"
                                            />
                                            <label htmlFor={`lesson-${lesson.id}`} className="flex-1 cursor-pointer">
                                                <div className="font-medium">{lesson.name}</div>
                                                {lesson.short_description && (
                                                    <div className="text-sm text-base-content/60">{lesson.short_description}</div>
                                                )}
                                            </label>
                                            {formData.lesson_ids.includes(lesson.id) && (
                                                <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-success" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlanEdit;
