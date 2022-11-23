import { atom } from "recoil";
import { UserType, UserInfoType } from "../../../index";

/** UserChangeModal表示制御Atom */
export const myTimelineFlgState = atom<boolean>({
  key: "MY_TIMELINE_FLG",
  default: true,
});

/** UserChangeModal表示制御Atom */
export const userChangeFlgState = atom<boolean>({
  key: "CHANGE_USER_FLG",
  default: false,
});

/** 表示するuserのTimeline用Atom */
export const userTimelineState = atom<UserInfoType[]>({
  key: "TIMELINE_FLG",
  default: [],
});

/** Timelineを表示する対象User用Atom */
export const userInfoState = atom<UserType[]>({
  key: "USER_INFO_FLG",
  default: [],
});

export const userChangeState = {
  userChangeFlgState,
  userTimelineState,
  userInfoState,
  myTimelineFlgState,
};

export default userChangeState;
