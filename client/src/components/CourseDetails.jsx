import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { baseUrl, months, prepareChartData } from '../utils/utils';
import './courseDetails.css';

const chartOptions = {
    scales: { y: { ticks: { stepSize: 1 }}}
};

const CourseDetails = ({ course }) => {
    const [courseData, setCourseData] = useState({
        avgCompletionTime: null,
        fastestUser: null,
        fastestTime: null,
        yearCount: null,
      });
    useEffect(async () => {
        try {
            const response = await fetch(`${baseUrl}/course/${course.id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const [avgCompletionTime, fastestUser, fastestTime, yearCount] = await response.json();
            setCourseData({
                avgCompletionTime,
                fastestUser,
                fastestTime,
                yearCount,
            })
            console.log(courseData);
		} catch (error) {
			console.log(error);
		}
    }, [course]);

    return (
        <div className="course-details-main">
            {courseData.avgCompletionTime &&
                <div className="completion-time card">
                    <h3>Average completion time</h3>
                    <h1>{courseData.avgCompletionTime.split(',')[0]}</h1>
                    <h2>
                        {courseData.avgCompletionTime.split(',')[1].split(':')[0]} hours and&nbsp;
                        {parseInt(courseData.avgCompletionTime.split(',')[1].split(':')[1]) || 0} minutes
                    </h2>
                </div>
            }
            {courseData.fastestUser &&
                <div className="fastest-time card">
                    <h3>Fastest completion by</h3>
                    <h1>{courseData.fastestUser.firstName} {courseData.fastestUser.lastName}</h1>
                    <h2>
                        {parseInt(courseData.fastestTime.split(':')[0]) || 0} hours and&nbsp;
                        {parseInt(courseData.fastestTime.split(':')[1]) || 0} minutes
                    </h2>
                </div>
            }
            {courseData.yearCount && 
                <div className="course-chart card">
                    <Line
                        data={prepareChartData(courseData.yearCount, months, "Course popularity")}
                        responsive={true}
                        options={chartOptions}
                    />
                </div>
            }
        </div>
    )
}

export default CourseDetails
