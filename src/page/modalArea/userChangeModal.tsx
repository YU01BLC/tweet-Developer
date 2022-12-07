import Axios from 'axios';
import { collection, getDocs, query, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UserType, UserInfoType } from '../../../@types/index';
import { deleteTimeline, deleteUserInfo } from '../../common/deleteTimeline';
import db from '../../firebase';
import removeIcon from '../../image/delete.png';
import modalChangeState from '../../state/atoms/modalFlagAtom';
import myTimelineState from '../../state/atoms/myTimelineAtom';
import userChangeState from '../../state/atoms/userChangeAtom';
import '../../style/baseComponentStyle/modalAreaStyle/userChangeStyle.css';

/** TL切り替え用モーダルコンポーネント */
export default function UserChangeModal() {
  // localState
  /** 表示対象ユーザ情報削除アイコンlocalState
   * @type {string} 画像url情報を変数に格納
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const removeIconUrl: string = removeIcon;

  /** 表示対象ユーザ情報格納変数
   * @type {UserType[]} ユーザーアカウント/名前格納変数
   */
  const userInfoLocal: UserType[] = [];

  /** POST用ユーザ名 localState
   * @type {string} python側に送るuserNameを保存するState
   */
  const [accountName, setAccountName] = useState<string>('');

  /** POST用ユーザId localState
   * @type {string} python側に送るuserIdを保存するState
   */
  const [accountId, setAccountId] = useState<string>('');

  /** TL切り替えbutton表示判定localState
   * @type {boolean} TL切り替えbutton表示判定Flg
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const [confirmFlg, setConfirmFlg] = useState(false);

  // globalState
  /** userChangeModal表示制御RecoilState
   * @type {boolean} userChangeModal表示制御Flg
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const [userChangeFlg, setUserChangeFlg] = useRecoilState(modalChangeState.userChangeAreaFlgState);

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
    /** 新しいTL情報を取得する前に、古いTL情報を削除する */
    deleteTimeline();

    console.log(user);
    /** 選択したユーザ情報に基づいたTLを取得するためにPython側にaccountId/accountNameを渡す */
    Axios.post('http://127.0.0.1:5000/user_timeline', {
      accountId: user.accountId,
      accountName: user.accountName,
    })
      .then()
      .catch((error) => {
        console.log('catch', error);
        if (Axios.isAxiosError(error) && error.response && error.response.status === 400) {
          console.log(error.message);
        }
      });
    /** TL情報を指定件数全て取得した後にTL切り替え処理を流すためにTL情報取得時間を稼ぐ
     * (ネット環境次第で遅延秒数を増やした方が良いかもしれない)
     */
    setTimeout(() => {
      /** TL切り替えボタンを表示する */
      setConfirmFlg(true);
    }, 1000);
  };

  /** DB_timeline_data削除処理*/
  const refUserInfo = (user: UserType) => {
    console.log(user);
    const info = user.docId;
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
    /** TL切り替えボタンを非表示にする */
    setConfirmFlg(false);
    /** 一度取得していたTL情報を空にする(以下処理でAtomを更新を行い、再度TL情報を取得するため) */
    deleteTimeline();
    /** 古いTL情報を削除する処理を全て行った後に自身のTL情報取得する処理を行いたいため遅延処理を噛ませる */
    setTimeout(() => {
      /** UserChangeModalを非表示にする */
      setUserChangeFlg(false);
      /** MyTimeline表示Flgを立てる */
      setMyTimelineAreaFlg(true);
    }, 500);
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {userChangeFlg && (
        <div className='userTimeline-wrapper'>
          <div className='button-wrapper'>
            <p
              className='button-style button-style--closeButton'
              onClick={() => {
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
              <div className='userInfo-wrapper' key={index.toString()}>
                <div
                  onClick={() => {
                    /** 取得していたUser情報を削除する */
                    refUserInfo(user);
                  }}
                >
                  <img src={removeIconUrl} alt='ユーザ削除ボタン' className='userInfo-removeIcon' />
                </div>
                <div
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

          {confirmFlg && (
            <div>
              <p
                className='button-style button-style--tlChangeButton'
                onClick={() => {
                  /** 選択したuserTimelineを表示する */
                  catUserTimeLine();
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
