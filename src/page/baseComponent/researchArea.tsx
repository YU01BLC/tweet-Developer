import Axios from 'axios';
import { collection, getDocs, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { TrendType } from '../../../@types/index';
import { deleteTrend } from '../../common/deleteTimeline';
import db from '../../firebase';
import trendState from '../../state/atoms/trendAtom';
import '../../style/baseComponentStyle/researchAreaStyle.css';

/** ResearchAreaコンポーネント */
export default function ResearchArea() {
  // localState
  /** 初回データ取得時にエラーの時にErrorBoundary画面を表示する用 localState
   * @type {boolean}
   */
  const [boundaryFlg, setBoundaryFlg] = useState<boolean>(false);

  /** データ再取得用 localState
   * @type {boolean}
   */
  const [getTrendFlg, setGetTrendFlg] = useState<boolean>(true);

  // RecoilState
  /** トレンド情報用RecoilState
   * @type {TrendType[]}
   */
  const [trend, setTrend] = useRecoilState<TrendType[]>(trendState.trendDataState);
  const reGetTrend = () => {
    setTimeout(() => {
      setGetTrendFlg(!getTrendFlg);
    }, 600000);
  };

  /** トレンド情報取得処理
   * @returns {TrendType[]} dataList(DB,trend_dataに格納している値)
   */
  const getTrendData = () => {
    const collectionRef = collection(db, 'trend_data');
    const queryRef = query(collectionRef);
    getDocs(queryRef).then(
      (querySnapshot) => {
        const dataList: TrendType[] = [];
        querySnapshot.docs.map((doc) => {
          const resList: TrendType = {
            docId: doc.id,
            trendName: doc.data().trends_name as string,
            trendURL: doc.data().trends_url as string,
          };
          return dataList.push(resList);
        });
        setTrend(dataList);
        console.log('responseTrendData', dataList);
      },
      (querySnapshot) => {
        console.log(querySnapshot);
      }
    );
    reGetTrend();
  };

  useEffect(() => {
    deleteTrend();
    Axios.post('http://127.0.0.1:5000/trend')
      .then((response) => {
        console.log(response);
        setBoundaryFlg(false);
        getTrendData();
      })
      .catch((error) => {
        console.log('catch', error);
        if (Axios.isAxiosError(error) && error.response && error.response.status === 400) {
          console.log(error.message);
        }
        setBoundaryFlg(true);
        clearTimeout(600000);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTrendFlg]);

  /** ErrorBoundary表示用 */
  const ThrowError = (): JSX.Element => {
    throw new Error('Throw Error');
  };

  return (
    <div className='research-wrapper'>
      {boundaryFlg && <ThrowError />}
      <div>
        {trend.map((trendData, index) => (
          <div key={index.toString()}>
            <div className='research-contents'>
              <a href={trendData.trendURL} className='research-contents--item'>
                {trendData.trendName}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
