
// /pages/Home/index.ts
// 



import WorkspaceSelector from './WorkspaceSelector';
import './Home.css';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { Navigate } from 'react-router-dom';

function Home() {
  const { currentUser } = useCurrentUserStore();
  if(currentUser == null) return <Navigate to="/signin" />

  // console.log("Home")

  return (
    <div className="slack-container">
      <WorkspaceSelector />
      <>
        <Sidebar />
        <MainContent />
      </>
    </div>
  );
}

export default Home;
