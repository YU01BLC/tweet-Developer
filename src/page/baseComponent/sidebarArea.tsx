import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { deleteTimeline, deleteMyProfile } from '../../common/deleteTimeline';
import modalChangeState from '../../state/atoms/modalFlagAtom';
import myTimelineState from '../../state/atoms/myTimelineAtom';
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
  /** MyTimeline項目2重クリック防止制御用RecoilState
   * @type {boolean} MyTimeline箇所をクリックする度にTL取得情報が走ってしまうため、防止するようstate
   */
  const [getMyTimelineFlg, setGetMyTimelineFlg] = useRecoilState<boolean>(myTimelineState.myTimelineGetFlgState);
  /** LoadingModal表示判定 RecoilState
   * @type {boolean}
   */
  const loadingFlg = useRecoilValue(modalChangeState.loadingModalFlgState);

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
              /** 2重クリック防止のため、getMyTimelineFlgの状態を参照する */
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
            }}
          >
            userTimeline
          </MenuItem>
        </SubMenu>

        <SubMenu label='Twitter Contents1'>
          <MenuItem> Twitter Action2 </MenuItem>
        </SubMenu>
        <MenuItem> Twitter Contents2 </MenuItem>
        <MenuItem> Twitter Contents3 </MenuItem>
      </Menu>
    </Sidebar>
  );
}
