import { ProSidebarProvider } from 'react-pro-sidebar';
import { RecoilRoot } from 'recoil';
import ErrorBoundary from '../src/common/errorBoundary';
import MainArea from '../src/page/baseComponent/mainArea';
import ResearchArea from './page/baseComponent/researchArea';
import SidebarArea from '../src/page/baseComponent/sidebarArea';
import FollowModal from '../src/page/modalArea/followModal';
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
              <FollowModal />
            </div>
            <div className='research-wrapper'>
              <ResearchArea />
            </div>
          </div>
        </ProSidebarProvider>
      </ErrorBoundary>
    </RecoilRoot>
  );
}
