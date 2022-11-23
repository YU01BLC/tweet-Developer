import tweepy
import createAuthInfo

api = createAuthInfo.execute()
 
# 検索キーワードと件数
query = "#千葉"
count = 20
 
print('指定のワード「' + str(query) + '」を含むツイートを' + str(count) + '件取得します。')
 
# text = ('指定のワード「' + str(query) + '」を含むツイートを' + str(count) + '件取得します。API_test03')
# tweet = api.update_status(text)

# 取得したツイート数
api_limit = 0

# 検索実行
search_results = api.search_tweets(q = query, count = count)

for result in search_results:  
    user_key = result.id # 検索キー  
    screen_name = result.user.screen_name
    username = result.user.name 
    user_id = result.user._json['screen_name']
    time = result.created_at #ツイートの日時を取得
    tweets = result.text
    try:
      print('【成功】' + str(user_id) + '＠' + str(username) + 'さんが' + str(time) + 'に「' + str(tweets) + '」とツイート')
      api_limit += 1
    except Exception as e:
      print('【失敗】' + '＠' + username + 'さんのツイートを取得できませんでした。' + str(e))
      continue
print(f'{api_limit}件ツイートを取得しました。')
