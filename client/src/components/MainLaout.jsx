// src/components/MainLayout.jsx
import PropTypes from 'prop-types'; // นำเข้า PropTypes
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => (
  <div className='wrapper'>
    <Navbar />
    <Sidebar />
    <div className='content-wrapper' style={{ backgroundColor: '#454e55' }}>
      {children}
    </div>
    <Footer />
  </div>
);

// กำหนด propTypes
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
