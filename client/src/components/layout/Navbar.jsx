import axios from "axios";
import { useNavigate } from "react-router-dom";


function Navbar() {
   const navigate = useNavigate()

  const handleLogout = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3001/account/logout'); 
      if (response.data.valid) {
        navigate('/');
    }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <div>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-dark">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" data-widget="fullscreen" href="#" role="button">
              <i className="fas fa-expand-arrows-alt" />
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-danger me-2" href="#" onClick={handleLogout}> <i className=" fa-solid fa-right-from-bracket me-2 "></i>ออกจากระบบ</a>
          </li>
        </ul>
      </nav>
      {/* /.navbar */}
    </div>
  );
}

export default Navbar;
