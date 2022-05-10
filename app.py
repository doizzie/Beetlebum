import base64

from flask import Flask, render_template, request, jsonify, make_response
from dotenv import load_dotenv
import os
import json
import requests
# from flask_jwt_extended import create_access_token, get_jwt_identity, JWTManager, jwt_required
import beetlebum_api as ca

load_dotenv()
app = Flask(__name__)
# app.config["JWT_SECRET_KEY"] = os.environ.get('SECRET_KEY')
# jwt = JWTManager(app)
        
@app.route("/index.html")
def home():    
    return render_template("index.html") 

@app.route("/articles.html")
def articles():
    return render_template("articles.html")

@app.route("/popular.html")
def popular():
    return render_template("popular.html")

@app.route("/random.html")
def random():
    return render_template("random.html")

@app.route("/about.html")
def aboutus():
    return render_template("about.html")

@app.route("/monthly.html")
def monthly():
    return render_template("monthly.html")

@app.route("/movies.html")
def movies():
    return render_template("movies.html")

@app.route("/music.html")
def music():
    return render_template("music.html")

@app.route("/books.html")
def books():
    return render_template("books.html")


# @app.route('/look', methods=['GET', 'POST'])
# def home_page():
#     example_embed='This string is from python'
#     # if filter:
#     #     print(filter)
#     if request.method == 'GET':
#         # articles = json.dumps(ca.getAllArticles()["results"])
#         example_embed = "hii"
#         #json.dumps(ca.getArticleTitle()["results"])
#         return render_template('index.html', embed=example_embed)
#     if request.method == 'POST':
#         print(request.get_json())  # parse as JSON
#         return 'Sucesss', 200

@app.route('/arc')
def arc():
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, title, author, summary, movieTag, bookTag, musicTag, theBestOfAll, newReleases, hiddenGems, feelGood, deepThinking FROM article")
    results = cur.fetchall()
    data = json.dumps(results)
    conn.close()
    return data

@app.route('/moviearc')
def moviearc():
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, title, author, summary FROM article WHERE movieTag = 1 ORDER BY publishedDate")
    results = cur.fetchall()
    data = json.dumps(results)
    conn.close()
    return data

@app.route('/bookarc')
def bookarc():
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, title, author, summary FROM article WHERE bookTag = 1 ORDER BY publishedDate")
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    results = cur.fetchall()
    # json_data=[]
    # print(f"json: {json.dumps(rv)}")
    # for result in rv:
    # json_data.append(dict(zip(row_headers,result)))
    # json_data.append(result)
    data = json.dumps(results)
    conn.close()
    return data

@app.route('/musicarc')
def musicarc():
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, title, author, summary FROM article WHERE musicTag = 1 ORDER BY publishedDate")
    results = cur.fetchall()
    data = json.dumps(results)
    conn.close()
    return data

@app.route('/getOneArticle/<id>/')
def getOneArticle(id):
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, visits, title, author, summary, movieTag, bookTag, musicTag, theBestOfAll, newReleases, hiddenGems, feelGood, deepThinking FROM article WHERE articleId =" + id)
    results = cur.fetchall()
    data = json.dumps(results)
    # visitquery = "SELECT visits FROM article WHERE articledId=" + id + ""
    # cur.execute(visitquery)
    # visitresultRow = cur.fetchone()
    # visitresult = visitresultRow[0] + 1;
    # addvisitquery = "UPDATE article SET visits = " + int(visitresult) + " WHERE articleId=" + id + ""
    # cur.execute(addvisitquery)
    # conn.close()
    # for rez in results:
    arcId = [item['articleId'] for item in results]
    # vis = [item['visits'] for item in results]
    ca.addVisit(arcId)
    # getImg(arcId)
    conn.close()
    return data

@app.route('/getImg/<id>')
def getImg(id=None):
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT img FROM article WHERE articleId =" + str(id[0]) + "")
    results = cur.fetchall()
    # data = json.dumps(results)
    # arcId = [item['articleId'] for item in results]
    vis = [item['img'] for item in results]
    # data = "done"
    data = base64.b64encode(vis[0]).decode('utf-8')
    # ca.addVisit(arcId)
    conn.close()
    return data

