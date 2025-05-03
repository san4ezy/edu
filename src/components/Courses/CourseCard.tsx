import React from 'react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { PaidCourse } from '../../types/Course';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

interface CourseCardProps {
    course: PaidCourse;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const startDate = new Date(course.course.start_dt);
    const endDate = new Date(course.course.end_dt);
    const isStarted = isPast(startDate);
    const displayDate = isStarted ? endDate : startDate;
    const dateLabel = isStarted ? 'Ends' : 'Starts';

    return (
        <div key={course.id} className="card w-full bg-base-100 shadow-xl">
            <figure className="relative h-48">
                {course.course.image ? (
                    <img
                        src={course.course.image}
                        alt={course.course.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )}
            </figure>
            <div className="card-body">
                <h2 className="card-title">{course.course.name}</h2>
                {course.course.short_description && (
                    <p className="text-gray-600 text-justify line-clamp-3">{course.course.short_description}</p>
                )}
                <br/>
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        {/*<FontAwesomeIcon icon={faCalendar} className="h-5 w-5 text-gray-400" />*/}
                        <span>
                            {dateLabel} {formatDistanceToNow(displayDate, { addSuffix: true })}
                        </span>
                    </div>
                    <span>{course.lessons.length} lessons</span>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link to={`/courses/${course.id}`} className="btn btn-accent">
                        Dive in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;