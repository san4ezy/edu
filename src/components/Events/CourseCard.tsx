import React from 'react';
import { formatDistanceToNow, isPast } from 'date-fns';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import {PaidCourse} from "../../types/Event.ts";

interface CourseCardProps {
    course: PaidCourse;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const startDate = new Date(course.start_dt);
    const endDate = new Date(course.end_dt);
    const isStarted = isPast(startDate);
    const displayDate = isStarted ? endDate : startDate;
    const dateLabel = isStarted ? 'Ends' : 'Starts';

    return (
        <div key={course.id} className="card w-full bg-base-100 shadow-xl">
            <figure className="relative h-48">
                {course.image ? (
                    <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )}
            </figure>
            <div className="card-body">
                <h2 className="card-title">{course.name}</h2>
                {course.short_description && (
                    <p className="text-gray-600 text-justify line-clamp-3">{course.short_description}</p>
                )}
                <br/>
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="h-5 w-5 text-gray-400" />
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