@app.route('/getBigImg/<id>')
def getBigImg(id=None):
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT bigImg FROM article WHERE articleId =" + str(id[0]) + "")
    results = cur.fetchall()
    # data = json.dumps(results)
    # arcId = [item['articleId'] for item in results]
    vis = [item['bigImg'] for item in results]
    # data = "done"
    data = base64.b64encode(vis[0]).decode('utf-8')
    # ca.addVisit(arcId)
    conn.close()
    return data

@app.route('/getPopular/')
def getPopular():
    conn = ca.connectToDB()
    cur = conn.cursor()
    # maxVal = ca.getMaxVisits()
    cur.execute("SELECT articleId, title, author, summary, movieTag, bookTag, musicTag, theBestOfAll, newReleases, hiddenGems, feelGood, deepThinking FROM article WHERE visits > 5")
    results = cur.fetchall()
    data = json.dumps(results)
    # ca.addVisit(arcId)
    conn.close()
    return data

@app.route('/getRandom/')
def getRandom():
    conn = ca.connectToDB()
    cur = conn.cursor()
    rand = ca.getRandomArticleId()
     # data = json.dumps(rand)
    # maxVal = ca.getMaxVisits()
    cur.execute("SELECT articleId, title, author, summary, movieTag, bookTag, musicTag, theBestOfAll, newReleases, hiddenGems, feelGood, deepThinking FROM article WHERE articleId =" + str(rand))
    results = cur.fetchall()
    data1 = json.dumps(results)
    # ca.addVisit(arcId)
    conn.close()
    return data1


# @app.route('/addVisit/<id>/<visits>')
# def addVisit(id=None, visits=None):
#     conn = ca.connectToDB()
#     cur = conn.cursor()
#     visitresult = int(visits) + 1;
#     # cur.execute("SELECT visits FROM article WHERE articleId =" + id)
#     addvisitquery = "UPDATE article SET visits = " + int(visitresult) + " WHERE articleId=" + id + ""
#     cur.execute(addvisitquery)
#     conn.commit()
#     conn.close()
#     return visitresult
    # results = cur.fetchall()

@app.route('/getSimilarArticles/<ratio>/<lastId>')
def getSimilarArticles(ratio=None, lastId=None):
    conn = ca.connectToDB()
    cur = conn.cursor()
    searchFeelGood = 0
    if ratio == "-3":
        searchFeelGood = 1
    if ratio == "-1":
        searchFeelGood = 2
    if ratio == "1":
        searchFeelGood = 3
    if ratio == "3":
        searchFeelGood = 4

    cur.execute("SELECT articleId,  title, author, summary, feelGood, deepThinking FROM article WHERE feelGood =" + str(searchFeelGood) + " AND articleId !=" + lastId)
    results = cur.fetchall()
    data = json.dumps(results)
    return data

# @app.route('/look', methods=['GET', 'POST'])
# def home_page():
#     example_embed='This string is from python'
#     # if filter:
#     #     print(filter)
#     conn = ca.connectToDB()
#     cur = conn.cursor()
#     cur.execute("SELECT articleId, title, author, summary FROM article WHERE articleId = id")
#     results = cur.fetchall()
#     # data = json.dumps(results)
#     if request.method == 'GET':
#         # articles = json.dumps(ca.getAllArticles()["results"])
#         example_embed = "hii"
#         #json.dumps(ca.getArticleTitle()["results"])
#         return render_template('index.html', embed=example_embed)
#     if request.method == 'POST':
#         print(request.get_json())  # parse as JSON
#         return 'Sucesss', 200

@app.route("/hello/")
@app.route("/hello/<filter>/")
def hello(filter=None):
    # if filter:
    #     print(filter)
    #     articles1 = json.dumps(ca.arc(filter)["results"])
    # else:
    articles1 = json.dumps(ca.arc()["results"])
    return articles1

@app.route('/test', methods=['GET', 'POST'])
def testfn():    # GET request
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT * FROM article")
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    rv = cur.fetchall()
    json_data=[]
    for result in rv:
        json_data.append(dict(zip(row_headers,result)))
    if request.method == 'GET':
        # message = {'greeting':'Hello from Flask!'}
        return jsonify(rv)  # serialize and use JSON headers    # POST request
    if request.method == 'POST':
        print(request.get_json())  # parse as JSON
        return 'Sucesss', 200

# @app.route('/')
# def index():
#     name = ['Joe','John','Jim','Paul','Niall','Tom']
#     return render_template('articles.html', name=name)

