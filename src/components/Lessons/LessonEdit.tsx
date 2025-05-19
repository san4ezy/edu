import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import lessonService from "../../services/lessonService.ts";
import { Lesson } from "../../types/Event.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faExclamation, faSave } from "@fortawesome/free-solid-svg-icons";
import SimpleEditor from "../Common/SimpleEditor.tsx";

function LessonEdit() {
    const { id, courseId } = useParams<{ id: string; courseId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const isNewLesson = location.pathname.includes("/new") || location.pathname.includes("/add");
    
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [formData, setFormData] = useState<Partial<Lesson>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchLessonDetails = async () => {
            if (isNewLesson) {
                // For new lessons, initialize with empty form
                setFormData({
                    name: "",
                    short_description: "",
                    description: "",
                    content: "",
                    start_dt: new Date().toISOString().split('T')[0],
                    end_dt: new Date().toISOString().split('T')[0],
                });
                setLoading(false);
                return;
            }

            if (!id) return;

            try {
                setLoading(true);
                const data = await lessonService.managementRetrieve(id);
                setLesson(data);
                setFormData({
                    name: data.name,
                    short_description: data.short_description,
                    description: data.description,
                    content: data.content,
                    start_dt: data.start_dt,
                    end_dt: data.end_dt,
                });
                setError(null);
            } catch (err) {
                console.error("Failed to fetch lesson details:", err);
                setError("Failed to load lesson details. The lesson may not exist or there was a network issue.");
            } finally {
                setLoading(false);
            }
        };

        fetchLessonDetails();
    }, [id, isNewLesson]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Prepare form data for submission
            const submissionData = new FormData();

            // Add all text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    submissionData.append(key, value.toString());
                }
            });

            let savedLesson;

            if (isNewLesson) {
                // Create new lesson - requires courseId
                if (!courseId) {
                    throw new Error("Course ID is missing. Unable to create lesson.");
                }
                savedLesson = await lessonService.create(courseId, submissionData);
            } else if (id) {
                // Update existing lesson - only needs lesson ID
                savedLesson = await lessonService.update(id, submissionData);
            } else {
                throw new Error("Missing lesson ID");
            }

            setSaveSuccess(true);

            // Update the lesson state with new data
            setLesson(savedLesson);

            // Reset success message after 3 seconds and navigate to lesson detail
            setTimeout(() => {
                setSaveSuccess(false);
                // Navigate to the lesson detail page
                navigate(`/courses/${courseId}`);
            }, 1500);
        } catch (err) {
            console.error("Failed to save lesson:", err);
            setError("Failed to save lesson details. Please try again.");
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

    // Back link should go to the lesson detail page if editing an existing lesson, 
    // or to the course detail page if creating a new lesson from a course
    const backUrl = `/courses/${courseId}`;

    return (
        <div className="w-full">
            <div className="mb-6 px-4 sm:px-0 flex justify-between items-center">
                <Link to={backUrl} className="btn btn-outline btn-sm">
                    ← Back
                </Link>
                <div className="flex items-center gap-2">
                    {saveSuccess && (
                        <div className="alert alert-success py-2 px-4">
                            <span>Lesson saved successfully!</span>
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
                        <div className="form-control">
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                className="input input-lg input-bordered w-full text-2xl sm:text-3xl font-bold"
                                placeholder="Lesson Title"
                            />
                        </div>

                        {/* Lesson Details Section */}
                        <div className="space-y-4">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCalendar} className="h-5 w-5" />
                                    <span>Start Date:</span>
                                </div>
                                <input
                                    type="date"
                                    name="start_dt"
                                    value={formData.start_dt ? new Date(formData.start_dt).toISOString().split('T')[0] : ''}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                />
                            </div>

                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCalendar} className="h-5 w-5" />
                                    <span>End Date:</span>
                                </div>
                                <input
                                    type="date"
                                    name="end_dt"
                                    value={formData.end_dt ? new Date(formData.end_dt).toISOString().split('T')[0] : ''}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Short Description</span>
                                </label>
                                <SimpleEditor
                                    name="short_description"
                                    value={formData.short_description || ''}
                                    onChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        short_description: value
                                    }))}
                                    placeholder="Enter a short description"
                                    height="h-60"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <SimpleEditor
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        description: value
                                    }))}
                                    placeholder="Enter a detailed description"
                                    height="h-60"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Content</span>
                                </label>
                                <SimpleEditor
                                    name="content"
                                    value={formData.content || ''}
                                    onChange={(value) => setFormData(prev => ({
                                        ...prev,
                                        content: value
                                    }))}
                                    placeholder="Enter lesson content"
                                    height="h-80"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LessonEdit;