import 'admin-lte/dist/css/adminlte.min.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { Navigate, Outlet, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Accounts from './components/Accounts';
import EditAccount from './components/EditAccount';
import EditUser from './components/EditUser';
import Home from './components/home';
import InsertAccounts from './components/InsertAccounts';
import InsertUsers from './components/InsertUsers';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Login from './components/Login';
import Recycle from './components/Recycle';
import RecycleAccountDetail from './components/RecycleAccountDetail';
import RecycleAccounts from './components/RecycleAccounts';
import RecycleDetail from './components/RecycleDetail';


function Layout() {
  const location = useLocation();
  const showNavbarSidebarFooter = location.pathname !== '/';

  return (
    <div className='wrapper'>
      {showNavbarSidebarFooter && <Navbar />}
      {showNavbarSidebarFooter && <Sidebar />}
      <div className='content-wrapper' style={{ backgroundColor: '#454e55' }}>
        <Outlet />
      </div>
      {showNavbarSidebarFooter && <Footer />}
    </div>
  );
}

function ProtectedRoute({ children, requiredPermission }) {
  const [authStatus, setAuthStatus] = useState({ isLoggedIn: false, hasPermission: false, loading: true });

  useMemo(() => {
    axios.get('http://localhost:3001/account/session', { withCredentials: true })
      .then(response => {
        setAuthStatus({
          isLoggedIn: response.data.valid,
          hasPermission: response.data.accPermission !== 'e' || !requiredPermission,
          loading: false
        });
      })
      .catch(() => {
        setAuthStatus({ isLoggedIn: false, hasPermission: false, loading: false });
      });
  }, [requiredPermission]);

  if (authStatus.loading) {
    return <div>Loading...</div>; // หรือแสดงข้อความ loading อื่นๆ
  }

  if (!authStatus.isLoggedIn) {
    return <Navigate to="/" />; // Redirect ไปที่หน้า login
  }

  if (!authStatus.hasPermission) {
    return <Navigate to="/home" />; // Redirect ไปที่หน้า home
  }

  return children;
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children ควรเป็น React node
  requiredPermission: PropTypes.bool // requiredPermission ควรเป็น boolean
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/insert-users" element={<ProtectedRoute><InsertUsers /></ProtectedRoute>} />
          <Route path="/recycle-users" element={<ProtectedRoute><Recycle /></ProtectedRoute>} />
          <Route path="/:id" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
          <Route path="/recycle-detail/:id" element={<ProtectedRoute><RecycleDetail /></ProtectedRoute>} />

          {/* Account */}
          <Route path="/accounts" element={<ProtectedRoute requiredPermission><Accounts /></ProtectedRoute>} />
          <Route path="/insert-accounts" element={<ProtectedRoute requiredPermission><InsertAccounts /></ProtectedRoute>} />
          <Route path="/edit-account/:id" element={<ProtectedRoute requiredPermission><EditAccount /></ProtectedRoute>} />
          <Route path="/recycle-accounts" element={<ProtectedRoute requiredPermission><RecycleAccounts /></ProtectedRoute>} />
          <Route path="/recycle-account-detail/:id" element={<ProtectedRoute requiredPermission><RecycleAccountDetail /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
  
}


export default App;
