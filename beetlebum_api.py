from flask import request, jsonify
import requests
from dotenv import load_dotenv
import os
from hashlib import sha256
import pymysql
import jwt
from functools import wraps
import random

load_dotenv()


genres = ["music", "movies", "books"]


def connectToDB():
    connection = pymysql.connect(host='localhost', user='root', password='', database='beetlebum', charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
    return connection

def addVisit(id):
    conn = connectToDB()
    cur = conn.cursor()
    # visitresult = visit[0] + 1;
    # cur.execute("SELECT visits FROM article WHERE articleId =" + id)
    addvisitquery = "UPDATE article SET visits = visits + 1 WHERE articleId=" + str(id[0]) + ""
    cur.execute(addvisitquery)
    conn.commit()
    conn.close()

def addLikeNow(id):
    conn = connectToDB()
    cur = conn.cursor()
    addlikequery = "UPDATE article SET userLikes = userLikes + 1 WHERE articleId=" + str(id[0]) + ""
    cur.execute(addlikequery)
    conn.commit()
    conn.close()

def addDislikeNow(id):
    conn = connectToDB()
    cur = conn.cursor()
    adddislikequery = "UPDATE article SET userLikes = userLikes - 1 WHERE articleId=" + str(id[0]) + ""
    cur.execute(adddislikequery)
    conn.commit()
    conn.close()

def addHappyNow(id):
    conn = connectToDB()
    cur = conn.cursor()
    addHappyquery = "UPDATE article SET userFeelGood = userFeelGood + 1 WHERE articleId=" + str(id[0]) + ""
    cur.execute(addHappyquery)
    conn.commit()
    conn.close()

def addThinkNow(id):
    conn = connectToDB()
    cur = conn.cursor()
    addThinkquery = "UPDATE article SET userDeepThinking = userDeepThinking + 1 WHERE articleId=" + str(id[0]) + ""
    cur.execute(addThinkquery)
    conn.commit()
    conn.close()

def updateRatio(id, userFG, userDP):
    conn = connectToDB()
    cur = conn.cursor()
    userF = userFG[0]
    userD = userDP[0]
    ratio = 0
    newFeelGood = 0
    newDeepThinking = 0
    if userF > 5:
        if userD > 5:
            if userF >= userD:
                ratio = userF*100/(userF+userD)
                if ratio > 65:
                    newFeelGood = 4
                    newDeepThinking = 1
                else:
                    newFeelGood = 3
                    newDeepThinking = 2
            elif userD > userF:
                ratio = userD*100/(userF+userD)
                if ratio > 65:
                    newFeelGood = 1
                    newDeepThinking = 4
                else:
                    newFeelGood = 2
                    newDeepThinking = 3

    if newFeelGood == 0:
        newFeelGood = userF
        newDeepThinking = userD
    changequery = "UPDATE article SET feelGood = " + str(newFeelGood) + " , deepThinking = " + str(newDeepThinking) + " WHERE articleId=" + str(id[0]) + ""
    cur.execute(changequery)
    conn.commit()
    conn.close()


def getRandomArticleId():
    conn = connectToDB()
    cur = conn.cursor()
    cur.execute("SELECT articleId FROM article ORDER BY RAND() LIMIT 1")
    results = cur.fetchall()
    vis = [item['articleId'] for item in results]
    return vis[0]


