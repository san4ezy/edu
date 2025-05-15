import React from 'react';
import { formatDistanceToNow, isPast } from 'date-fns';
import {Link} from "react-router-dom";
import {PaidLesson} from "../../types/Event.ts";

interface PaidLessonCardProps {
    lesson: PaidLesson;
}

const LessonCard: React.FC<PaidLessonCardProps> = ({ lesson }) => {
    const startDate = new Date(lesson.start_dt);
    const endDate = new Date(lesson.end_dt);
    const isStarted = isPast(startDate);
    const displayDate = isStarted ? endDate : startDate;
    const dateLabel = isStarted ? 'Ends' : 'Starts';
    const statusClass = lesson.status === 'NEW' ? '' :
                              lesson.status === 'VIEWED' ? 'warning' :
                              lesson.status === 'PASSED' ? 'success' :
                              'neutral';

    return (
        <li className={`step step-${statusClass}`} key={lesson.id}>

            <div className="card">
                <h3 className="card-title text-xl mt-8">{lesson.name}</h3>
                <div className="card-body text-justify p-4 sm:p-6 lg:p-8">
                    <span>{new Date(lesson.start_dt).toLocaleDateString()}</span>
                    {lesson.short_description}
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
                </div>
                <div className="card-actions flex-col items-stretch gap-2">
                    <Link
                        to={`/lessons/${lesson.id}`}
                        className={`btn w-full ${!lesson.is_paid ? "btn-disabled" : isStarted ? "btn-accent" : "btn-disabled"}`}
                    >
                        Open
                    </Link>
                    {!lesson.is_paid && (
                        <span className="text-sm text-red-500 text-center">Not included in your plan</span>
                    )}
                </div>
            </div>

        </li>
    );
};

export default LessonCard;