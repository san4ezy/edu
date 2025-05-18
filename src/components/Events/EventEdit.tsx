import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import eventService from "../../services/eventService.ts";
import { Event, Plan } from "../../types/Event.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCalendar, 
    faExclamation, 
    faSave, 
    faUpload, 
    faTrash, 
    faLink, 
    faAddressCard, 
    faMoneyBill,
    faPlus,
    faMinus
} from "@fortawesome/free-solid-svg-icons";
import SimpleEditor from "../Common/SimpleEditor.tsx";

function EventEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const isNewEvent = location.pathname.includes("/new");
    
    const [event, setEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState<Partial<Event>>({
        plans: []
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Add state for plans
    const [plans, setPlans] = useState<Partial<Plan>[]>([]);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (isNewEvent) {
                // For new events, initialize with empty form
                setFormData({
                    name: "",
                    short_description: "",
                    description: "",
                    website: "",
                    contacts: "",
                    start_dt: new Date().toISOString().split('T')[0],
                    end_dt: new Date().toISOString().split('T')[0],
                    plans: []
                });
                setPlans([]);
                setLoading(false);
                return;
            }

            if (!id) return;

            try {
                setLoading(true);
                const data = await eventService.retrieve(id);
                setEvent(data);
                setFormData({
                    name: data.name,
                    short_description: data.short_description,
                    description: data.description,
                    website: data.website,
                    contacts: data.contacts,
                    start_dt: data.start_dt,
                    end_dt: data.end_dt,
                });
                setPlans(data.plans || []);
                
                // Set the image preview with the existing image
                if (data.image) {
                    setImagePreview(data.image);
                }
                
                setError(null);
            } catch (err) {
                console.error("Failed to fetch event details:", err);
                setError("Failed to load event details. The event may not exist or there was a network issue.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, isNewEvent]);

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

    // Handle plans
    const handleAddPlan = () => {
        setPlans([...plans, {
            name: "",
            description: "",
            price: {
                amount: 0,
                currency: "USD"
            }
        }]);
    };

    const handleRemovePlan = (index: number) => {
        const newPlans = [...plans];
        newPlans.splice(index, 1);
        setPlans(newPlans);
    };

    const handlePlanChange = (index: number, field: string, value: string | number) => {
        const newPlans = [...plans];
        
        if (field === 'price.amount') {
            newPlans[index] = {
                ...newPlans[index],
                price: {
                    ...newPlans[index].price,
                    amount: typeof value === 'number' ? value : parseFloat(value) || 0
                }
            };
        } else if (field === 'price.currency') {
            newPlans[index] = {
                ...newPlans[index],
                price: {
                    ...newPlans[index].price,
                    currency: value as string
                }
            };
        } else {
            newPlans[index] = {
                ...newPlans[index],
                [field]: value
            };
        }
        
        setPlans(newPlans);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            
            // Prepare form data for submission
            const submissionData = new FormData();
            
            // Add all text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && key !== 'plans') {
                    submissionData.append(key, value.toString());
                }
            });
            
            // Add plans as JSON
            submissionData.append('plans', JSON.stringify(plans));
            
            // Add new image if selected
            if (imageFile) {
                submissionData.append('image', imageFile);
            } else if (removeImage) {
                // If user wants to remove the image without adding a new one
                submissionData.append('image', '');
            }
            
            let savedEvent;
            
            if (isNewEvent) {
                savedEvent = await eventService.create(submissionData);
            } else if (id) {
                savedEvent = await eventService.update(id, submissionData);
            } else {
                throw new Error("Missing event ID");
            }
            
            setSaveSuccess(true);
            
            // Update the event state with new data
            setEvent(savedEvent);

            // Reset success message after 3 seconds and navigate to event detail
            setTimeout(() => {
                setSaveSuccess(false);
                navigate(`/events/${savedEvent.id}`);
            }, 1500);
        } catch (err) {
            console.error("Failed to save event:", err);
            setError("Failed to save event details. Please try again.");
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

    // Back link should go to the event detail page if editing an existing event
    const backUrl = id ? `/events/${id}` : '/events';

    return (
        <div className="w-full">
            <div className="mb-6 px-4 sm:px-0 flex justify-between items-center">
                <Link to={backUrl} className="btn btn-outline btn-sm">
                    ← Back
                </Link>
                <div className="flex items-center gap-2">
                    {saveSuccess && (
                        <div className="alert alert-success py-2 px-4">
                            <span>Event saved successfully!</span>
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
                                placeholder="Event Title"
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Event Image</span>
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-2 relative w-full h-64 bg-base-200 rounded-lg overflow-hidden">
                                    <img 
                                        src={imagePreview} 
                                        alt="Event preview" 
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

                        {/* Event Details Section */}
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
                                    <span className="label-text flex items-center gap-2">
                                        <FontAwesomeIcon icon={faLink} className="h-5 w-5" />
                                        Website
                                    </span>
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                    className="input input-bordered"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center gap-2">
                                        <FontAwesomeIcon icon={faAddressCard} className="h-5 w-5" />
                                        Contact Information
                                    </span>
                                </label>
                                <textarea
                                    name="contacts"
                                    value={formData.contacts || ''}
                                    onChange={handleInputChange}
                                    placeholder="Contact details"
                                    className="textarea textarea-bordered h-24"
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
                                    height="h-80"
                                />
                            </div>
                        </div>

                        {/* Plans Section */}
                        {/*<div className="space-y-4">*/}
                        {/*    <div className="flex justify-between items-center">*/}
                        {/*        <h2 className="text-xl font-semibold flex items-center gap-2">*/}
                        {/*            <FontAwesomeIcon icon={faMoneyBill} className="h-5 w-5" />*/}
                        {/*            Pricing Plans*/}
                        {/*        </h2>*/}
                        {/*        <button */}
                        {/*            type="button" */}
                        {/*            onClick={handleAddPlan}*/}
                        {/*            className="btn btn-primary btn-sm"*/}
                        {/*        >*/}
                        {/*            <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-1" />*/}
                        {/*            Add Plan*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*    */}
                        {/*    {plans.length === 0 && (*/}
                        {/*        <div className="text-center p-4 bg-base-200 rounded-lg">*/}
                        {/*            <p>No pricing plans added yet. Click "Add Plan" to create one.</p>*/}
                        {/*        </div>*/}
                        {/*    )}*/}
                        {/*    */}
                        {/*    {plans.map((plan, index) => (*/}
                        {/*        <div key={index} className="card bg-base-200 shadow-sm">*/}
                        {/*            <div className="card-body p-4">*/}
                        {/*                <div className="flex justify-between items-center mb-4">*/}
                        {/*                    <h3 className="text-lg font-medium">Plan #{index + 1}</h3>*/}
                        {/*                    <button */}
                        {/*                        type="button" */}
                        {/*                        onClick={() => handleRemovePlan(index)}*/}
                        {/*                        className="btn btn-error btn-sm"*/}
                        {/*                    >*/}
                        {/*                        <FontAwesomeIcon icon={faMinus} className="h-4 w-4 mr-1" />*/}
                        {/*                        Remove*/}
                        {/*                    </button>*/}
                        {/*                </div>*/}
                        {/*                */}
                        {/*                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
                        {/*                    <div className="form-control">*/}
                        {/*                        <label className="label">*/}
                        {/*                            <span className="label-text">Plan Name</span>*/}
                        {/*                        </label>*/}
                        {/*                        <input*/}
                        {/*                            type="text"*/}
                        {/*                            value={plan.name || ''}*/}
                        {/*                            onChange={(e) => handlePlanChange(index, 'name', e.target.value)}*/}
                        {/*                            placeholder="e.g. Basic, Premium, etc."*/}
                        {/*                            className="input input-bordered"*/}
                        {/*                        />*/}
                        {/*                    </div>*/}
                        {/*                    */}
                        {/*                    <div className="form-control">*/}
                        {/*                        <label className="label">*/}
                        {/*                            <span className="label-text">Price</span>*/}
                        {/*                        </label>*/}
                        {/*                        <div className="flex gap-2">*/}
                        {/*                            <input*/}
                        {/*                                type="number"*/}
                        {/*                                value={plan.price?.amount || 0}*/}
                        {/*                                onChange={(e) => handlePlanChange(index, 'price.amount', parseFloat(e.target.value))}*/}
                        {/*                                placeholder="0.00"*/}
                        {/*                                min="0"*/}
                        {/*                                step="0.01"*/}
                        {/*                                className="input input-bordered w-full"*/}
                        {/*                            />*/}
                        {/*                            <select*/}
                        {/*                                value={plan.price?.currency || 'USD'}*/}
                        {/*                                onChange={(e) => handlePlanChange(index, 'price.currency', e.target.value)}*/}
                        {/*                                className="select select-bordered w-32"*/}
                        {/*                            >*/}
                        {/*                                <option value="USD">USD</option>*/}
                        {/*                                <option value="EUR">EUR</option>*/}
                        {/*                                <option value="GBP">GBP</option>*/}
                        {/*                                <option value="UAH">UAH</option>*/}
                        {/*                            </select>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*                */}
                        {/*                <div className="form-control mt-4">*/}
                        {/*                    <label className="label">*/}
                        {/*                        <span className="label-text">Description</span>*/}
                        {/*                    </label>*/}
                        {/*                    <textarea*/}
                        {/*                        value={plan.description || ''}*/}
                        {/*                        onChange={(e) => handlePlanChange(index, 'description', e.target.value)}*/}
                        {/*                        placeholder="Describe what's included in this plan"*/}
                        {/*                        className="textarea textarea-bordered h-24"*/}
                        {/*                    />*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*</div>*/}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventEdit;