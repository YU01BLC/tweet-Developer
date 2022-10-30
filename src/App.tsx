import { ProSidebarProvider } from 'react-pro-sidebar';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from '../src/common/errorBoundary';
import MainArea from '../src/page/baseComponent/mainArea';
import SidebarArea from '../src/page/baseComponent/sidebarArea';
import SearchArea from '../src/page/baseComponent/searchArea';
import '../src/style/app.css';

export default function App() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <ProSidebarProvider>
          <div className="base-wrapper">
            <SidebarArea />
            <MainArea />
            <SearchArea />
          </div>
        </ProSidebarProvider>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
