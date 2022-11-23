
import tweepy
import createAuthInfo
from getRespons import execute_user_timeline
from datetime import timedelta
import datetime

api = createAuthInfo.execute()
db_ref = execute_user_timeline()


# 実行回数
count = 30

params = {
    "exclude_replies": True,
    "count": count,
    }
def timeline(account_id):
    print(account_id)
    selectUser = api.get_user(screen_name = account_id)
    print(str(selectUser.name) + 'さんのタイムラインを取得します。')
    for tweet in api.user_timeline(id = account_id, params = params):
        print('-------------------------------------')   # 見やすくするための区切り
        print('user_name:' + tweet.user.name)            # ユーザ名
        print("user_id:" + tweet.user.screen_name)       # ユーザID
        print("tweet:" + tweet.text)                     # ツイート内容
        print("retweet:" + str(tweet.retweet_count))     # リツイート数
        print("favorite:" + str(tweet.favorite_count))   # いいね数
        print("tweet_time", str(tweet.created_at + timedelta(hours=+9)))
        time = tweet.created_at + timedelta(hours=+9)
        print(f'year: {time.year}, month: {time.month}, day: {time.day}')
        print(f'hour: {time.hour}, minute: {time.minute}, second: {time.second}')
        print(f'micro second: {time.microsecond}')
        print(f'{time.year}:{time.month}/{time.day} {time.hour}:{time.minute}:{time.second}')
        fix_time = (f'{time.year}:{time.month}/{time.day} {time.hour}:{time.minute}:{time.second}')
        db_ref.document().set({
            'user_name': tweet.user.name,
            'user_id': tweet.user.screen_name,
            'tweet': tweet.text,
            'retweet': str(tweet.retweet_count),
            'favorite': str(tweet.favorite_count),
            'tweet_time': str(fix_time),
            "tweet_created_at": tweet.created_at + timedelta(hours=+9),
        })
    return "SUCCESS"