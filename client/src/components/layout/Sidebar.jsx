import axios from "axios"; // หรือ import fetch ตามที่คุณใช้
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [username, setUsername] = useState("");
  const [acc_id, setAccId] = useState("");
  const [acc_permission, setAccPermission] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // State สำหรับแสดงภาพตัวอย่าง


  const getSession = async () => {
    try {
      const response = await axios.get("http://localhost:3001/account/session", { withCredentials: true });
      if (response.data.valid) {
        setUsername(response.data.username);
        setAccId(response.data.accId);
        setAccPermission(response.data.accPermission);
      } else {
        console.log("No active session");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };


  useEffect(() => {
    const fetchUserData = async () => {
      await getSession(); // เรียก getSession ก่อนเพื่อให้ได้ acc_id

      if (acc_id) {
        try {
          const response = await axios.get(`http://localhost:3001/account/${acc_id}`);
          const account = response.data[0];
          setImagePreviewUrl(`http://localhost:3001/uploads/${account.image}`);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    fetchUserData();
  }, [acc_id]); // ใช้ acc_id เป็น dependency เพื่อให้ฟังก์ชัน fetchUserData ทำงานหลังจากที่ได้ acc_id แล้ว

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="/home" className="brand-link text-decoration-none">
          <img
            src="../../dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">Manage Employee</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src={imagePreviewUrl}
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block text-decoration-none">
                {username}

              </a>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive ||
                    location.pathname.startsWith("/insert-users") ||
                    location.pathname.match(/^\/\d+/) ||
                    location.pathname.match(/^\/recycle-detail\/\d+/) ||
                    location.pathname.startsWith("/recycle-users")
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <i className="nav-icon fas fa-home" />
                  <p className="text">Home</p>
                </NavLink>
              </li>
              {acc_permission === 'a' && (
              <li className="nav-item">
                <NavLink
                  to="/accounts"
                  className={({ isActive }) =>
                    isActive ||
                    location.pathname.startsWith("/insert-accounts") ||
                    location.pathname.match(/^\/edit-account\/\d+/) ||
                    location.pathname.match(/^\/recycle-account-detail\/\d+/) ||
                    location.pathname.startsWith("/recycle-accounts")
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <i className="nav-icon fas fa-user-circle" />
                  <p className="text">Account</p>
                </NavLink>
              </li>
                 )}
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon far fa-circle text-danger" />
                  <p className="text">Important</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon far fa-circle text-warning" />
                  <p>Warning</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon far fa-circle text-info" />
                  <p>Informational</p>
                </a>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};

export default Sidebar;
