# tweet developer

## タスク一覧

### TODO

- web 版 Twitter 開発アプリの UI を作成

  - ~~main 画面の UI 設計~~
  - ~~timeline 取得処理実装~~
  - Python で実装したアクションをサイドバーコンテンツに盛り込む
    - TL に表示するユーザ切り替え用項目を設置する。

- web 版 Twitter 開発アプリの UX を実装

  - ~~timeline 取得処理で画像が文字列で表示されているので、画像として表示されるように更新する~~
    - `技術負債`箇所に記述済みだが、実装要件は満たせているためクローズとする。
  - サイドバーコンテンツに盛り込む Twitter の機能と画面側との連携を実装する
  - ツイートに内包されている動画の取得処理を実装する

- エラーハンドリングについて
  - 現在ハンドリングしたエラーをコンソールに表示しているので、画面に表示するように実装する
    - ErrorBoundary で検知したエラーに関しては画面表示処理実装済み。エラー詳細については表示できていない。

### 申し送り事項

#### テストケースについて

- `react-pro-sidebar`のテストケース記述方法が不明のため、一旦 pending とする。
- 非同期処理のテストコードの書き方が不明のため、一旦 pending とする

### 技術負債

- 各テストケースに記載している以下の型が不明のため、`any`を指定している。

  ```
  let container: any = null;
  ```

- `timeline`内に複数画像が添付されているツイートがある場合の処理が冗長になってしまっている。
  ```
  // 下記一部抜粋
  {user.media.length === 2 && (
    <div className="timeline-image--wrapper">
      <img
        src={user.media[0]}
        className="timeline-image--item"
      ></img>
      <img
        src={user.media[1]}
        className="timeline-image--item"
      ></img>
    </div>
  )}
  {user.media.length === 3 && (
    <div className="timeline-image--wrapper">
      <img
        src={user.media[0]}
        className="timeline-image--items"
      ></img>
      <img
        src={user.media[1]}
        className="timeline-image--items"
      ></img>
      <img
        src={user.media[2]}
        className="timeline-image--items"
      ></img>
    </div>
  )}
  ```
