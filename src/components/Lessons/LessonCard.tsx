import React from 'react';
import { formatDistanceToNow, isPast } from 'date-fns';
import {Link} from "react-router-dom";
import {PaidLesson} from "../../types/Event.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faEdit, faPlus} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../context/AuthContext.tsx";

interface PaidLessonCardProps {
    lesson: PaidLesson;
}

const LessonCard: React.FC<PaidLessonCardProps> = ({ lesson }) => {
    const startDate = new Date(lesson.start_dt);
    const endDate = new Date(lesson.end_dt);
    const { isManager } = useAuth();
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
                        <FontAwesomeIcon icon={faCalendar} className="h-5 w-5 text-gray-400" />
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
                    {isManager && (
                        <Link to={`/lessons/${lesson.id}/edit`} className="btn btn-outline btn-warning">
                            <FontAwesomeIcon icon={faEdit} className="h-5 w-5" />
                            Edit lesson
                        </Link>
                    )}

                    {!lesson.is_paid && (
                        <span className="text-sm text-red-500 text-center">Not included in your plan</span>
                    )}
                </div>
            </div>

        </li>
    );
};

export default LessonCard;