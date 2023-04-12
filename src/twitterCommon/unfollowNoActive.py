import tweepy
import createAuthInfo
from datetime import timedelta
import datetime

# APIインスタンスの生成
api = createAuthInfo.execute()

# twitterアカウント名（＠マークは不要）
twitter_id = 'PiPiPi__PiEN___'

# 実際にフォローを解除したユーザー数
unfollow_user = 0

# フォローユーザーの取得
friends = api.get_friend_ids(user_id = twitter_id)

# 非アクティブユーザ一括リム
print('非アクティブ期間の長いユーザを取得します。')
for f in friends:
  try:
    user = api.get_user(user_id = f)
    user_id = user.screen_name
    username = user.name 
    for tweet in api.user_timeline(screen_name = user_id, count = 1):
      time = tweet.created_at + timedelta(hours=+9)
      fix_time = (f'{time.year}-{time.month}-{time.day} {time.hour}:{time.minute}:{time.second}')
      new_time = datetime.datetime.strptime(
        fix_time,
        "%Y-%m-%d %H:%M:%S"
      )
      dt = datetime.datetime.strptime(
        "2022-01-01 0:0:0",
        "%Y-%m-%d %H:%M:%S"
      )
      if new_time < dt:
        print(f'ID: 「{user_id}」  ユーザー名:「{username}」 の最終ツイート日は {time.year}-{time.month}-{time.day} {time.hour}:{time.minute}:{time.second}です。')
        print('リムーブしますか？')
        if input("Y/N?") in ['y','Y']: # ← コメントアウトで確認なしで一括リムできる。※凍結の恐れがある
          api.destroy_friendship(screen_name = user_id) # 上記確認処理をコメントアウトする場合、インデントを調整する必要がある。
          unfollow_user += 1
          print("ID:「{}」  ユーザー名:「{}」 のフォローを解除しました。".format(user_id, username))
          print('-------------------------------------------------------------------')
        break
      else: 
        break
  except tweepy.errors.TweepyException as e:
    if tweepy.errors.NotFound:
      continue
    else:
      print(f'【失敗】{e}')
      break
try:
  print("指定期間非アクティブのユーザーはもういません。")
  print(f'{unfollow_user}人のフォローを解除しました。')
except Exception as e:
  print(f'API操作でエラーが発生しました')
  print(e.args)