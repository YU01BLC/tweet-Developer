import { atom } from 'recoil';

/** MyTimeline表示制御Atom */
export const myTimelineAreaFlgState = atom<boolean>({
  key: 'MY_TIMELINE_FLG_AREA',
  default: true,
});

/** UserChangeModal表示制御Atom */
export const userChangeAreaFlgState = atom<boolean>({
  key: 'CHANGE_USER_AREA_FLG',
  default: false,
});

export const modalChangeState = {
  myTimelineAreaFlgState,
  userChangeAreaFlgState,
};

export default modalChangeState;
