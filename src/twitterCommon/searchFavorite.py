import tweepy
import createAuthInfo
import time

api = createAuthInfo.execute()
 
# 検索キーワードと件数
query = "#いいねした人全員フォロー"
count = 500
fix_count = 50

try_count = 0
fav_count = 0
error_count = 0


print('指定のワード「' + str(query) + '」を含むツイートを' + str(fix_count) + '件取得します。')
 
# text = ('指定のワード「' + str(query) + '」を含むツイートを' + str(count) + '件取得します。API_test03')
# tweet = api.update_status(text)

params = {
  "count": count,
  "exclude_replies": True,
  "include_rts": False         # リツイートを含むかどうか
}

# 検索実行
search_results = api.search_tweets(q = query, params = params)

for result in search_results:
    try_count += 1
    try:
        user_key = result.id # 検索キー  
        screen_name = result.user.screen_name
        username = result.user.name 
        user_id = result.user._json['screen_name']
        tweets = result.text
        fav_count += 1
        time.sleep(3)
        print('【成功】' + str(user_id) + '＠' + str(username) + 'さんが' + str(time) + 'に「' + str(tweets) + '」とツイート')
        api.create_favorite(user_key)
        if fav_count == fix_count:
            print(f'指定件数{fix_count}件の「いいね」を実行しました。')
            break
    except Exception as e:
        print('【失敗】' + '＠' + username + 'さんのツイートを取得できませんでした。' + str(e))
        error_count += 1
        time.sleep(3)
        continue
print(f'実行件数{try_count}件: 「いいね」件数{fav_count}件 / 「失敗」件数{error_count}件')
