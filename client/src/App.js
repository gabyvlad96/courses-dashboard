import React, { useEffect, useState } from 'react';
import { Navigation, UserDetails, CourseDetails, Stats } from './components'
import { baseUrl } from './utils/utils';
import './App.css';


function App() {
	const [tab, setTab] = useState(1);
	const [users, setUsers] = useState(null);
	const [courses, setCourses] = useState(null);
	const [userDetails, setUserDetails] = useState({
		data: null,
		listIndex: null,
	});
	const [courseDetails, setCourseDetails] = useState({
		data: null,
		listIndex: null,
	});

 	useEffect(async () => {
        try {
            const usersResponse = await fetch(`${baseUrl}/users`);
            if (!usersResponse.ok) throw new Error(`HTTP error! status: ${usersResponse.status}`);
            const users = await usersResponse.json()
			setUsers(users);

			const coursesResponse = await fetch(`${baseUrl}/courses`);
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

	const fetchDetails = (itemData, itemType, index) => {
		const functionToCall = itemType === "users" ? setUserDetails : setCourseDetails;
		functionToCall({
			data: itemData,
			listIndex: index,
		})
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
					<Navigation dataType="users" data={users} selectedItem={userDetails.listIndex} onItemClick={fetchDetails}/>
					{userDetails.data && <UserDetails user={userDetails.data}/>}	
				</div>
			)}
			{tab === 2 && (
				<div className="main-container">
					<Navigation dataType="courses" data={courses} selectedItem={userDetails.listIndex} onItemClick={fetchDetails}/>
					{courseDetails.data && <CourseDetails course={courseDetails.data}/>}
				</div>
			)}
			{tab === 3 && (
				<div className="main-container">
					<Stats />
				</div>
			)}
		</div>
    </div>
  );
}

export default App;
