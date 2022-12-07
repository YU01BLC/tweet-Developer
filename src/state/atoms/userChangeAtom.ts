import { atom } from 'recoil';
import { UserType } from '../../../@types/index';

/** UserChangeModal表示制御Atom */
export const userChangeFlgState = atom<boolean>({
  key: 'CHANGE_USER_FLG',
  default: false,
});

/** Timelineを表示する対象User用Atom */
export const userInfoState = atom<UserType[]>({
  key: 'USER_INFO_FLG',
  default: [],
});

export const userChangeState = {
  userChangeFlgState,
  userInfoState,
};

export default userChangeState;
