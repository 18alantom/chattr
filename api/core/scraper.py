import twint

def _twint_gen(config, limit):
    twint.output.tweets_list = []
    prev_count = 0
    for _ in range(limit):
        twint.run.Search(config)
        count = len(twint.output.tweets_list)
        yield twint.output.tweets_list[prev_count: count + prev_count]
        prev_count = count
    
def _get_twint_gen(search=None, since=None, until=None, username=None, min_retweets=0, min_replies=0, limit=10):
    """
    returns generator, on calling next(generator) returns 100 tweets.
    limit is in multiples of 100
    """
    config = twint.Config()
    config.Search = search
    config.Since = since
    config.Until = until
    config.Username = username
    config.Min_replies = min_replies
    config.Min_retweets = min_retweets

    config.Limit = 1
    config.Hide_output = True
    config.Store_object = True

    if not config.Username:
        config.Min_likes = 10
    return _twint_gen(config, limit)

def _process_tweet(tweet, get_sentiment_score):
    """
    returns important tweet info in a dict
    """
    sentiment = get_sentiment_score(tweet.tweet)
    datetime_iso = tweet.datestamp + "T" + tweet.timestamp
    return dict(
        username=tweet.username,
        id=tweet.id_str,
        datetime=datetime_iso,
        sentiment=sentiment,
        likes=tweet.likes_count,
        retweets=tweet.retweets_count,
        replies=tweet.replies_count,
        hashtags=tweet.hashtags
    )

def get_sentiment_gen(config, get_sentiment_score, limit=2):
    """
    config : {
        'search': str example "covid"|"dune",
        'since': str example "2015-12-20 20:30:15"|"2015-12-20",
        'until': str example "2015-12-20 20:30:15"|"2015-12-20",
        'username' : str example "naval"|"elonmusk",
    }
    get_sentiment_score : (tweet:str) -> [negative, neutral, positive]
    limit : int
    """
    twint_gen = _get_twint_gen(**config, limit=limit)
    for tweet_list in twint_gen:
        for tweet in tweet_list:
            yield _process_tweet(tweet, get_sentiment_score)