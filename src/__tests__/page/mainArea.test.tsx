import { render, screen } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import MainArea from '../../page/baseComponent/mainArea';

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
  test('ダミーArea「プロフィール表示エリア」を示すテキスト', () => {
    act(() => {
      render(<MainArea />, container);
    });
    const textElement = screen.getByText(/プロフィール表示エリア/iu);
    /** 要素の中身をconsoleに表示 */
    screen.debug(textElement);
    /** ドキュメント内に存在しているかチェック */
    expect(textElement).toBeInTheDocument();
  });

  test('ダミーArea「TL表示エリア」を示すテキスト', () => {
    act(() => {
      render(<MainArea />, container);
    });
    const textElement = screen.getByText(/TL表示エリア/iu);
    screen.debug(textElement);
    expect(textElement).toBeInTheDocument();
  });
});
