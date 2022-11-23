import Axios from "axios";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { UserType, UserInfoType } from "../../../index";
import { deleteTimeline, deleteUserInfo } from "../../common/deleteTimeline";
import db from "../../firebase";
import userChangeState from "../../state/atoms/userChangeAtom";
/** TL切り替え用モーダルコンポーネント */
export default function UserChangeModal() {
  // localState

  /** 表示対象ユーザ情報格納変数
   * @type {UserType[]} ユーザーアカウント/名前格納変数
   */
  const userInfoLocal: UserType[] = [];

  /** 表示対象ユーザ登録フォーム表示localState
   * @type {boolean} ユーザ登録フォーム表示判定Flg
   * @description
   * ・true: 表示
   * ・false: 非表示
   */
  const [inputUserFlg, setInputUserFlg] = useState<boolean>(false);

  /** POST用ユーザ名 localState
   * @type {string} python側に送るuserNameを保存するState
   */
  const [accountName, setAccountName] = useState<string>("");

  /** POST用ユーザId localState
   * @type {string} python側に送るuserIdを保存するState
   */
  const [accountId, setAccountId] = useState<string>("");

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
  const [userChangeFlg, setUserChangeFlg] = useRecoilState(
    userChangeState.userChangeFlgState
  );

  /** TL切り替え対象ユーザ表示用RecoilState
   * @type {UserType[]} モーダル内TL対象ユーザ名表示State
   */
  const [userInfo, setUserInfo] = useRecoilState<UserType[]>(
    userChangeState.userInfoState
  );

  /** 対象ユーザTL情報埋め込み用RecoilState
   * @type {UserInfoType[]} DBから取得した対象ユーザのTL情報を保持するState
   */
  const setTimeline = useSetRecoilState<UserInfoType[]>(
    userChangeState.userTimelineState
  );

  /** DB_current_user_info(TL切り替え対象ユーザ情報)取得処理
   * @type {UserType} モーダル内TL対象ユーザ名表示State
   * @returns {UserType} 取得したユーザ情報userItemに格納
   */
  const getUser = () => {
    /** 切り替え対象ユーザが存在しない場合ユーザ登録フォームを表示する */
    if (userInfoLocal.length === 0) {
      setInputUserFlg(true);
    }
    /** DB情報取得時にアカウントID用ローカルステートをクリアする */
    setAccountId("");
    /** DB情報取得時にアカウント名用ローカルステートをクリアする */
    setAccountName("");
    const collectionRef = collection(db, "current_user_info");
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
        console.log("responseData", userInfoLocal);
        /** ユーザ情報を格納した配列userInfoLocalをRecoilStateにsetする */
        setUserInfo(userInfoLocal);
        if (userInfoLocal.length === 0) {
          setInputUserFlg(true);
        } else {
          setInputUserFlg(false);
        }
      },
      (querySnapshot) => {
        console.log(querySnapshot);
      }
    );
  };

  /** DB_current_user_infoにローカルステートaccountName/accountIdを格納処理 */
  const setUser = () => {
    const collectionRef = collection(db, "current_user_info");
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
    console.log(user);
    /** 選択したユーザ情報に基づいたTLを取得するためにPython側にaccountId/accountNameを渡す */
    Axios.post("http://127.0.0.1:5000/user_timeline", {
      accountId: user.accountId,
      accountName: user.accountName,
    })
      .then()
      .catch((error) => {
        console.log(error);
      });
    /** TL切り替えボタンを表示する */
    setConfirmFlg(true);
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
    const collectionRef = collection(db, "timeline_data");
    const queryRef = query(collectionRef, orderBy("tweet_created_at", "desc"));
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
            userId: doc.data().user_id as string,
            userName: doc.data().user_name as string,
            tweetTime: doc.data().tweet_time as Timestamp,
          };
          return dataList.push(resList);
        });
        console.log("responseData", dataList);
        /** userTL情報を格納しているdataListをRecoilStateに格納 */
        setTimeline(dataList);
      },
      (querySnapshot) => {
        console.log(querySnapshot);
      }
    );
    /** TL切り替えボタンを非表示にする */
    setConfirmFlg(false);
    /** UserChangeModalを非表示にする */
    setUserChangeFlg(false);
  };

  return (
    <div>
      <div>
        <div
          onClick={() => {
            setUserChangeFlg(false);
          }}
        >
          <p>×</p>
        </div>
        <div>
          <p
            onClick={() => {
              setInputUserFlg(true);
            }}
          >
            +
          </p>
        </div>
      </div>
      <div>
        <div>
          {userInfo.map((user, index) => (
            <div key={index.toString()}>
              <div
                onClick={() => {
                  refUserInfo(user);
                }}
              >
                <img src={"../../image/delete.png"} />
              </div>
              <div
                onClick={() => {
                  catUserName(user);
                }}
              >
                <p>userName: {user.accountName}</p>
                <p>userId: {user.accountId}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        {inputUserFlg && (
          <div>
            <div>
              <p>表示名: </p>
              <input
                placeholder=" User名"
                onChange={(event) => setAccountName(event.target.value)}
                value={accountName}
                maxLength={50}
              />
            </div>
            <div>
              <p>ユーザーID: </p>
              <input
                placeholder=" UserID"
                onChange={(event) => setAccountId(event.target.value)}
                value={accountId}
                maxLength={15}
              />
            </div>
            <div>
              <div>
                <p
                  onClick={() => {
                    setAccountId("");
                    setAccountName("");
                    setInputUserFlg(false);
                    if (userInfoLocal.length === 0) {
                      setUserChangeFlg(false);
                      /** レンダリングなしでモーダル表示した場合、ユーザ登録フォームが非表示になるためFlgを立てる */
                      setInputUserFlg(true);
                    }
                  }}
                >
                  キャンセル
                </p>
              </div>
              {accountName && accountId && (
                <div>
                  <p
                    onClick={() => {
                      setUser();
                    }}
                  >
                    登録
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {confirmFlg && !inputUserFlg && (
        <div>
          <p
            onClick={() => {
              deleteTimeline();
              catUserTimeLine();
            }}
          >
            TLを切り替える
          </p>
        </div>
      )}
    </div>
  );
}
