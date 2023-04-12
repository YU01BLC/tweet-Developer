import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { deleteTimeline, deleteMyProfile } from '../../common/deleteTimeline';
import modalChangeState from '../../state/atoms/modalFlagAtom';
import myTimelineState from '../../state/atoms/myTimelineAtom';
import followState from '../../state/atoms/followActionAtom';
import '../../style/baseComponentStyle/sidebarAreaStyle.css';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

/** MainAreaコンポーネント */
export default function SidebarArea() {
  /** MyTimeline表示制御用RecoilState
   * @type {boolean} 自分のTLの表示を制御するようstate
   */
  const setMyTimelineAreaFlg = useSetRecoilState<boolean>(modalChangeState.myTimelineAreaFlgState);
  /** UserChangeModal表示制御用RecoilState
   * @type {boolean} 任意のuser情報取得modalの表示を制御するようstate
   */
  const setUserChangeModalFlg = useSetRecoilState<boolean>(modalChangeState.userChangeAreaFlgState);
  /** LoadingModal表示判定 RecoilState
   * @type {boolean}
   */
  const [loadingFlg, setLoadingFlg] = useRecoilState<boolean>(modalChangeState.loadingModalFlgState);
  /** MyTimeline情報取得制御用RecoilState
   * @type {boolean} MyTimeline箇所をクリックする度にTL取得情報が走ってしまうため、防止するようstate
   */
  const [getMyTimelineFlg, setGetMyTimelineFlg] = useRecoilState<boolean>(myTimelineState.myTimelineGetFlgState);
  /** FollowModal表示判定 RecoilState
   * @type {boolean}
   */
  const setFollowFlg = useSetRecoilState<boolean>(modalChangeState.followModalFlgState);
  /** フォロー上限管理用RecoilState
   * @type {boolean} フォロー上限に到達したことを検知するようState
   */
  const setLimit = useSetRecoilState<boolean>(followState.followLimitState);
  /** フォロー人数管理用RecoilState
   * @type {number}
   */
  const followCount = useRecoilValue<number>(followState.followCountState);
  return (
    <Sidebar className={loadingFlg ? 'sidebar-wrapper sidebar-wrapper--noActive' : 'sidebar-wrapper'}>
      <Menu className='sidebar-contents'>
        <SubMenu label='timeline切り替え'>
          <MenuItem
            onClick={() => {
              /** UserChangeModalを非表示にする */
              setUserChangeModalFlg(false);
              /** MyTimeline表示する */
              setMyTimelineAreaFlg(true);
              /** 2重クリック防止のため、TL取得中はsidebarを非アクティブにする*/
              setLoadingFlg(true);
              /** 「myTimeline」ボタン押下時に毎回TL情報を取得するようにする。 */
              if (getMyTimelineFlg) {
                setGetMyTimelineFlg(false);
              } else {
                setGetMyTimelineFlg(true);
              }
            }}
          >
            myTimeline
          </MenuItem>
          <MenuItem
            onClick={() => {
              /** 一度取得していた自身のプロフィール情報を空にする */
              deleteMyProfile();
              /** 一度取得していた自身のTL情報を空にする */
              deleteTimeline();
              /** MyTimeline非表示する */
              setMyTimelineAreaFlg(false);
              /** UserChangeModalを表示にする */
              setUserChangeModalFlg(true);
              /** FollowModalを非表示にする */
              setFollowFlg(false);
            }}
          >
            userTimeline
          </MenuItem>
        </SubMenu>

        <SubMenu label='Follow Action'>
          <MenuItem
            onClick={() => {
              /** MyTimeline非表示する */
              setMyTimelineAreaFlg(false);
              /** UserChangeModalを非表示にする */
              setUserChangeModalFlg(false);
              /** FollowModalを表示にする */
              setFollowFlg(true);
              /** 合計フォロー人数が50人に到達した時に警告文を表示する */
              if (followCount > 50) {
                setLimit(true);
              }
            }}
          >
            Follow
          </MenuItem>
          <MenuItem> Remove </MenuItem>
        </SubMenu>
        <MenuItem> Twitter Contents3 </MenuItem>
      </Menu>
    </Sidebar>
  );
}
