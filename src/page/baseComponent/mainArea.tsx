import Axios from 'axios';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { UserInfoType, ProfileType } from '../../../@types/index';
import { deleteMyTimeline, deleteMyProfile } from '../../common/deleteTimeline';
import db from '../../firebase';
import videoIcon from '../../image/video_start.png';
import nullIcon from '../../image/null_icon.png';
import modalChangeState from '../../state/atoms/modalFlagAtom';
import myTimelineState from '../../state/atoms/myTimelineAtom';
import '../../style/baseComponentStyle/mainAreaStyle.css';

/** MainAreaコンポーネント */
export default function MainArea() {
  /** myTimeline表示判定RecoilState
   * @type {boolean}
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const myTimelineAreaFlg = useRecoilValue<boolean>(modalChangeState.myTimelineAreaFlgState);

  /** timeline再取得用RecoilState
   * @type {boolean} 当該stateが更新された時にtimeline情報再取得処理が走る
   */
  const getMyTimelineFlg = useRecoilValue<boolean>(myTimelineState.myTimelineGetFlgState);

  /** userTimeline用RecoilState
   * @type {UserInfoType[]}
   */
  const [timeline, setTimeline] = useRecoilState<UserInfoType[]>(myTimelineState.userTimelineState);

  /** profile情報用RecoilState
   * @type {profileType[]}
   */
  const [profile, setProfile] = useRecoilState<ProfileType[]>(myTimelineState.profileState);

  /** 動画再生ボタンの画像URL情報を変数に代入 */
  const videoIconUrl: string = videoIcon;
  /** プロフィールアイコンがnullの時に表示するよう画像URL情報を変数に代入 */
  const nullIconUrl: string = nullIcon;

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
    /** 取得したtimeline情報をDBから削除する。 */
    deleteMyTimeline();
  };

  /** 自分のプロフィール情報取得処理
   * @returns {profileType[]} dataList(DB,my_timeline_dataに格納している値)
   */
  const catProfileInfo = () => {
    const collectionRef = collection(db, 'my_profile_data');
    const queryRef = query(collectionRef);
    getDocs(queryRef).then(
      (querySnapshot) => {
        const dataList: ProfileType[] = [];
        querySnapshot.docs.map((doc) => {
          const resList: ProfileType = {
            docId: doc.id,
            userName: doc.data().user_name as string,
            description: doc.data().user_description as string,
            icon: doc.data().user_icon as string,
            banner: doc.data().user_banner as string,
          };
          return dataList.push(resList);
        });
        setProfile(dataList);
        console.log('responseProfileData', dataList);
      },
      (querySnapshot) => {
        console.log(querySnapshot);
      }
    );
    /** 取得したプロフィール情報をDBから削除する。 */
    deleteMyProfile();
    catUserTimeLine();
  };

  useEffect(() => {
    Axios.post('http://127.0.0.1:5000/my_timeline')
      .then((response) => {
        console.log(response);
        catProfileInfo();
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

  /**ErrorBoundary確認用 */
  // const ThrowError = (): JSX.Element => {
  //   throw new Error('Throw Error Test');
  // };

  return (
    <>
      {myTimelineAreaFlg && (
        <div className='main-wrapper'>
          {/* <ThrowError /> */}
          <div className='main-profile--wrapper'>
            {profile.map((prof, index) => (
              <div className='profile-contents' key={index.toString()}>
                <div className='profile-contents--imageArea'>
                  <div>
                    {prof.banner.length > 1 ? (
                      <img src={prof.banner} className='imageArea-contents--banner' />
                    ) : (
                      <img src={nullIconUrl} className='imageArea-contents--banner' />
                    )}
                  </div>
                  <div className='imageArea-contents'>
                    {prof.icon.length > 1 ? (
                      <img src={prof.icon} className='imageArea-contents--icon' />
                    ) : (
                      <img src={nullIconUrl} className='imageArea-contents--icon' />
                    )}
                  </div>
                </div>
                <div className='profile-contents--accountArea'>
                  <p>{prof.userName}</p>
                  <p>{prof.description}</p>
                </div>
              </div>
            ))}
            <div className='profile-contents--line' />
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
