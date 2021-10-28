
## Introduction
The application displays relevant information and statistics regarding the participation of users in
different courses.  
The information is based on static data stored as JSON files.

## Usage
You can go to http://coursesdashboard.aws-gabriel.de/ and see the app live in action.

If you want to run it locally you need to start the server and the web client separately.

Start the server from the `/server` directory:

```
python3 -m flask run
 ```

 Or start it with Docker:
```
docker build --tag server-app .
docker run --publish 8080:5000 server-app
```

To start the client app you simply go to `/client`, install npm dependencies and run it.
```
npm install
npm start
```

## Description
### Structure
The server application is running on AWS ECS in a single container and the static website is hosted using S3.

The app is composed of a Flask server and a React web app.
I opted for Flask because of its flexibility and easiness to build and deploy the application in the given context.
### Endpoints

- `/users` - returns a list of dictionaries with all users (same as `users.json`)
- `/courses` - returns a list of dictionaries with all courses (same as `courses.json`)
- `/user<id>` - a list of two items:
  - list of all courses of a certain user. No duplicate courses included
  - list of the number of courses started every month. Every index in the list corresponds to a month.
    This helps calculate user engagement based on the number of courses started in the current year. Duplicate courses are included
- `/course/<id>` - a list of four items
  - string representing the average time completion of the course
  - object representing the user who completed the course in the shortest time
  - string of the fastest completion time made by the user at `index-1`
  - list of the number of users that started the course every month. Every index in the list corresponds to a month.
    This is to calculate the course's popularity. It includes users who started the course twice or more.
- `stats/timeCompletion` - requires two arguments: `start` and `end`. The endpoint 
  returns the total number of users who completed the course in a given time range defined by the two arguments.

- `stats/coursesLength` - returns a list of all courses sorted by their length in hours. The length is calculated based on the 
  average completion time of the course
- `stats/coursesPopularity` - returns a list of all courses sorted by their number of participants. Duplicate pairs of course-user are not included




 
