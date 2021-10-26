from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json
from datetime import datetime
from datetime import timedelta
from dateutil.parser import parse
import collections

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def open_files():
    with open('users.json', 'r') as users_file:
        data=users_file.read()
    users = json.loads(data)

    with open('courses.json', 'r') as courses_file:
        data=courses_file.read()
    courses = json.loads(data)

    with open('certificates.json', 'r') as certificates_file:
        data=certificates_file.read()
    certificates = json.loads(data)
    return users, courses, certificates

def map_data():
    courses_map = {courses[i]["id"]: i for i in range(len(courses))}
    users_map = {users[i]["id"]: i for i in range(len(users))}
    return courses_map, users_map

def get_course(id):
    return courses[courses_map[id]]

def get_user(id):
    return users[users_map[id]]
    
def get_course_completion_time(certificate, option="standard"):
    if option == "hours":
        return (parse(certificate["completedDate"]) - parse(certificate["startDate"])).total_seconds() // 3600
    return parse(certificate["completedDate"]) - parse(certificate["startDate"])

users, courses, certificates = open_files()
courses_map, users_map = map_data()


@app.route('/users')
def get_users():
    """
    returns all users
    """
    return jsonify(users)

@app.route('/courses')
def get_courses():
    """
    returns all courses
    """
    return jsonify(courses)

@app.route('/user/<id>')
def get_user_courses(id):
    """
    returns all courses of a certain user
    """
    user_courses_ids = [certificate["course"] for certificate in certificates if certificate["user"] == id]
    user_courses = [get_course(c_id) for c_id in set(user_courses_ids)]
    return jsonify(user_courses)

@app.route('/course/<id>')
def get_course_data(id):
    """
    returns list of:
    0: average completion time of the course
    1: user who completed it faster
    2: fastest completion time
    """
    no_of_courses = 0
    total_time = timedelta(seconds=0)
    min_time = timedelta(days=10000)

    for certificate in certificates:
        if certificate["course"] == id:
            no_of_courses += 1
            completion_time = get_course_completion_time(certificate)
            total_time += completion_time
            if completion_time < min_time:
                min_time = completion_time
                fastest_user = certificate["user"]
    avg_completion_time = total_time / no_of_courses

    return jsonify(str(avg_completion_time), get_user(fastest_user), str(min_time))

@app.route('/stats/timeCompletion')
def get_stats():
    """
    returns the number of users who completed the course
    in a given time-frame defined by (start, end) arguments
    ....
    """
    start = request.args.get("start")
    end = request.args.get("end")
 
    users_time_interval = {certificate["user"] for certificate in certificates if 
        parse(start).time() < parse(certificate["completedDate"]).time() < parse(end).time()}
    
    return jsonify(len(users_time_interval))

@app.route('/stats/coursesLength')
def get_courses_length():
    """
    returns a list of courses sorted by their length in hours
    """
    courses_by_id = collections.defaultdict(list)
    for certificate in certificates:
        courses_by_id[certificate["course"]].append(get_course_completion_time(certificate, "hours"))
    
    ids_by_length = sorted([(course_id, sum(durations) / len(durations)) for course_id, durations in courses_by_id.items()], 
        key = lambda x: x[1])

    courses_by_length = [{"course": get_course(c_id), "length": length } for c_id, length in ids_by_length]

    return jsonify(courses_by_length)

@app.route('/stats/coursesPopularity')
def get_courses_popularity():
    """
    returns a list of courses sorted by their popularity
    """
    courses_participants = {}
    for certificate in certificates:
        courses_participants[certificate["course"]] = courses_participants.get(certificate["course"], 0) + 1

    courses_participants_sorted = sorted(courses_participants.items(), key = lambda x: x[1], reverse=True)

    courses_obj_participants_sorted = [{
        "course": get_course(c_id),
        "participants": participants
        } for c_id, participants in courses_participants_sorted]

    return jsonify(courses_obj_participants_sorted)
