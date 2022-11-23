import tweepy
import createAuthInfo

api = createAuthInfo.execute()
 
# ツイートを投稿
text = 'api_test--take0'
tweet = api.update_status(text)

print('「{}」をツイートしました。'.format(tweet.text))