import React from 'react';
import '../../style/baseComponentStyle/searchAreaStyle.css';

/** SearchAreaコンポーネント */
export default function SearchArea() {
  return (
    <div className="search-wrapper">
      <div>
        <p>検索バー表示エリア</p>
      </div>
      <div>
        <p>トレンド表示エリア</p>
      </div>
    </div>
  );
}
