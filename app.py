import base64

from flask import Flask, render_template, request, jsonify, make_response
from dotenv import load_dotenv
import os
import json
import requests
import beetlebum_api as ca

load_dotenv()
app = Flask(__name__)

        
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

@app.route("/movies.html")
def movies():
    return render_template("movies.html")

@app.route("/music.html")
def music():
    return render_template("music.html")

@app.route("/books.html")
def books():
    return render_template("books.html")

@app.route("/search.html")
def searchPage():
    return render_template("search.html")

@app.route('/arc')
def arc():
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, title, author, summary, movieTag, bookTag, musicTag, theBestOfAll, newReleases, hiddenGems, feelGood, deepThinking FROM article ORDER BY publishedDate DESC")
    results = cur.fetchall()
    data = json.dumps(results)
    conn.close()
    return data

@app.route('/moviearc')
def moviearc():
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, title, author, summary FROM article WHERE movieTag = 1 ORDER BY publishedDate DESC")
    results = cur.fetchall()
    data = json.dumps(results)
    conn.close()
    return data

@app.route('/bookarc')
def bookarc():
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, title, author, summary FROM article WHERE bookTag = 1 ORDER BY publishedDate DESC")
    row_headers=[x[0] for x in cur.description] #this will extract row headers
    results = cur.fetchall()
    data = json.dumps(results)
    conn.close()
    return data

@app.route('/musicarc')
def musicarc():
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, title, author, summary FROM article WHERE musicTag = 1 ORDER BY publishedDate DESC")
    results = cur.fetchall()
    data = json.dumps(results)
    conn.close()
    return data

@app.route('/getOneArticle/<id>/')
def getOneArticle(id):
    conn = ca.connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId, visits, title, author, summary, movieTag, bookTag, musicTag, theBestOfAll, newReleases, hiddenGems, feelGood, userFeelGood, deepThinking, userDeepThinking FROM article WHERE articleId =" + id)
    results = cur.fetchall()
    data = json.dumps(results)
    arcId = [item['articleId'] for item in results]
    # vis = [item['visits'] for item in results]
    ca.addVisit(arcId)
    userFG = [item['userFeelGood'] for item in results]
    userDP = [item['userDeepThinking'] for item in results]
    ca.updateRatio(id, userFG, userDP)
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
    cur.execute("SELECT articleId, title, author, summary, movieTag, bookTag, musicTag, theBestOfAll, newReleases, hiddenGems, feelGood, deepThinking FROM article WHERE visits > 5 AND userLikes > 3")
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

@app.route('/getByWord/<words>', methods=['GET','POST'])
def getByWord(words=None):
    conn = ca.connectToDB()
    cur = conn.cursor()
    # rand = ca.getRandomArticleId()
    # data = json.dumps(rand)
    # maxVal = ca.getMaxVisits()
    cur.execute("SELECT articleId, title, author, summary, movieTag, bookTag, musicTag, theBestOfAll, newReleases, hiddenGems, feelGood, deepThinking FROM article WHERE title LIKE '%" + str(words) + "%'")
    results = cur.fetchall()
    data1 = json.dumps(results)
    # ca.addVisit(arcId)
    conn.close()
    # return render_template('search.html')
    return data1


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

    cur.execute("SELECT articleId,  title, author, summary, feelGood, deepThinking FROM article WHERE feelGood =" + str(searchFeelGood) + " AND articleId !=" + lastId + " AND userLikes >= 0")
    results = cur.fetchall()
    data = json.dumps(results)
    conn.close()
    return data


@app.route('/addLike/<articleId>')
def addLike(articleId=None):
    ca.addLikeNow(articleId)
    result = "Like added"
    return result

@app.route('/addDisLike/<articleId>')
def addDisike(articleId=None):
    ca.addDislikeNow(articleId)
    result = "Dislike added"
    return result

@app.route('/addHappy/<articleId>')
def addHappy(articleId=None):
    ca.addHappyNow(articleId)
    result = "Feel Good added"
    return result

@app.route('/addThink/<articleId>')
def addThink(articleId=None):
    ca.addThinkNow(articleId)
    result = "Deep thinking added"
    return result



