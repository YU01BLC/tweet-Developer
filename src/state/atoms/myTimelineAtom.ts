import { atom } from 'recoil';
import { UserInfoType, ProfileType } from '../../../@types/index';

/** UserChangeModal表示制御Atom */
export const myTimelineGetFlgState = atom<boolean>({
  key: 'MY_TIMELINE_GET_FLG',
  default: true,
});

/** 表示するuserのTimeline用Atom */
export const userTimelineState = atom<UserInfoType[]>({
  key: 'TIMELINE_FLG',
  default: [],
});

/** 表示するuserのprofile用Atom */
export const profileState = atom<ProfileType[]>({
  key: 'PROFILE_FLG',
  default: [],
});

export const myTimelineState = {
  userTimelineState,
  myTimelineGetFlgState,
  profileState,
};

export default myTimelineState;
