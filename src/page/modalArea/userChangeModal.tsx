import Axios from 'axios';
import { collection, getDocs, query, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { useState, useLayoutEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UserType, UserInfoType, ProfileType } from '../../../@types/index';
import { deleteTimeline, deleteUserInfo, deleteProfile } from '../../common/deleteTimeline';
import db from '../../firebase';
import removeIcon from '../../image/delete.png';
import modalChangeState from '../../state/atoms/modalFlagAtom';
import myTimelineState from '../../state/atoms/myTimelineAtom';
import userChangeState from '../../state/atoms/userChangeAtom';
import '../../style/modalAreaStyle/userChangeStyle.css';
import '../../style/commonStyle.css';

/** TL切り替え用モーダルコンポーネント */
export default function UserChangeModal() {
  /** 表示対象ユーザ情報削除アイコン
   * @type {string} 画像url情報を変数に格納
   */
  const removeIconUrl: string = removeIcon;

  /** 表示対象ユーザ情報格納変数
   * @type {UserType[]} ユーザーアカウント/名前格納変数
   */
  const userInfoLocal: UserType[] = [];

  // localState

  /** 選択しているユーザ名 localState
   * @type {string} クリックしているユーザ名保持用State
   */
  const [targetName, setTargetName] = useState<string>('');

  /** 選択しているユーザId localState
   * @type {string} クリックしているユーザID保持用State
   */
  const [targetId, setTargetId] = useState<string>('');

  /** POST用ユーザ名 localState
   * @type {string} python側に送るuserNameを保存するState
   */
  const [accountName, setAccountName] = useState<string>('');

  /** POST用ユーザId localState
   * @type {string} python側に送るuserIdを保存するState
   */
  const [accountId, setAccountId] = useState<string>('');

  /** エラーメッセージ用 localState
   * @type {string} python側に送るアカウント情報が誤っていた時にcatchしたメッセージ保持State
   */
  const [errorText, setErrorText] = useState<string>('');

  /** TL切り替えbutton表示判定localState
   * @type {boolean} TL切り替えbutton表示判定Flg
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const [confirmFlg, setConfirmFlg] = useState(false);

  // globalState

  /** LoadingModal表示判定 RecoilState
   * @type {boolean}
   */
  const [loadingFlg, setLoadingFlg] = useRecoilState(modalChangeState.loadingModalFlgState);

  /** userChangeModal表示制御RecoilState
   * @type {boolean} userChangeModal表示制御Flg
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const [userChangeFlg, setUserChangeFlg] = useRecoilState(modalChangeState.userChangeAreaFlgState);

  /** profile情報用RecoilState
   * @type {profileType[]}
   */
  const setProfile = useSetRecoilState<ProfileType[]>(myTimelineState.profileState);

  /** TL切り替え対象ユーザ表示用RecoilState
   * @type {UserType[]} モーダル内TL対象ユーザ名表示State
   */
  const [userInfo, setUserInfo] = useRecoilState<UserType[]>(userChangeState.userInfoState);

  /** 対象ユーザTL情報埋め込み用RecoilState
   * @type {UserInfoType[]} DBから取得した対象ユーザのTL情報を保持するState
   */
  const setTimeline = useSetRecoilState<UserInfoType[]>(myTimelineState.userTimelineState);

  /** MyTimeline表示制御用RecoilState
   * @type {boolean} 自分のTLの表示を制御するようstate
   */
  const setMyTimelineAreaFlg = useSetRecoilState<boolean>(modalChangeState.myTimelineAreaFlgState);

  /** DB_current_user_info(TL切り替え対象ユーザ情報)取得処理
   * @type {UserType} モーダル内TL対象ユーザ名表示State
   * @returns {UserType} 取得したユーザ情報userItemに格納
   */
  const getUser = () => {
    /** DB情報取得時にアカウントID用ローカルステートをクリアする */
    setAccountId('');
    /** DB情報取得時にアカウント名用ローカルステートをクリアする */
    setAccountName('');
    const collectionRef = collection(db, 'current_user_info');
    getDocs(collectionRef).then(
      (querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          const userItem: UserType = {
            docId: doc.id,
            accountName: doc.data().accountName as string,
            accountId: doc.data().accountId as string,
          };
          return userInfoLocal.push(userItem);
        });
        console.log('responseData', userInfoLocal);
        /** ユーザ情報を格納した配列userInfoLocalをRecoilStateにsetする */
        setUserInfo(userInfoLocal);
      },
      (querySnapshot) => {
        console.log(querySnapshot);
      }
    );
  };

  /** DB_current_user_infoにローカルステートaccountName/accountIdを格納処理 */
  const setUser = () => {
    const collectionRef = collection(db, 'current_user_info');
    return (
      addDoc(collectionRef, {
        accountName,
        accountId,
      })
        .then((docRef) => {
          console.log(docRef);
        })
        .catch((error) => {
          console.log(error);
        }),
      /** DB_current_user_infoにaccountName/accountId格納後に取得処理を実行する */
      getUser()
    );
  };

  /** DB_timeline_data取得準備処理*/
  const catUserName = (user: UserType) => {
    /** 新しいプロフィール情報を取得する前に、古いプロフィール情報を削除する */
    deleteProfile();
    /** 新しいTL情報を取得する前に、古いTL情報を削除する */
    deleteTimeline();
    /** アカウント選択時に一度stateに保持しているerrorメッセージ情報を削除する */
    setErrorText('');
    /** 選択中のユーザIDをstateに保持 */
    setTargetId(user.accountId);
    /** 選択中のユーザ名をstateに保持 */
    setTargetName(user.accountName);
    /** TL切り替えボタンを表示する */
    setConfirmFlg(true);
  };

  /** DB_timeline_data削除処理*/
  const refUserInfo = (user: UserType) => {
    /** アカウント削除時に一度stateに保持しているerrorメッセージ情報を削除する */
    setErrorText('');
    /** TL切り替えボタンを非表示する */
    setConfirmFlg(false);
    console.log(user);
    const info = user.docId;
    /** 削除対象のuser情報を削除処理に渡す */
    deleteUserInfo(info);
    setTimeout(() => {
      getUser();
    }, 500);
  };

  /** DB_user_timeline取得処理
   * @returns {UserInfoType} resListを配列dataListに格納する
   */
  const catUserTimeLine = () => {
    const collectionRef = collection(db, 'timeline_data');
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
        console.log('responseData', dataList);
        /** userTL情報を格納しているdataListをRecoilStateに格納 */
        setTimeline(dataList);
      },
      (querySnapshot) => {
        console.log(querySnapshot);
      }
    );
    /** 一度取得していたｐロフィール情報を空にする */
    deleteProfile();
    /** 一度取得していたTL情報を空にする(以下処理でAtomを更新を行い、再度TL情報を取得するため) */
    deleteTimeline();
    /** 古いTL情報を削除する処理を全て行った後に自身のTL情報取得する処理を行いたいため遅延処理を噛ませる */
    setTimeout(() => {
      /** 指定秒数後にloadingModalを非表示にする */
      setLoadingFlg(false);
      /** MyTimeline表示Flgを立てる */
      setMyTimelineAreaFlg(true);
    }, 500);
  };

  /** userのプロフィール情報取得処理
   * @returns {profileType[]} dataList(DB,my_timeline_dataに格納している値)
   */
  const catProfileInfo = () => {
    /** UserChangeModalを非表示にする */
    setUserChangeFlg(false);
    /** TL取得中にloadingModalを表示する */
    setLoadingFlg(true);
    /** 選択したユーザ情報に基づいたTLを取得するためにPython側にaccountId/accountNameを渡す */
    Axios.post('http://127.0.0.1:5000/user_timeline', {
      accountId: targetId,
      accountName: targetName,
    })
      .then(() => {
        setTargetId('');
        setTargetName('');
        setTimeout(() => {
          const collectionRef = collection(db, 'profile_data');
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
          /** プロフィール情報を取得後にDBのプロフィール情報を削除する */
          deleteProfile();
          catUserTimeLine();
        }, 500);
      })
      .catch((error) => {
        console.log('catch', error);
        /** TL取得中にloadingModalを非表示する */
        if (Axios.isAxiosError(error) && error.response && error.response.status === 400) {
          console.log(error.message);
        }
        /** アカウント情報が誤っている場合、以下の文言を出力 */
        setLoadingFlg(false);
        setErrorText('選択したアカウントの情報が誤っています。');
        /** UserChangeModalを表示にする */
        setUserChangeFlg(true);
      });
  };

  useLayoutEffect(() => {
    /** 初回起動時のみ以下処理を実行したいため、依存関係起因のeslintエラーを無視する */
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {userChangeFlg && !loadingFlg && (
        <div className='modal-wrapper'>
          <div className='button-wrapper'>
            <p
              className='button-style button-style--closeButton'
              onClick={() => {
                /** userChangeModal非表示時にstateに保持しているerrorメッセージ情報を削除する */
                setErrorText('');
                /** userChangeModal非表示時にアカウントID用ローカルステートをクリアする */
                setAccountId('');
                /** userChangeModal非表示時アカウント名用ローカルステートをクリアする */
                setAccountName('');
                /** 一度取得していたTL情報を空にする(以下処理でAtomを更新を行い、再度TL情報を取得するため) */
                deleteTimeline();
                /** 古いTL情報を削除する処理を全て行った後に自身のTL情報取得する処理を行いたいため遅延処理を噛ませる */
                setTimeout(() => {
                  /** UserChangeModalを非表示にする */
                  setUserChangeFlg(false);
                  /** MyTimeline表示Flgを立てる */
                  setMyTimelineAreaFlg(true);
                }, 500);
              }}
            >
              close
            </p>
            {accountName && accountId.length > 4 && (
              <p
                className='button-style button-style--addButton'
                onClick={() => {
                  setUser();
                }}
              >
                add
              </p>
            )}
          </div>
          <div className='input-Wrapper'>
            <div className='input-contents'>
              <p className='input-label--accountName'>表示名: </p>
              <input
                placeholder=' User名'
                onChange={(event) => setAccountName(event.target.value)}
                value={accountName}
                className='input-contents--item'
                maxLength={50}
              />
            </div>
            <div className='input-contents'>
              <p className='input-label--accountId'>ユーザーID: </p>
              <input
                placeholder=' UserID'
                onChange={(event) => setAccountId(event.target.value)}
                value={accountId}
                maxLength={15}
                className='input-contents--item'
              />
            </div>
          </div>
          <div>
            {userInfo.map((user, index) => (
              <div className='userInfo-wrapper' tabIndex={0} key={index.toString()}>
                <div
                  onClick={() => {
                    /** 取得していたUser情報を削除する */
                    refUserInfo(user);
                  }}
                >
                  <img src={removeIconUrl} alt='ユーザ削除ボタン' className='userInfo-removeIcon' />
                </div>
                <div
                  className='userInfo-list'
                  onClick={() => {
                    /** 選択したuserTimeline情報を取得する */
                    catUserName(user);
                  }}
                >
                  <p>userName: {user.accountName}</p>
                  <p>userId: {user.accountId}</p>
                </div>
              </div>
            ))}
          </div>
          {errorText.length > 1 && (
            <div>
              <p className='error-text'>{errorText}</p>
            </div>
          )}

          {confirmFlg && errorText.length < 1 && (
            <div>
              <p
                className='button-style button-style--tlChangeButton'
                onClick={() => {
                  /** TL切り替えボタンを非表示にする */
                  setConfirmFlg(false);
                  /** 選択したuserTimelineを表示する */
                  catProfileInfo();
                }}
              >
                TLを切り替える
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
