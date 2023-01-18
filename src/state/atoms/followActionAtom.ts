import { atom } from 'recoil';
import { FollowType } from '../../../@types/index';

/** フォロー済みユーザ情報格納用Atom */
export const followDataState = atom<FollowType[]>({
  key: 'FOLLOW_DATA',
  default: [],
});

/** フォロー数管理用Atom */
export const followCountState = atom<number>({
  key: 'FOLLOW_COUNT',
  default: 0,
});

/** フォロー上限管理用Atom */
export const followLimitState = atom<boolean>({
  key: 'FOLLOW_LIMIT',
  default: true,
});

export const FollowState = {
  followDataState,
  followCountState,
  followLimitState,
};

export default FollowState;
