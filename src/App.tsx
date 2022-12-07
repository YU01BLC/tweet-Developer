import { ProSidebarProvider } from 'react-pro-sidebar';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from '../src/common/errorBoundary';
import MainArea from '../src/page/baseComponent/mainArea';
import SearchArea from '../src/page/baseComponent/searchArea';
import SidebarArea from '../src/page/baseComponent/sidebarArea';
import UserChangeModal from '../src/page/modalArea/userChangeModal';
import '../src/style/app.css';

export default function App() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <ProSidebarProvider>
          <div className='base-wrapper'>
            <div className='sidebar-wrapper'>
              <SidebarArea />
            </div>
            <div className='main-wrapper'>
              <MainArea />
              <UserChangeModal />
            </div>
            <div className='search-wrapper'>
              <SearchArea />
            </div>
          </div>
        </ProSidebarProvider>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
