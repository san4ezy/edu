import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService.ts";
import { PaidCourse, PaidLesson } from "../../types/Event.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faExclamation, faSave, faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import SimpleEditor from "../common/SimpleEditor.tsx";

function CourseEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<PaidCourse | null>(null);
    const [formData, setFormData] = useState<Partial<PaidCourse>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await courseService.managementRetrieve(id);
                setCourse(data);
                setFormData({
                    name: data.name,
                    short_description: data.short_description,
                    description: data.description,
                    start_dt: data.start_dt,
                    end_dt: data.end_dt,
                });
                // Set the image preview with the existing image
                if (data.image) {
                    setImagePreview(data.image);
                }
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setRemoveImage(false);
            
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setRemoveImage(true);
    };

    const handleSave = async () => {
        if (!id || !course) return;

        try {
            setSaving(true);
            
            // Prepare form data for submission - we need to use FormData if there's an image
            const submissionData = new FormData();
            
            // Add all text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    submissionData.append(key, value.toString());
                }
            });
            
            // Add new image if selected
            if (imageFile) {
                submissionData.append('image', imageFile);
            } else if (removeImage) {
                // If user wants to remove the image without adding a new one
                submissionData.append('image', '');
            }
            // If neither imageFile nor removeImage is true, we don't include the image field
            // which means "keep the existing image"
            
            await courseService.update(id, submissionData);
            setSaveSuccess(true);
            
            // Update the course state with new data
            setCourse(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    ...formData,
                    image: imageFile ? URL.createObjectURL(imageFile) : (removeImage ? '' : prev.image)
                };
            });

            // Reset success message after 3 seconds
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("Failed to update course:", err);
            setError("Failed to save course details. Please try again.");
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
            <div className="mb-6 px-4 sm:px-0 flex justify-between items-center">
                <Link to={`/courses/${course.id}`} className="btn btn-outline btn-sm">
                    ← Back
                </Link>
                <div className="flex items-center gap-2">
                    {saveSuccess && (
                        <div className="alert alert-success py-2 px-4">
                            <span>Course saved successfully!</span>
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
                                placeholder="Course Title"
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Course Image</span>
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-2 relative w-full h-64 bg-base-200 rounded-lg overflow-hidden">
                                    <img 
                                        src={imagePreview} 
                                        alt="Course preview" 
                                        className="w-full h-full object-cover"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveImage}
                                        className="btn btn-error btn-sm absolute top-2 right-2"
                                        title="Remove image"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            )}
                            
                            {/* File Input */}
                            {!imagePreview && (
                                <div className="mt-2">
                                    <label className="w-full h-32 flex flex-col items-center justify-center bg-base-200 rounded-lg border-2 border-dashed border-base-300 cursor-pointer hover:bg-base-300 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FontAwesomeIcon icon={faUpload} className="h-8 w-8 mb-3 text-base-content" />
                                            <p className="mb-2 text-sm text-base-content">
                                                <span className="font-bold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-base-content/70">
                                                PNG, JPG or GIF (recommended: 1600x900px)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Course Details Section */}
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
                                    height="h-80"
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

export default CourseEdit;