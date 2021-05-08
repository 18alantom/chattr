import uuid
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import get_sentiment_gen
from api import get_sentiment_scorer

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.0.105:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTION"],
    allow_headers=["*"],
)

# FIXME: This may not work, depends on twint's underlying storage
gens = {}
sess = get_sentiment_scorer()


class Search(BaseModel):
    search: str
    since: Optional[str] = None
    until: Optional[str] = None
    username: Optional[str] = None
    min_replies: Optional[int] = None
    min_retweets: Optional[int] = None


class NextTweet(BaseModel):
    uid: str
    stop: Optional[bool] = False

#  class Tweet(BaseModel):
    #  success: bool
    #  message : Optional[str] = None
    #  username: Optional[str] = None
    #  id: Optional[str] = None
    #  datetime: Optional[str] = None
    #  sentiment: Optional[List[float]] = None
    #  likes: Optional[int] = None
    #  replies: Optional[int] = None
    #  retweets: Optional[int] = None
    #  hashtags: Optional[List[str]] = None

# TODO: on searching again the previous uid should be cleared.

def get_uid() -> str:
    return str(uuid.uuid4())


@app.get("/")
async def get_test():
    return {"get": "successful"}


@app.post("/start_search")
def start_search(search: Search):
    global gens
    uid = get_uid()
    gens[uid] = get_sentiment_gen(search.dict(), sess)
    return dict(success=True, uid=uid)


@app.post("/get_tweet")
def get_tweet(next_tweet: NextTweet):
    tweet = dict(success=False)
    uid = next_tweet.uid
    global gens

    if uid not in gens:
        tweet['message'] = "invalid uid, start new search"
    else:
        update_tweet(gens, next_tweet, tweet)
    return tweet


def update_tweet(gens, next_tweet, tweet):
    uid = next_tweet.uid
    if uid in gens and next_tweet.stop:
        del_gen(gens, uid, tweet)
    else:
        get_next(gens, uid, tweet)


def get_next(gens, uid, tweet):
    try:
        stuff = next(gens[uid])
        tweet.update(stuff)
        tweet['success'] = True
    except Exception as error:
        print(error)
        del_gen(gens, uid, tweet)


def del_gen(gens, uid, tweet):
    del gens[uid]
    tweet['message'] = "start new search"
