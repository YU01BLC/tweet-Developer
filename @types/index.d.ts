declare var localStorage: Storage;

/** Timelineを表示するユーザのプロフィール箇所用型 */
export type ProfileType = {
  docId: string;
  userName: string;
  description: string;
  icon: string;
  banner: string;
};

/** Timelineを表示するユーザ用型 */
export type UserType = {
  docId: string;
  accountName: string;
  accountId: string;
};

/** userTimeline用型 */
export type UserInfoType = {
  docId: string;
  favorite: string;
  retweet: string;
  tweet: string;
  media: string;
  video: string;
  userId: string;
  userName: string;
  tweetTime: Timestamp;
};
