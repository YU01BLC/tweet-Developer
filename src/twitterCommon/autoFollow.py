import tweepy
import time
import createAuthInfo
from getRespons import execute_follow

api = createAuthInfo.execute()
db_ref = execute_follow()

# twitterアカウント名（＠マークは不要）
twitter_id = 'PiPiPi__PiEN___'

count = 500
params = {
  "count": count,
  "exclude_replies": False,
  "include_rts": False
}

# 検索実行

def follow(keyword, add_count):
  query = keyword + " -filter:retweets" # -filter:retweetsリツイートを除外するオプション
  fix_count = int(add_count) # 1日の上限値が50
  try_count = 0
  follow_count = 0
  error_count = 0

  print( '指定のワード「' + query + '」をツイートしているユーザー' + str(fix_count) + '件フォローをします。')
  search_results = api.search_tweets(q = query, params = params)
  my_name = api.search_users(q = 'あた梨ちゃん')
  for result in search_results: 
    try_count += 1
    try:
      user_key = result.id # 検索キー
      screen_name = result.user.screen_name
      username = result.user.name 
      user_id = result.user._json['screen_name']
      follow = api.get_friendship(source_screen_name = my_name, target_screen_name = screen_name)
      followed = follow[0].following
      if followed == False:
        api.create_friendship(screen_name = screen_name)
        print('【成功】' + 'ID:  ' + screen_name + '  ＠' + username + 'さんのフォローに成功しました。')
        db_ref.document().set({
          'account_id': screen_name,
          'account_name': username,
        })
        follow_count += 1
        time.sleep(3)
        if follow_count == fix_count:
          print(f'指定件数{fix_count}件の「フォロー」を実行しました。')
          print(f'実行件数{try_count}件: 「フォロー」件数{follow_count}件 / 「失敗」件数{error_count}件')
          break
      else:
        print('【重複】' + 'ID:  ' + screen_name + '  ＠' + username)
        error_count += 1
        continue
    except tweepy.errors.TweepyException as e:
      print('【失敗】' + '＠' + username + 'さんのフォローに失敗しました。')
      print(f'【失敗】{e}')
      break
  return "SUCCESS"