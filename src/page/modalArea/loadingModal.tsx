import loadingIcon from '../../image/loading.png';
import '../../style/modalAreaStyle/loadingModalStyle.css';

/** ローディング待機用モーダルコンポーネント */
export default function LoadingModal() {
  /** 表示対象ユーザ情報削除アイコン
   * @type {string} 画像url情報を変数に格納
   */
  const loadingIconUrl: string = loadingIcon;
  return (
    <>
      <div className='loading-wrapper'>
        <h1 className='loading-message'>
          情報取得中です。
          <br />
          しばらくお待ちください。
        </h1>
        <img src={loadingIconUrl} alt='loading待機画像' className='loading-image' />
        <div className='loading-circle--wrapper'>
          <div className='sk-circle'>
            <div className='sk-circle1 sk-child'></div>
            <div className='sk-circle2 sk-child'></div>
            <div className='sk-circle3 sk-child'></div>
            <div className='sk-circle4 sk-child'></div>
            <div className='sk-circle5 sk-child'></div>
            <div className='sk-circle6 sk-child'></div>
            <div className='sk-circle7 sk-child'></div>
            <div className='sk-circle8 sk-child'></div>
            <div className='sk-circle9 sk-child'></div>
            <div className='sk-circle10 sk-child'></div>
            <div className='sk-circle11 sk-child'></div>
            <div className='sk-circle12 sk-child'></div>
          </div>
        </div>
      </div>
    </>
  );
}
