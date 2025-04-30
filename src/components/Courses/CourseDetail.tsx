import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";
import { Course } from "../../types/Course";

function CourseDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const data = await courseService.getCourse(id);
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

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Set your target date here (e.g., course.date if available)
    useEffect(() => {
        // Replace with your course date or a fixed date for testing
        const target = course?.date ? new Date(course.date) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

        const tick = () => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [course?.date]);

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

    if (!course) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p>Course not found</p>
                <Link to="/courses" className="btn btn-primary mt-4">Back to Courses</Link>
            </div>
        );
    }

    return (

        <div className="container mx-auto px-0 sm:px-4 md:max-w-6xl">
            <div className="mb-6 px-4 sm:px-0">
                <Link to="/courses" className="btn btn-outline btn-sm">
                    ← Back to Courses
                </Link>
            </div>

            <div className="card sm:card-side bg-base-100 shadow-xl rounded-none sm:rounded-xl">
                <figure className="lg:w-1/2">
                    <img
                        src={course.image || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                        alt={course.name}
                        className="object-cover w-full h-full"
                    />
                </figure>
                <div className="card-body lg:w-1/2">
                    <div className="flex flex-col gap-4">
                        <h1 className="card-title text-3xl">{course.name}</h1>

                        <div className="flex items-center gap-2 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(course.date).toLocaleDateString()}</span>
                        </div>

                        <div className="prose max-w-none">
                            <p>{course.description}</p>
                        </div>

                        {course.location && (
                            <div className="flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{course.location}</span>
                            </div>
                        )}

                        {/*<div className="carousel carousel-center bg-neutral rounded-box max-w-md space-x-4 p-4">*/}
                        {/*    <div className="carousel-item">*/}
                        <div className="flex items-center gap-2 text-sm">

                                <div className="card w-64 bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <div className="flex justify-between">
                                            <h2 className="text-3xl font-bold">Beginner</h2>
                                            <span className="text-xl">$99</span>
                                        </div>
                                        <ul className="mt-6 flex flex-col gap-2 text-xs">
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>High-resolution image generation</span>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Customizable style templates</span>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Batch processing capabilities</span>
                                            </li>
                                        </ul>
                                        <div className="mt-6">
                                            <button className="btn btn-primary btn-block">Get paid</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="card w-64 bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <span className="badge badge-xs badge-warning">Most Popular</span>
                                        <div className="flex justify-between">
                                            <h2 className="text-3xl font-bold">Efficient</h2>
                                            <span className="text-xl">$499</span>
                                        </div>
                                        <ul className="mt-6 flex flex-col gap-2 text-xs">
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Everything from Beginner</span>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Customizable style templates</span>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Batch processing capabilities</span>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>AI-driven image enhancements</span>
                                            </li>
                                            <li className="opacity-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span className="line-through">Seamless cloud integration</span>
                                            </li>
                                            <li className="opacity-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span className="line-through">Real-time collaboration tools</span>
                                            </li>
                                        </ul>
                                        <div className="mt-6">
                                            <button className="btn btn-primary btn-block">Get paid</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="card w-64 bg-base-100 shadow-sm">
                                    <div className="card-body">
                                        <span className="badge badge-xs badge-accent">Individual touch</span>
                                        <div className="flex justify-between">
                                            <h2 className="text-3xl font-bold">Premium</h2>
                                            <span className="text-xl">$1777</span>
                                        </div>
                                        <ul className="mt-6 flex flex-col gap-2 text-xs">
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Everything from Efficient</span>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Customizable style templates</span>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Batch processing capabilities</span>
                                            </li>
                                            <li>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>AI-driven image enhancements</span>
                                            </li>
                                            <li className="opacity-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Seamless cloud integration</span>
                                            </li>
                                            <li className="opacity-50">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>Individual consultation with the Influencer</span>
                                            </li>
                                        </ul>
                                        <div className="mt-6">
                                            <button className="btn btn-primary btn-block">Get paid</button>
                                        </div>
                                    </div>
                                </div>

                        {/*    </div>*/}
                        </div>

                        <div className="grid grid-flow-col gap-3 text-center auto-cols-max">
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                <span className="countdown font-mono text-3xl">
                                    <span style={{ ["--value" as unknown as number]: timeLeft.days } as React.CSSProperties} aria-live="polite">{timeLeft.days}</span>
                                </span> days
                            </div>
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                <span className="countdown font-mono text-3xl">
                                    <span style={{ ["--value" as unknown as number]: timeLeft.hours } as React.CSSProperties} aria-live="polite">{timeLeft.hours}</span>
                                </span> hours
                            </div>
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                <span className="countdown font-mono text-3xl">
                                    <span style={{ ["--value" as unknown as number]: timeLeft.minutes } as React.CSSProperties} aria-live="polite">{timeLeft.minutes}</span>
                                </span> min
                            </div>
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                <span className="countdown font-mono text-3xl">
                                    <span style={{ ["--value" as unknown as number]: timeLeft.seconds } as React.CSSProperties} aria-live="polite">{timeLeft.seconds}</span>
                                </span> sec
                            </div>
                        </div>

                        {course.contacts && (
                            <div className="alert alert-info shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="font-bold">Contact Information</h3>
                                    <div className="text-sm">{course.contacts}</div>
                                </div>
                            </div>
                        )}

                        <div className="card-actions justify-end mt-4">
                            {course.website && (
                                <a
                                    href={course.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline"
                                >
                                    Visit Website
                                </a>
                            )}
                            <button className="btn btn-primary">Register Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default CourseDetail;
