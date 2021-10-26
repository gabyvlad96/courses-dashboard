import React, { useEffect, useState } from 'react';
import './courseDetails.css';

const BASE_URL = 'http://127.0.0.1:5000';

const CourseDetails = ({ course }) => {
    const [courseData, setCourseData] = useState({
        avgCompletionTime: null,
        fastestUser: null,
        fastestTime: null,
      });
    useEffect(async () => {
        try {
            const response = await fetch(`${BASE_URL}/course/${course.id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const [avgCompletionTime, fastestUser, fastestTime] = await response.json();
            setCourseData({
                avgCompletionTime,
                fastestUser,
                fastestTime,
            })
            console.log(courseData);
		} catch (error) {
			console.log(error);
		}
    }, [course]);

    return (
        <div className="courseDetails-main">
            {courseData.avgCompletionTime &&
                <div className="completionTime card">
                    <h3>Average completion time</h3>
                    <h1>{courseData.avgCompletionTime.split(',')[0]}</h1>
                    <h2>
                        {courseData.avgCompletionTime.split(',')[1].split(':')[0]} hours and&nbsp;
                        {parseInt(courseData.avgCompletionTime.split(',')[1].split(':')[1]) || 0} minutes
                    </h2>
                </div>
            }
            {courseData.fastestUser &&
                <div className="fastestTime card">
                    <h3>Fastest completion by</h3>
                    <h1>{courseData.fastestUser.firstName} {courseData.fastestUser.lastName}</h1>
                    <h2>
                        {parseInt(courseData.fastestTime.split(':')[0]) || 0} hours and&nbsp;
                        {parseInt(courseData.fastestTime.split(':')[1]) || 0} minutes
                    </h2>
                </div>
            }
        </div>
    )
}

export default CourseDetails
