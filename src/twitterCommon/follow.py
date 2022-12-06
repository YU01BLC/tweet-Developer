import tweepy
import time
import createAuthInfo

api = createAuthInfo.execute()

# twitterアカウント名（＠マークは不要）
twitter_id = 'PiPiPi__PiEN___'

# 検索キーワードと件数
query = "#フォロバ -filter:retweets" # -filter:retweetsリツイートを除外するオプション
count = 500
fix_count = 50

try_count = 0
follow_count = 0
error_count = 0

params = {
    "count": count,
    "exclude_replies": False,
    "include_rts": False
}

# text = ('ハッシュタグ「' + str(query) + '」をツイートしているユーザーを取得します。API_test01')
# tweet = api.update_status(text)
 
print( '指定のワード「' + query + '」をツイートしているユーザー' + str(fix_count) + '件フォローをします。')


# 検索実行
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
    print('follow status:   ' + str(followed))
    if followed == False:
      api.create_friendship(screen_name = screen_name)
      print('【成功】' + 'ID:  ' + screen_name + '  ＠' + username + 'さんのフォローに成功しました。')
      follow_count += 1
      time.sleep(15)
      if follow_count == fix_count:
        print(f'指定件数{fix_count}件の「フォロー」を実行しました。')
        break
    else:
      print('【重複】' + 'ID:  ' + screen_name + '  ＠' + username)
      error_count += 1
      time.sleep(15)
      continue
  except tweepy.errors.TweepyException as e:
    print('【失敗】' + '＠' + username + 'さんのフォローに失敗しました。')
    print(f'【失敗】{e}')
    break
print(f'実行件数{try_count}件: 「フォロー」件数{follow_count}件 / 「失敗」件数{error_count}件')
