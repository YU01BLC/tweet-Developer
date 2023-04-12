import tweepy
import time
import createAuthInfo

api = createAuthInfo.execute()
 
# ツイートを投稿
Account = 'tirutiru_mmm'
count = 100
fix_count = 10 # 1日の上限値が50
try_count = 0
tweet_count = 0
error_count = 0
add_text = ''
patternA = ''
patternB = ''
patternC = ''


params = {
  "exclude_replies": False,    # リプライ(返信)を含まないかどうか(Falseで含まない)
  "include_rts": False         # リツイートを含むかどうか
}

msg = 'えむちゃ！！！'
for tweet in range(fix_count):
  try_count += 1
  add_text += '!'
  patternA = ' かまって'
  patternB = ' いまめっちゃ暇だよ'
  patternC = ' (   　  ’・ω・`　　　　　)'
  print('実行件数' + str(try_count))
  try:
    # ツイート処理
    # tweeting = api.update_status(msg + str(try_count))
    if try_count < 4 :
      reply_text = "@"+ str(Account) +" "+ msg + str(add_text)
      tweeting = api.update_status(reply_text)
      if try_count == 3:
        add_text = ''
      print('「tweet: ' + reply_text)
      print('-------------------------------------')   # 見やすくするための区切り
    if try_count > 3 and try_count < 6 :
      reply_text = "@"+ str(Account) +" "+ msg + str(patternA) + str(add_text)
      tweeting = api.update_status(reply_text)
      if try_count == 5:
        add_text = ''
      print('「tweet: ' + reply_text)
      print('-------------------------------------')   # 見やすくするための区切り
    if try_count > 5 and try_count < 8 :
      reply_text = "@"+ str(Account) +" "+ msg + str(patternB) + str(add_text)
      tweeting = api.update_status(reply_text)
      if try_count == 7:
        add_text = ''
      print('「tweet: ' + reply_text)
      print('-------------------------------------')   # 見やすくするための区切り
    if try_count > 7 and try_count < 11 :  # 最後だけ数字を1つ増やす
      reply_text = "@"+ str(Account) +" "+ msg + str(patternC) + str(add_text)
      tweeting = api.update_status(reply_text)
      print('「tweet: ' + reply_text)
      print('-------------------------------------')   # 見やすくするための区切り
      if try_count == 9:
        add_text = ''
    tweet_count += 1
    time.sleep(5)
  except tweepy.errors.TweepyException as e:
    print(f'【失敗】{e}')
    continue

print(f'実行件数{try_count}件: 「ツイート」件数{tweet_count}件 / 「失敗」件数{error_count}件')

# for tweet in api.user_timeline(id = Account, count = count, params = params):
#   try_count += 1
#   print('実行件数' + str(try_count))
#   try:
#     print('-------------------------------------')   # 見やすくするための区切り
#     print('user_name:' + tweet.user.name)            # ユーザ名
#     print("tweet:" + tweet.text) 

#     # リプライ処理
#     reply_text = "@"+ str(tweet.user.screen_name) +" "+ msg
#     print("reply_text", reply_text)
#     api.update_status(status = reply_text, in_reply_to_status_id = tweet.id)
#     print('-------------------------------------')   # 見やすくするための区切り
    
#     tweet_count += 1
#     time.sleep(5)
#     if tweet_count == fix_count:
#       print(f'指定件数{tweet_count}件の「リプライ」を実行しました。')
#       break
#   except tweepy.errors.TweepyException as e:
#     print(f'【失敗】{e}')
#     continue

# print(f'実行件数{try_count}件: 「リプライ」件数{tweet_count}件 / 「失敗」件数{error_count}件')
