import Axios from 'axios';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { UserInfoType } from '../../../@types/index';
import { deleteMyTimeline } from '../../common/deleteTimeline';
import db from '../../firebase';
import videoIcon from '../../image/video_start.png';
import modalChangeState from '../../state/atoms/modalFlagAtom';
import myTimelineState from '../../state/atoms/myTimelineAtom';
import '../../style/baseComponentStyle/mainAreaStyle.css';

/** MainAreaコンポーネント */
export default function MainArea() {
  const myTimelineAreaFlg = useRecoilValue<boolean>(modalChangeState.myTimelineAreaFlgState);

  const videoIconUrl: string = videoIcon;

  /** myTimeline表示判定RecoilState
   * @type {boolean}
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const getMyTimelineFlg = useRecoilValue<boolean>(myTimelineState.myTimelineGetFlgState);

  /** userTimeline用RecoilState
   * @type {UserInfoType[]}
   */
  const [timeline, setTimeline] = useRecoilState<UserInfoType[]>(myTimelineState.userTimelineState);

  /** 自分のTL情報取得処理
   * @returns {UserInfoType[]} dataList(DB,my_timeline_dataに格納している値)
   */
  const catUserTimeLine = () => {
    const collectionRef = collection(db, 'my_timeline_data');
    const queryRef = query(collectionRef, orderBy('tweet_created_at', 'desc'));
    getDocs(queryRef).then(
      (querySnapshot) => {
        const dataList: UserInfoType[] = [];
        querySnapshot.docs.map((doc) => {
          const resList: UserInfoType = {
            docId: doc.id,
            favorite: doc.data().favorite as string,
            retweet: doc.data().retweet as string,
            tweet: doc.data().tweet as string,
            media: doc.data().media as string,
            video: doc.data().video as string,
            userId: doc.data().user_id as string,
            userName: doc.data().user_name as string,
            tweetTime: doc.data().tweet_time as Timestamp,
          };
          return dataList.push(resList);
        });
        setTimeline(dataList);
        console.log('responseData', dataList);
      },
      (querySnapshot) => {
        console.log(querySnapshot);
      }
    );
    deleteMyTimeline();
  };

  useEffect(() => {
    Axios.post('http://127.0.0.1:5000/my_timeline')
      .then((response) => {
        console.log(response);
        catUserTimeLine();
      })
      .catch((error) => {
        console.log('catch', error);
        if (Axios.isAxiosError(error) && error.response && error.response.status === 400) {
          console.log(error.message);
        }
      });
    /** myTimelineFlgが更新される時に再レンダリングさせたいため、依存関係起因のeslintエラーを無視する */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getMyTimelineFlg]);

  return (
    <>
      {myTimelineAreaFlg && (
        <div className='main-wrapper'>
          <div>
            <p>プロフィール表示エリア</p>
          </div>
          <div className='main-wrapper--timeline'>
            {timeline.map((user, index) => (
              <div className='timeline-contents' key={index.toString()}>
                <p>{user.userName}</p>
                <p>{user.tweet.replace(/https?:\/\/t.co\/[-_.!~*()a-zA-Z0-9;?:&=+,%#]+/gu, '')}</p>
                <>
                  {user.video.length > 0 && (
                    <div className='video-contents'>
                      <video src={user.video} className='video-contents--item' />
                      <a href={user.video} target='_blank' rel='noreferrer'>
                        <img src={videoIconUrl} alt='動画再生ボタン' className='video-contents--icon' />
                      </a>
                    </div>
                  )}
                </>
                {user.media.length === 1 && (
                  <div className='image-contents'>
                    <img src={user.media[0]} className='image-contents--single'></img>
                  </div>
                )}
                {user.media.length === 2 && (
                  <div className='image-contents--wrapper'>
                    <img src={user.media[0]} className='image-contents--mulch'></img>
                    <img src={user.media[1]} className='image-contents--mulch'></img>
                  </div>
                )}
                {user.media.length === 3 && (
                  <div className='image-contents--wrapper'>
                    <img src={user.media[0]} className='image-contents--mulch'></img>
                    <img src={user.media[1]} className='image-contents--mulch'></img>
                    <img src={user.media[2]} className='image-contents--mulch'></img>
                  </div>
                )}
                {user.media.length === 4 && (
                  <div className='image-contents--wrapper'>
                    <img src={user.media[0]} className='image-contents--mulch'></img>
                    <img src={user.media[1]} className='image-contents--mulch'></img>
                    <img src={user.media[2]} className='image-contents--mulch'></img>
                    <img src={user.media[3]} className='image-contents--mulch'></img>
                  </div>
                )}

                <div className='timeline-contents--statusBar'>
                  <p className='timeline-statusBar--retweet'>⇄ {user.retweet}</p>
                  <p className='timeline-statusBar--favorite'>♡ {user.favorite}</p>
                  <p>{user.tweetTime}</p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p>TabContents表示エリア</p>
          </div>
        </div>
      )}
    </>
  );
}
