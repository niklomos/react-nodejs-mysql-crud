import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // นำเข้า CSS ของ Bootstrap 5
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2

const RecycleAccountDetail = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [acc_permission, setAccPermission] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // State สำหรับแสดงภาพตัวอย่าง
  const navigate = useNavigate();

  // Extract query parameters
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get("currentPage")) || 1;
  const search = params.get("search") || ""; // Handle search query

  const showConfirmAlert = (onConfirm) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to restore this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, restore it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); // เรียกใช้ฟังก์ชัน callback เมื่อยืนยัน
      }
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/account/${id}`)
      .then((response) => {
        const account = response.data[0];
        setUsername(account.username);
        setPassword(account.password);
        setAccPermission(account.acc_permission);
        setImagePreviewUrl(`http://localhost:3001/uploads/${account.image}`);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [id]);

  const restoreAccount = (id) => {
    showConfirmAlert(() => {
      axios
        .put(`http://localhost:3001/account/restore/${id}`)
        .then(() => {
          navigate(
            `/recycle-accounts?currentPage=${currentPage}&search=${search}`
          );
        })
        .catch((error) => {
          console.error("Error updating user status:", error);
        });
    });
  };
  return (
    <div className="container mt-3">
      <div className="card  ">
        <div className="card-header ">
          <h2 className="text-center  text-light">Recycle Account Detail</h2>
        </div>
        <div className="card-body ">
          <div className="mb-3">
            <label htmlFor="username">username</label>
            <input
              type="text"
              className="form-control"
              placeholder="username"
              value={username}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              className="form-control"
              placeholder="password"
              value={password}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="acc_permission">Permission</label>
            <input
              type="text"
              className="form-control"
              placeholder="Permission"
              value={acc_permission == 'a'?'Administrator':'Employee' }
              disabled
            />
          </div>
          {imagePreviewUrl && (
            <div className="mb-3">
              <img
                id="imagePreview"
                src={imagePreviewUrl}
                alt="Profile Preview"
                width="150"
                className="img-thumbnail"
              />
            </div>
          )}
          <button
            className="btn btn-primary"
            onClick={() => restoreAccount(id)}
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleAccountDetail;
