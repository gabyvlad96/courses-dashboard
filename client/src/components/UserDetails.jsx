import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { baseUrl, months, prepareChartData } from '../utils/utils';
import './userDetails.css';

const chartOptions = {
    scales: { yAxes: { max: 5, ticks: { stepSize: 1 }}}
};

const UserDetails = ({ user }) => {
    const [courses, setCourses] = useState(null);
    const [yearCount, setYearCount] = useState(null);

    useEffect(async () => {
        try {
            const response = await fetch(`${baseUrl}/user/${user.id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const [ courses, yearCount ] = await response.json()
            setCourses(courses);
            setYearCount(yearCount)
            console.log(courses);
		} catch (error) {
			console.log(error);
		}
    }, [user]);

    return (
        <div className="userDetails-main">
            <div className="card user-info">
                <div className="user-info-field">
                    <h3>Name:</h3>
                    <h4>{user.firstName} {user.lastName}</h4>
                </div>
                <div className="user-info-field">
                    <h3>Email:</h3>
                    <h4>{user.email}</h4>
                </div>
            </div>
            <div className="card user-courses">
                <h3>Courses:</h3>
                <ul>
                    {courses && courses.map((course, i) => (
                        <li key={i}><div>{i+1}</div> {course.title}</li>
                    ))}
                </ul>
            </div>
            <div className="user-chart card">
                {yearCount && 
                    <Line
                        data={prepareChartData(yearCount, months, "User engagement in 2021")}
                        responsive={true}
                        options={chartOptions}
                    />
                }
            </div>
        </div>
    )
}

export default UserDetails
