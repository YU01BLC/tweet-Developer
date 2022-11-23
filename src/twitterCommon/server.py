from flask import Flask
from flask import request, make_response, jsonify
from flask_cors import CORS
from userTimeline import timeline
from myTimeline import my_timeline

app = Flask(__name__, static_folder="./build/static", template_folder="./build")
CORS(app, origins=["http://localhost:19006", "http://127.0.0.1:5000", "http://127.0.0.1:5000/user_timeline"])

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route("/", methods=['GET'])
def index():
    print('\n'.join
    ([''.join
      ([('Engineer'[(x-y)%8 ]
        if((x*0.05)**2+(y*0.1)**2-1)
          **3-(x*0.05)**2*(y*0.1)
          **3<=0 else' ')
            for x in range(-30,30)])
            for y in range(15,-15,-1)]))
    return "hello world"
    
@app.route("/user_timeline", methods=['GET', 'POST'])
def post_timeline():
    data = request.get_json()
    account_id = data['accountId']
    return timeline(account_id)

@app.route("/my_timeline", methods=['GET','POST'])
def post_my_timeline():
    return my_timeline()

if __name__ == "__main__":
    app.debug = True
    app.run(host='127.0.0.1', port=5000)