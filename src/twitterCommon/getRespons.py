import firebase_admin
from firebase_admin import firestore
import os
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'client_credentials.json'

firebase_admin.initialize_app()
db = firestore.client()

doc_ref_user_timeline = db.collection('timeline_data')
doc_ref_my_timeline = db.collection('my_timeline_data')
doc_ref_user_profile = db.collection('profile_data')
doc_ref_my_profile = db.collection('my_profile_data')
doc_ref_trend = db.collection('trend_data')


def execute_user_timeline():
    return doc_ref_user_timeline

def execute_my_timeline():
    return doc_ref_my_timeline

def execute_user_profile():
    return doc_ref_user_profile

def execute_my_profile():
    return doc_ref_my_profile

def execute_trend():
    return doc_ref_trend

# docs = doc_ref.stream()

# for doc in docs:
#     db_res = doc
#     print(
#         f"ID:{doc.id}   "
#         f"favo:{doc.get('favo_key')}   " 
#         f"follow:{doc.get('follow_key')}   " 
#         f"search:{doc.get('search_key')}   "
#         f"timeLine:{doc.get('timeline')}   "
#         f"text:{doc.get('tweet_text')}   "
#         )
#     def execute():
#         ID = "{doc.id}"
#         FAVO = "{doc.get('favo_key')}"
#         FOLLOW = "{doc.get('follow_key')}" 
#         SEARCH = "{doc.get('search_key')}"
#         TIME_LINE = "{doc.get('timeline')}"
#         TEXT = "{doc.get('tweet_text')}"
#         return db_res