# @app.route('/getNames/')
# def getNamee():
#     name = ['Joe','John','Jim','Paul','Niall','Tom']
#     return render_template('articles.html', name=name)

# @app.route('/getNames/')
# def callNames(api_url, *params):
#     response = requests.get() / requests.post()
#     return response.text

# @app.route("/getAll/")
# @app.route("/getAll/<filter>/")
# def getAll(filter=None):
#     if filter:
#         print(filter)
#         articles1 = json.dumps(ca.getAllArticles(filter)["results"])
#     else:
#         articles1 = json.dumps(ca.getAllArticles()["results"])
#     return articles1

@app.route("/randomovie", methods = ['GET'])
def randomMovie():
    return ca.getRandomMovie()

@app.route("/register",methods = ['POST'])
def register():
    ca.registerUser(request.values.get("registration_username"), request.values.get("registration_email"), request.values.get("registration_password"))
    return render_template("index.html")

# @app.route("/article/<id>")
# def getArticle(id):
#     return ca.getOneArticle(id)
#
# @app.route("/imdb/<id>")
# def getImdb(id):
#     return "http://www.imdb.com/title/" + ca.getIMDBid(id)

# @app.route('/login', methods = ['POST'])
# def login():
#     auth = request.form
#     if not auth:
#         return make_response('User could not be verified', 401, {'WWW-Authenticate' : 'Basic realm = "User does not exist"'})
#     user = ca.verifyUser(auth.get('password'), auth.get('username'), auth.get('email'))
#     if (user == -1):
#         return make_response('User could not be identified. Please check your login/email and password.', 401, {'WWW-Authenticate' : 'Basic realm = "Data problem"'})
#     else:
#         access_token = create_access_token(identity=user)
#         return jsonify(access_token=access_token)

# @app.route('/deleteAccount', methods = ['DELETE'])
# @jwt_required()
# def deleteAccount():
#     user = get_jwt_identity()
#     conn = ca.connectToDB()
#     cursor = conn.cursor()
#     cursor.execute("DELETE FROM user WHERE id=" + str(user))
#     conn.commit()
#     conn.close()
#     return make_response('User successfully deleted', 200)
#
# @app.route('/updateAccount', methods = ['PUT'])
# @jwt_required()
# def updateAccount():
#     data = request.form
#     query = "UPDATE user SET"
#     if data.get('username'):
#         query += " username='" + data.get('username') + "'"
#     if data.get('email'):
#         query += " email='" + data.get('email') + "'"
#     if data.get('password'):
#         query += " password='" + data.get('password') + "'"
#     query += " WHERE id=" + str(get_jwt_identity())
#     conn = ca.connectToDB()
#     cursor = conn.cursor()
#     cursor.execute(query)
#     conn.commit()
#     conn.close()
#     return make_response('Test successful', 200)

@app.route("/movie/seen",methods = ['POST', 'PUT'])
def markSeen():
    data = request.form
    if(request.method == 'POST'):
        ca.markAsSeen(data.get("userId"), data.get("movieId"))
        return make_response("Success",200)
    else:
        ca.updateSeen(data.get("userId"), data.get("movieId"), data.get("seen"))
        return make_response("Success",200)

@app.route("/movie/<id>/checkIfInInteraction/<userId>",methods = ['GET'])
def checkIfInInteraction(id, userId):
    if(ca.checkIfAlreadyInInteractionsTable(userId, id) == 1):
        return make_response("Already in table",200)
    else:
        return make_response("Not in the table yet",200)

@app.route("/movie/<id>/seen/<userId>",methods = ['GET'])
def getSeen(id, userId):
    if(ca.checkIfSeen(userId, id) == 1):
        return make_response("Seen",200)
    else:
        return make_response("NotSeen",200)

@app.route("/movie/watchlist",methods = ['POST', 'PUT'])
def markInWatchlist():
    data = request.form
    if(request.method == 'POST'):
        ca.markAsWantToSee(data.get("userId"), data.get("movieId"))
        return make_response("Success",200)
    else:
        ca.updateWatchlist(data.get("userId"), data.get("movieId"), data.get("wantToSee"))
        return make_response("Success",200)

@app.route("/movie/<id>/watchlist/<userId>",methods = ['GET'])
def getInWatchlist(id, userId):
    if(ca.checkIfInWatchlist(userId, id) == 1):
        return make_response("In watch list",200)
    else:
        return make_response("Not in watchlist", 200)