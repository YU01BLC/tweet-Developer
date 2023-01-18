import tweepy
import time
import createAuthInfo

api = createAuthInfo.execute()
 
# ツイートを投稿
query = '\"あた梨ちゃん\"'
count = 100
fix_count = 10 # 1日の上限値が50
try_count = 0
tweet_count = 0
error_count = 0

params = {
  "count": count,
  "exclude_replies": False,    # リプライ(返信)を含まないかどうか(Falseで含まない)
  "include_rts": False         # リツイートを含むかどうか
}

# 検索実行
search_results = api.search_tweets(q = query, params = params)
msg = 'あた梨だよ！！！！'

for result in search_results:
    try_count += 1
    try:
        user_key = result.id # 検索キー  
        screen_name = result.user.screen_name
        username = result.user.name 
        user_id = result.user._json['screen_name']
        tweets = result.text
        reply_text = "@"+ str(result.user.screen_name) +" "+ msg
        api.update_status(status = reply_text, in_reply_to_status_id = result.id)
        tweet_count += 1
        time.sleep(3)
        print('-------------------------------------')   # 見やすくするための区切り
        print(f'【成功】id: ＠{username} / name: {user_id}さんのツイート【{tweets}】に【{reply_text}】とリプライを送りました。')
        if tweet_count == fix_count:
            print(f'指定件数{tweet_count}件の「リプライ」を実行しました。')
            break
    except Exception as e:
        print('【失敗】' + '＠' + username + 'さんのツイートを取得できませんでした。' + str(e))
        error_count += 1
        time.sleep(3)
        continue
print(f'実行件数{try_count}件: 「リプライ」件数{tweet_count}件 / 「失敗」件数{error_count}件')
