import tweepy
import createAuthInfo
import pandas as pd
from getRespons import execute_trend


api = createAuthInfo.execute()
db_ref = execute_trend()

#日本のWOEID
woeid = 23424856
#トレンド一覧取得
#データフレームに変換
# df = pd.DataFrame(trends[0]["trends"])
# print(df)

trends = api.get_place_trends(woeid)
trendList = trends[0]["trends"]


def trend():

  for trendItem in trendList:
    print(trendItem['name'])
    print(trendItem['url'])
    db_ref.document().set({
      'trends_name': trendItem['name'],
      'trends_url': trendItem['url'],
    })
  return "SUCCESS"