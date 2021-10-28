import json
from dateutil.parser import parse

class Users:
    def __init__(self):
        with open('users.json', 'r') as users_file:
            data=users_file.read()
        self.users = json.loads(data)
        self.users_map = {self.users[i]["id"]: i for i in range(len(self.users))}

    def get_user(self, id):
        return self.users[self.users_map[id]]

class Courses:
    def __init__(self):
        with open('courses.json', 'r') as courses_file:
            data=courses_file.read()
        self.courses = json.loads(data)
        self.courses_map = {self.courses[i]["id"]: i for i in range(len(self.courses))}
    
    def get_course(self, id):
        return self.courses[self.courses_map[id]]

    def get_course_completion_time(self, certificate, option="standard"):
        if option == "hours":
            return (parse(certificate["completedDate"]) - parse(certificate["startDate"])).total_seconds() // 3600
        return parse(certificate["completedDate"]) - parse(certificate["startDate"])

class Certificates:
    def __init__(self):
        with open('certificates.json', 'r') as certificates_file:
            data=certificates_file.read()
        self.certificates = json.loads(data)
