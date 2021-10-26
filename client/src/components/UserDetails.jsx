import React, { useEffect, useState } from 'react';
import './userDetails.css';

const BASE_URL = 'http://127.0.0.1:5000';

const UserDetails = ({ user }) => {
    const [courses, setCourses] = useState('');

    useEffect(async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/${user.id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const courses = await response.json()
			setCourses(courses);
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
                        <li key={i}>{course.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default UserDetails
