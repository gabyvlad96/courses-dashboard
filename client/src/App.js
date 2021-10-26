import React, { useEffect, useState } from 'react';
import { Navigation, UserDetails, CourseDetails } from './components'
import './App.css';

const BASE_URL = 'http://127.0.0.1:5000';

function App() {
	const [tab, setTab] = useState(1);
	const [users, setUsers] = useState(null);
	const [courses, setCourses] = useState(null);
	const [userDetails, setUserDetails] = useState(null);
	const [courseDetails, setCourseDetails] = useState(null);

 	useEffect(async () => {
        try {
            const usersResponse = await fetch(`${BASE_URL}/users`);
            if (!usersResponse.ok) throw new Error(`HTTP error! status: ${usersResponse.status}`);
            const users = await usersResponse.json()
			setUsers(users);

			const coursesResponse = await fetch(`${BASE_URL}/courses`);
			if (!coursesResponse.ok) throw new Error(`HTTP error! status: ${coursesResponse.status}`);
            const courses = await coursesResponse.json()
			setCourses(courses);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const handleTabSelection = (newTab) => {
		setTab(newTab);
	};

	const fetchDetails = (itemData, itemType) => {
		itemType === "users" ?  setUserDetails(itemData) : setCourseDetails(itemData);
	}

  return (
    <div className="App">
		<div className="header">
			<div onClick={() => handleTabSelection(1)} className={tab === 1 ? 'selected' : ''}>Users</div>
			<div onClick={() => handleTabSelection(2)} className={tab === 2 ? 'selected' : ''}>Courses</div>
			<div onClick={() => handleTabSelection(3)} className={tab === 3 ? 'selected' : ''}>Stats</div>
		</div>
		<div className="main">
			{tab === 1 && (
				<div className="main-container">
					<Navigation dataType="users" data={users} onItemClick={fetchDetails}/>
					{userDetails && <UserDetails user={userDetails}/>}	
				</div>
			)}
			{tab === 2 && (
				<div className="main-container">
					<Navigation dataType="courses" data={courses} onItemClick={fetchDetails}/>
					{courseDetails && <CourseDetails course={courseDetails}/>}
				</div>
			)}
		</div>
    </div>
  );
}

export default App;
