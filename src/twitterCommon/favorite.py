import tweepy
import createAuthInfo
import time

api = createAuthInfo.execute()
 
# 検索キーワードと件数
account_id = "srrarr_87"
count = 500
fix_count = 100

try_count = 0
fav_count = 0
error_count = 0

print( account_id + 'さんのツイートを' + str(fix_count) + '件いいねをします。')

params = {
    "count": count,
    "exclude_replies": True,
    "include_rts": False         # リツイートを含むかどうか
}



for tweet in api.user_timeline(id = account_id, params = params):
    try_count += 1
    try:
        user_key = tweet.id
        user_id = tweet.user.name
        screen_name = tweet.user.screen_name
        tweet_text = tweet.text
        api.create_favorite(user_key)                #いいね
        print("tweet:" + tweet_text)                 # ツイート内容 
        print('【成功】' + '＠' + user_id + 'さんの「いいね」に成功しました。')
        fav_count += 1
        time.sleep(3)
        if fav_count == fix_count:
            print(f'指定件数{fix_count}件の「いいね」を実行しました。')
            break
    except Exception as e:
        # すでに「いいね」済みだとこれが出力。
        print('【失敗】' + '＠' + user_id + 'さんの「いいね」に失敗しました。' + str(e))
        error_count += 1
        time.sleep(3)
        continue
print(f'実行件数{try_count}件: 「いいね」件数{fav_count}件 / 「失敗」件数{error_count}件')
