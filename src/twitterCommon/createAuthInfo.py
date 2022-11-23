
import tweepy
 
# #TwitterUser情報
CONSUMER_KEY = 'rRQQxfqhha2Fbfm1RcCS4EhbU'
CONSUMER_SECRET = 'DMiIxPByjZwje3K06WxYn9KXm3y2XbWgOopm63Kvu56idiFBOA'
ACCESS_TOKEN = '934281938-mIkMhoaEsJSjbUd3YDWQTkx0zCM0Koo9f99LZLds'
ACCESS_SECRET = 'GCGEuqnBwPpl6khZZaIJeVUfhGcKCrU3hcOt6qh4jeB4z'
 
 
def execute():
    #APIインスタンスを作成
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
    api = tweepy.API(auth)
    
    return api