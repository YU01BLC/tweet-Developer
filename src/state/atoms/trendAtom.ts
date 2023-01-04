import { atom } from 'recoil';
import { TrendType } from '../../../@types/index';

/** トレンド情報格納用Atom */
export const trendDataState = atom<TrendType[]>({
  key: 'TREND_DATA',
  default: [],
});

export const trendState = {
  trendDataState,
};

export default trendState;
