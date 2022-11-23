import tweepy
import createAuthInfo
import time
from datetime import timedelta
import datetime

# APIインスタンスの生成
api = createAuthInfo.execute()

# twitterアカウント名（＠マークは不要）
twitter_id = 'PiPiPi__PiEN___'

# 実際にフォローを解除したユーザー数
unfollow_user = 0

print('片思いのユーザーのフォローを解除します。')

# フォロワーの取得
followers = api.get_follower_ids(user_id = twitter_id)
# フォローユーザーの取得
friends = api.get_friend_ids(user_id = twitter_id)
 
# countの数だけループ
for f in friends:
  if f not in followers:
    try: 
      user = api.get_user(user_id = f)
      user_id = user.screen_name
      screen_name = user.screen_name
      print("ID:「{}」  ユーザー名:「{}」 のフォローを解除しますか？".format(user.screen_name, user.name))
      if input("Y/N?") in ['y','Y']: # ← コメントアウトで確認なしで一括リムできる。※凍結の恐れがある
        api.destroy_friendship(screen_name = screen_name) # 上記確認処理をコメントアウトする場合、インデントを調整する必要がある。
        api.create_block(screen_name = screen_name)
        unfollow_user += 1
        print("ID:「{}」  ユーザー名:「{}」 のフォローを解除しました。".format(user.screen_name, user.name))
        print('-------------------------------------------------------------------')
    except tweepy.errors.TweepyException as e:
      if tweepy.errors.NotFound:
        continue
      else:
        print(f'【失敗】{e}')
        break
try:
  print(f'{unfollow_user}人のフォローを解除しました。')
except Exception as e:
  print(f'API操作でエラーが発生しました')
  print(e.args)
