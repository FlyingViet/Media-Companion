from flask import Flask, render_template, request, jsonify
import pymysql
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

f = open('config.json')
data = json.load(f)

class Database:
    def __init__(self):
        host = data['hostInfo']
        user = data['userInfo']
        password = data['passwordInfo']
        db = data['databaseInfo']
        self.con = pymysql.connect(host=host, user=user, password=password, db=db, cursorclass=pymysql.cursors.DictCursor)
        self.cur = self.con.cursor()

    def list_users(self):
        self.cur.execute("SELECT id, email, password from Users")
        result = self.cur.fetchall()
        return result

    def insert_user(self, email, password):
        self.cur.execute("INSERT INTO Users(email, password) VALUES(%s, %s)", (email, password))

@app.route('/api/', methods=['GET', 'POST'])
def home():
    db = Database()
    if request.method == "POST":
        payload = request.get_json()
        email = payload['email']
        password = payload['password']
        db.insert_user(email, password)
        db.con.commit()
        return 'Post Success'
    elif request.method == "GET":
        users = db.list_users()
        print(users)
        return jsonify(users)


if __name__ == '__main__':
    app.run(debug=True)