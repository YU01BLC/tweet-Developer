
import tweepy
import createAuthInfo
from getRespons import execute_my_timeline
from datetime import timedelta
import datetime

# APIインスタンスの生成
api = createAuthInfo.execute()
db_ref = execute_my_timeline()

# twitterアカウント名（＠マークは不要）
twitter_id = 'PiPiPi__PiEN___'

# 実行回数
count = 30


params = {
    "count": count,        # 取得するツイート数
    "exclude_replies": False,    # リプライ(返信)を含まないかどうか(Falseで含まない)
    "include_rts": False         # リツイートを含むかどうか
}


def my_timeline():
  media_list = [];
  for tweet in api.user_timeline(params = params):
    print('-------------------------------------')   # 見やすくするための区切り
    print('user_name:' + tweet.user.name)            # ユーザ名
    print("user_id:" + tweet.user.screen_name)       # ユーザID
    print("tweet:" + tweet.text)                     # ツイート内容
    if 'media' in tweet.entities:
      for media in tweet.extended_entities['media']:
        url = media['media_url_https']
        media_list.append(url)
    print("media_list:", media_list)                 # ツイート添付画像
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
      'media': media_list,
      'retweet': str(tweet.retweet_count),
      'favorite': str(tweet.favorite_count),
      'tweet_time': str(fix_time),
      "tweet_created_at": tweet.created_at + timedelta(hours=+9),
    })
    media_list = [];
  return "SUCCESS"