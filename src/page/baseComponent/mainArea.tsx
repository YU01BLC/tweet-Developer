import React from "react";
import "../../style/baseComponentStyle/mainAreaStyle.css";

/** MainAreaコンポーネント */
export default function MainArea() {
  return (
    <div className="main-wrapper">
      <div>
        <p>プロフィール表示エリア</p>
      </div>
      <div>
        <p>TL表示エリア</p>
      </div>
    </div>
  );
}
