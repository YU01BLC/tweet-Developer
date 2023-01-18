import tweepy
import time
import createAuthInfo

api = createAuthInfo.execute()
 
# ツイートを投稿
Account = '_hacha_o0'
count = 100
fix_count = 30 # 1日の上限値が50
try_count = 0
tweet_count = 0
error_count = 0

params = {
  "exclude_replies": False,    # リプライ(返信)を含まないかどうか(Falseで含まない)
  "include_rts": False         # リツイートを含むかどうか
}

# その一つ一つに対してリプライをする．
msg = 'はるちゃんなう！はるちゃんなう！！'
for tweet in api.user_timeline(id = Account, count = count, params = params):
  try_count += 1
  print('実行件数' + str(try_count))
  try:
    print('-------------------------------------')   # 見やすくするための区切り
    print('user_name:' + tweet.user.name)            # ユーザ名
    print("tweet:" + tweet.text) 
    reply_text = "@"+ str(tweet.user.screen_name) +" "+ msg
    print("reply_text", reply_text)
    # テキスト(メッセージ)のみ
    api.update_status(status = reply_text, in_reply_to_status_id = tweet.id)
    print('-------------------------------------')   # 見やすくするための区切り
    tweet_count += 1
    time.sleep(5)
    if tweet_count == fix_count:
      print(f'指定件数{tweet_count}件の「リプライ」を実行しました。')
      break
  except tweepy.errors.TweepyException as e:
    print(f'【失敗】{e}')
    continue

print(f'実行件数{try_count}件: 「リプライ」件数{tweet_count}件 / 「失敗」件数{error_count}件')
