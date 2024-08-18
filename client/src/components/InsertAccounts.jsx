import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // นำเข้า CSS ของ Bootstrap 5
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2

const InsertAccounts = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [acc_permission, setPermission] = useState("");
  const [image, setImage] = useState(null); // ใช้ null แทน empty string สำหรับไฟล์
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // สร้าง FormData object
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("acc_permission", acc_permission);
    if (image) {
      formData.append("image", image);
    }

    axios
      .post("http://localhost:3001/account/insert", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // ตั้งค่า headers สำหรับการส่งข้อมูลแบบ form-data
        },
      })
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/accounts"); // Redirect after the alert is closed
        });
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        Swal.fire({
          title: "Error!",
          text: error,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // เก็บไฟล์ที่เลือกไว้ใน state
  };

  return (
    <div className="container mt-3">
      <div className="card  ">
        <div className="card-header ">
          <h2 className="text-center  text-light">Create Accounts</h2>
        </div>
        <div className="card-body ">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="age" className="form-label">
                Password
              </label>
              <input
                type="text"
                className="form-control"
                id="password"
                placeholder="Enter your age"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                onChange={handleFileChange} // ใช้ handleFileChange
              />
            </div>
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="acc_permission"
                  id="admin_permission"
                  value="a" // Set the value directly to 'a' for Admin
                  checked={acc_permission === "a"} // Checked if the state matches 'a'
                  onChange={() => setPermission("a")} // Update the state to 'a'
                />
                <label className="form-check-label" htmlFor="admin_permission">
                  Admin
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="acc_permission"
                  id="employee_permission"
                  value="e" // Set the value directly to 'e' for Employee
                  checked={acc_permission === "e"} // Checked if the state matches 'e'
                  onChange={() => setPermission("e")} // Update the state to 'e'
                />
                <label
                  className="form-check-label"
                  htmlFor="employee_permission"
                >
                  Employee
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InsertAccounts;
