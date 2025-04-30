import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Course } from "../../types/Course";
import courseService from "../../services/courseService";

function CourseList() {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null as string | null,
        previous: null as string | null,
    });
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const fetchCourses = async (searchTerm = "", pageNum = 1) => {
        try {
            setLoading(true);
            const offset = (pageNum - 1) * limit;
            const response = await courseService.getCourses({
                search: searchTerm,
                limit,
                offset,
            });

            setCourses(response.data || []);
            setPagination({
                count: response.pagination.count || 0,
                next: response.pagination.next,
                previous: response.pagination.previous,
            });
        } catch (error) {
            console.error("Failed to fetch Courses:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(search, page);
    }, [search, page]);

    const handleSearch = (e: React.FormCourse) => {
        e.prcourseDefault();
        setPage(1);
        fetchCourses(search, 1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Courses</h1>

            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="input input-bordered flex-grow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center my-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    {!courses || courses.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">There are no courses yet.</p>
                            <p className="text-gray-500">You should buy some before. Take a look the <Link className="link" to="/events">Events list</Link> available to you.</p>
                        </div>
                    ) : (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                        {courses.map((course) => (
                            <div key={course.id} className="card bg-base-100 image-full w-96 shadow-sm">
                                {/* Set a photo as background if defined, else set bg color */}
                                <figure>
                                    <img
                                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                        alt="Shoes" />
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{course.name}</h2>
                                    {course.description && <p className="text-justify">{course.description}</p>}
                                    <div className="card-actions justify-end">
                                        <Link to={`/courses/${course.id}`} className="btn btn-accent">
                                            Dive in
                                        </Link>
                                        <Link to={`/courses/${course.id}`} className="btn btn-primary">
                                            I wish it
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>

                    )}

                    {courses && courses.length > 0 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <div className="join">
                                <button
                                    className="join-item btn"
                                    disabled={!pagination.previous}
                                    onClick={() => handlePageChange(page - 1)}
                                >«</button>
                                <button className="join-item btn">
                                    {page} of {Math.ceil(pagination.count / limit)}
                                </button>
                                <button
                                    className="join-item btn"
                                    disabled={!pagination.next}
                                    onClick={() => handlePageChange(page + 1)}
                                >»</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default CourseList;
