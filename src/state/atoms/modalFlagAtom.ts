import { atom } from 'recoil';

/** MyTimeline表示制御Atom */
export const myTimelineAreaFlgState = atom<boolean>({
  key: 'MY_TIMELINE_FLG_AREA',
  default: false,
});

/** UserChangeModal表示制御Atom */
export const userChangeAreaFlgState = atom<boolean>({
  key: 'CHANGE_USER_AREA_FLG',
  default: false,
});

/** LoadingModal表示制御Atom */
export const loadingModalFlgState = atom<boolean>({
  key: 'LOADING_MODAL_FLG',
  default: false,
});

/** FollowModal表示制御Atom */
export const followModalFlgState = atom<boolean>({
  key: 'FOLLOW_MODAL_FLG',
  default: false,
});

export const modalChangeState = {
  myTimelineAreaFlgState,
  userChangeAreaFlgState,
  loadingModalFlgState,
  followModalFlgState,
};

export default modalChangeState;
