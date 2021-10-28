from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from datetime import datetime
from datetime import timedelta
from dateutil.parser import parse
import collections
from models import Users, Courses, Certificates

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

u = Users()
c = Courses()
ct = Certificates()


@app.route('/users')
def get_users():
    """
    returns all users
    """
    return jsonify(u.users)

@app.route('/courses')
def get_courses():
    """
    returns all courses
    """
    return jsonify(c.courses)

@app.route('/user/<id>')
def get_user_courses(id):
    """
    returns
    0: all courses of a certain user
    1: array of number courses per month - each index corresponds to a month
    """
    user_courses_ids = []
    year_count = [0] * 12
    for certificate in ct.certificates:
        if certificate["user"] == id:
            user_courses_ids.append(certificate["course"])
            if certificate["startDate"][0:4] == "2021":
                year_count[int(certificate["startDate"][5:7])] += 1

    user_courses = [c.get_course(course_id) for course_id in set(user_courses_ids)]
    return jsonify(user_courses, year_count)

@app.route('/course/<id>')
def get_course_data(id):
    """
    returns list of:
    0: average completion time of the course
    1: user who completed it faster
    2: fastest completion time
    3: array of number users per month - each index corresponds to a month
    """
    no_of_courses = 0
    total_time = timedelta(seconds=0)
    min_time = timedelta(days=10000)
    year_count = [0] * 12

    for certificate in ct.certificates:
        if certificate["course"] == id:
            no_of_courses += 1
            completion_time = c.get_course_completion_time(certificate)
            total_time += completion_time
            if completion_time < min_time:
                min_time = completion_time
                fastest_user = certificate["user"]
            if certificate["startDate"][0:4] == "2021":
                year_count[int(certificate["startDate"][5:7])] += 1
    avg_completion_time = total_time / no_of_courses

    return jsonify(str(avg_completion_time), u.get_user(fastest_user), str(min_time), year_count)

@app.route('/stats/timeCompletion')
def get_stats():
    """
    returns the number of users who completed the course
    in a given time-frame defined by (start, end) arguments
    ....
    """
    start = request.args.get("start")
    end = request.args.get("end")
    if not start or not end:
        return
 
    users_time_interval = [certificate["user"] for certificate in ct.certificates if 
        parse(start).time() < parse(certificate["completedDate"]).time() < parse(end).time()]
    print(len(users_time_interval),len(set(users_time_interval)))
    return jsonify(len(set(users_time_interval)))

@app.route('/stats/coursesLength')
def get_courses_length():
    """
    returns a list of courses sorted by their length in hours
    """
    courses_by_id = collections.defaultdict(list)
    for certificate in ct.certificates:
        courses_by_id[certificate["course"]].append(c.get_course_completion_time(certificate, "hours"))

    ids_by_length = sorted([(course_id, sum(durations) / len(durations)) for course_id, durations in courses_by_id.items()], 
        key = lambda x: x[1])
    courses_by_length = [{"course": c.get_course(c_id), "length": length } for c_id, length in ids_by_length]

    return jsonify(courses_by_length)

@app.route('/stats/coursesPopularity')
def get_courses_popularity():
    """
    returns a list of courses sorted by their popularity
    """
    # strip irrelevant data and duplicates
    certificates_striped = [{"course": certificate["course"], "user": certificate["user"]} for certificate in ct.certificates]
    certificates_updated = [dict(t) for t in {tuple(certificate.items()) for certificate in certificates_striped}]
    print(len(certificates_striped), len(certificates_updated))

    courses_participants = {}
    for certificate in certificates_updated:
        courses_participants[certificate["course"]] = courses_participants.get(certificate["course"], 0) + 1

    courses_participants_sorted = sorted(courses_participants.items(), key = lambda x: x[1], reverse=True)

    final_courses_participants = [{
        "course": c.get_course(c_id),
        "participants": participants
        } for c_id, participants in courses_participants_sorted]

    return jsonify(final_courses_participants)
