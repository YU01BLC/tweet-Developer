import Axios from 'axios';
import { collection, getDocs, query } from 'firebase/firestore';
import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { FollowType } from '../../../@types/index';
import { deleteFollowedUser } from '../../common/deleteTimeline';
import db from '../../firebase';
import followState from '../../state/atoms/followActionAtom';
import modalChangeState from '../../state/atoms/modalFlagAtom';
import '../../style/modalAreaStyle/followModalStyle.css';

/** UserFollow用モーダルコンポーネント */
export default function FollowModal() {
  // localState
  /** POST用ユーザ名 localState
   * @type {string} python側に送るfollowキーワードを保存するState
   */
  const [keyword, setKeyword] = useState<string>('');
  /** POST用ユーザ名 localState
   * @type {number} python側に送るfollow件数を保存するState
   */
  const [followNum, setFollowNum] = useState<number>(10);
  /** エラーメッセージ用 localState
   * @type {string} python側に送るアカウント情報が誤っていた時にcatchしたメッセージ保持State
   */
  const [errorText, setErrorText] = useState<string>('');
  /** フォローbutton表示判定localState
   * @type {boolean} フォローbutton表示判定Flg
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const [followButton, setFollowButton] = useState(false);

  // globalState
  /** LoadingModal表示判定 RecoilState
   * @type {boolean}
   */
  const [loadingFlg, setLoadingFlg] = useRecoilState<boolean>(modalChangeState.loadingModalFlgState);
  /** FollowModal表示判定 RecoilState
   * @type {boolean}
   */
  const [followFlg, setFollowFlg] = useRecoilState<boolean>(modalChangeState.followModalFlgState);
  /** フォローユーザー表示用RecoilState
   * @type {FollowType[]}
   */
  const [followedUser, setFollowedUser] = useRecoilState<FollowType[]>(followState.followDataState);

  /** フォロー人数管理用RecoilState
   * @type {number}
   */
  const [followCount, setFollowCount] = useRecoilState<number>(followState.followCountState);

  /** MyTimeline表示制御用RecoilState
   * @type {boolean} 自分のTLの表示を制御するようstate
   */
  const setMyTimelineAreaFlg = useSetRecoilState<boolean>(modalChangeState.myTimelineAreaFlgState);

  /** フォロー上限管理用RecoilState
   * @type {boolean} フォロー上限に到達したことを検知するようState
   */
  const [limit, setLimit] = useRecoilState<boolean>(followState.followLimitState);

  /** 選択したフォロー人数を`setFollowNum`に保存する処理 */
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setFollowNum(Number(event.target.value));
  };

  /** フォローしたユーザ情報取得処理
   * @returns {profileType[]} dataList(DB,follow_dataに格納している値)
   */
  const catFollowedUser = () => {
    const collectionRef = collection(db, 'follow_data');
    const queryRef = query(collectionRef);
    getDocs(queryRef).then(
      (querySnapshot) => {
        const dataList: FollowType[] = [];
        querySnapshot.docs.map((doc) => {
          const resList: FollowType = {
            docId: doc.id,
            accountId: doc.data().account_id as string,
            accountName: doc.data().account_name as string,
          };
          return dataList.push(resList);
        });
        setFollowedUser(dataList);
        console.log('responseFollowData', dataList);
      },
      (querySnapshot) => {
        console.log(querySnapshot);
      }
    );
    /** 取得したフォロー情報をDBから削除する。 */
    deleteFollowedUser();
  };

  /** 入力した情報を元にユーザフォロー処理を実行する */
  const handleFollow = () => {
    Axios.post('http://127.0.0.1:5000/follow', {
      word: keyword,
      count: followNum,
    })
      .then(() => {
        /** 合計フォロー人数を管理するためrecoilStateに保存する */
        setFollowCount(followCount + followNum);
        /** フォロー処理実行後キーワード欄を空にする */
        setKeyword('');
        /** DBに保存したユーザ情報を元に画面にリスト表示する */
        catFollowedUser();
        /** ローディングモーダルを非表示にする */
        setLoadingFlg(false);
        /** 合計フォロー人数が50人に到達した時に警告文を表示する */
        if (followCount === 50) {
          setLimit(true);
        }
      })
      .catch((error) => {
        console.log('catch', error);
        if (Axios.isAxiosError(error) && error.response && error.response.status === 400) {
          console.log(error.message);
        }
        /** アカウント情報が誤っている場合、以下の文言を出力 */
        setLoadingFlg(false);
        /** エラーメッセージを表示するためにlocalStateに格納する */
        setErrorText('選択したアカウントの情報が誤っています。');
        /** Followモーダルを表示にする */
        setFollowFlg(true);
      });
  };

  return (
    <>
      {followFlg && !loadingFlg && (
        <div className='follow-wrapper'>
          <div className='button-wrapper'>
            <p
              className='button-style button-style--closeButton'
              onClick={() => {
                /** followModal非表示時にstateに保持しているerrorメッセージ情報を削除する */
                setErrorText('');
                /** 表示しているフォロー済みリストを空にする */
                setFollowedUser([]);
                /** FollowModalを非表示にする */
                setFollowFlg(false);
                /** 自身のタイムライン画面を表示する */
                setMyTimelineAreaFlg(true);
              }}
            >
              close
            </p>
          </div>
          {!limit && (
            <>
              <div>
                <p className='input-header--description'>
                  特定のキーワードをツイートしているユーザーをフォローします。
                  <br />
                  フォローしたい人数とフォローするキーワードを入力してください。
                </p>
              </div>
              <div className='input-Wrapper'>
                <p className='input-contents--description'>フォロー人数:</p>
                <select onChange={handleChange}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
                <p className='input-contents--description'>キーワード:</p>
                <input
                  placeholder=' followキーワード'
                  onChange={(event) => {
                    /** 入力されたキーワドをlocalStateに保存する */
                    setKeyword(event.target.value);
                    if (event.target.value.length > 2) {
                      /** キーワードが3文字入力されていた時にフォローボタンを表示する */
                      setFollowButton(true);
                    } else {
                      /** キーワードが3文字以下の場合、フォローボタンを非表示にする */
                      setFollowButton(false);
                    }
                  }}
                  value={keyword}
                  maxLength={20}
                />
              </div>
              {errorText.length > 1 && (
                <div>
                  <p className='error-text'>{errorText}</p>
                </div>
              )}
              {followedUser.length > 1 && (
                <table>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>User ID</th>
                      <th>User Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {followedUser.map((followData, index) => (
                      <tr key={index.toString()}>
                        <td align='center'>{index}</td>
                        <td>{followData.accountId}</td>
                        <td>{followData.accountName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {followButton && errorText.length < 1 && (
                <div>
                  <p className='warning-text'>
                    ※ この処理は大変時間が掛かります。
                    <br />
                    PCを閉じずにお待ち下さい。
                  </p>
                  <p
                    className='button-style button-style--tlChangeButton'
                    onClick={() => {
                      /** ローディングモーダルを表示する */
                      setLoadingFlg(true);
                      /** フォロー処理を実行 */
                      handleFollow();
                      /** フォローボタンを非表示にする */
                      setFollowButton(false);
                    }}
                  >
                    フォロー
                  </p>
                </div>
              )}
            </>
          )}
          {limit && (
            <>
              <div className='limit-text--wrapper'>
                フォロー上限に達しました。
                <br />
                これ以上は凍結の恐れがあるため、翌日以降に改めて実行してください。
              </div>
              <p
                className='button-style button-style--tlChangeButton'
                onClick={() => {
                  /** 警告文を非表示にする */
                  setLimit(false);
                }}
              >
                確認して閉じる
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
