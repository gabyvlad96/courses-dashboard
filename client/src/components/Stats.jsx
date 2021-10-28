import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { Bar } from 'react-chartjs-2';
import { baseUrl, prepareChartData } from '../utils/utils';
import './stats.css';

const chartOptions = {
    type: 'bar',
    indexAxis: 'y',
};

function Stats() {
    const [timeInterval, setTimeInterval] = useState([4, 10]);
    const [noOfUsers, setNoOfUsers] = useState(0);
    const [coursesLength, setCoursesLength] = useState({
        courses: null,
        length: null,
    });
    const [coursesPolpularity, setCoursesPolpularity] = useState({
        courses: null,
        participants: null,
    });

    useEffect(() => {
        fetchCoursesByLength();
        fetchCoursesByPopularity();
        fetchNbOfUsersInTimeInterval();
    }, []);

    const fetchNbOfUsersInTimeInterval = async () => {
        try {
            const response = await fetch(`${baseUrl}/stats/timeCompletion?start=${timeInterval[0]}:00:00&end=${
                timeInterval[1] === 24 ? '23:59:00' : `${timeInterval[1]}:00:00`}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const noOfUsers = await response.json()
            setNoOfUsers(noOfUsers);
		} catch (error) {
			console.log(error);
		}
    }

    const fetchCoursesByLength = async () => {
        try {
            const response = await fetch(`${baseUrl}/stats/coursesLength`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const coursesData = await response.json()
            const [coursesByLength, lengthOfCourses] = coursesData.reduce(([a, b], {course, length}) => {
                a.push(course.title);
                b.push(Math.floor(length / 24))
                return [a, b]}, [[],[]]);
            setCoursesLength({
                courses: coursesByLength,
                length: lengthOfCourses,
            });
		} catch (error) {
			console.log(error);
		}
    }

    const fetchCoursesByPopularity = async () => {
        try {
            const response = await fetch(`${baseUrl}/stats/coursesPopularity`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const coursesData = await response.json()
            const [coursesByPolpularity, participants] = coursesData.reduce(([a, b], {course, participants}) => {
                a.push(course.title);
                b.push(participants);
                return [a, b]}, [[],[]]);
            setCoursesPolpularity({
                courses: coursesByPolpularity,
                participants,
            });
		} catch (error) {
			console.log(error);
		}
    }

    const handleChange = (_, newValue) => {
        setTimeInterval(newValue);
    };

    const submitChange = () => {
        fetchNbOfUsersInTimeInterval();
    }

    return (
        <div className="stats-main">
            <div className="courses-length-chart card">
                {coursesLength.courses && 
                    <Bar
                        data={prepareChartData(coursesLength.length, coursesLength.courses, "Courses length", "#51a0e3")}
                        responsive={'true'}
                        options={chartOptions}
                    />
                }
            </div>
            <div className="courses-popularity-chart card">
                {coursesPolpularity.courses && 
                    <Bar
                        data={prepareChartData(coursesPolpularity.participants, coursesPolpularity.courses, "Courses popularity", "#a4dfdf")}
                        responsive={'true'}
                        options={chartOptions}
                    />
                }
            </div>
            <div className="period-select card">
                <h4>Users who completed courses in the time range</h4>
                <Box sx={{ width: 300, height: 50 }}>
                    <Slider
                        getAriaLabel={() => 'Temperature range'}
                        value={timeInterval}
                        max={24}
                        onChange={handleChange}
                        onChangeCommitted={submitChange}
                        valueLabelDisplay="auto"
                        disableSwap
                        valueLabelFormat={timeInterval => <div>{timeInterval < 10 ? `0${timeInterval}` : timeInterval}:00</div>}
                    />
                </Box>
                <h1 className="no-of-users">{noOfUsers}</h1>
            </div>
        </div>
    )
}

export default Stats
