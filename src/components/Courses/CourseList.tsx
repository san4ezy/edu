import React, { useEffect, useState } from "react";
import { PaidCourse } from "../../types/Course";
import courseService from "../../services/courseService";
import CourseCard from './CourseCard';

const CourseList: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<PaidCourse[]>([]);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null as string | null,
        previous: null as string | null,
    });
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async (searchTerm = "", pageNum = 1) => {
        try {
            setLoading(true);
            const offset = (pageNum - 1) * limit;
            const response = await courseService.list({
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
            setError(null);
        } catch (err) {
            setError('Failed to load courses. Please try again later.');
            console.error('Error fetching courses:', err);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(search, page);
    }, [search, page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchCourses(search, 1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
            {courses.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    <p className="text-xl">No courses available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default CourseList;
