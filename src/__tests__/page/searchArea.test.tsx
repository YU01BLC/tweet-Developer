import { render, screen } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import SearchArea from '../../page/baseComponent/searchArea';

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('初回レンダリング時', () => {
  test('ダミーArea「検索バー表示エリア」を示すテキスト', () => {
    act(() => {
      render(<SearchArea />, container);
    });
    const textElement = screen.getByText(/検索バー表示エリア/iu);
    /** 要素の中身をconsoleに表示 */
    screen.debug(textElement);
    /** ドキュメント内に存在しているかチェック */
    expect(textElement).toBeInTheDocument();
  });

  test('ダミーArea「トレンド表示エリア」を示すテキスト', () => {
    act(() => {
      render(<SearchArea />, container);
    });
    const textElement = screen.getByText(/トレンド表示エリア/iu);
    screen.debug(textElement);
    expect(textElement).toBeInTheDocument();
  });
});
