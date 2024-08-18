import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // นำเข้า CSS ของ Bootstrap 5
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditAccount = () => {
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [acc_permission, setAccPermission] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // State สำหรับแสดงภาพตัวอย่าง

  // Extract query parameters
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get("currentPage")) || 1;
  const search = params.get("search") || ""; // Handle search query

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    // อ่านภาพใหม่เพื่อแสดงตัวอย่างทันที
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result); // แสดงตัวอย่างภาพใหม่
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("acc_permission", acc_permission);
    if (profileImage) {
      formData.append("image", profileImage);
    }
    axios
      .put(`http://localhost:3001/account/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate(`/accounts?currentPage=${currentPage}&search=${search}`);
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  return (
    <div className="container mt-3">
      <div className="card  ">
        <div className="card-header ">
          <h2 className="text-center  text-light">Edit Account</h2>
        </div>
        <div className="card-body ">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username">username</label>
              <input
                type="text"
                className="form-control"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                className="form-control"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="profileImage">Profile Image</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
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
            <div className="mb-3">
              <label>Account Permission</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="acc_permission"
                  id="admin_permission"
                  value="a"
                  checked={acc_permission === "a"}
                  onChange={() => setAccPermission("a")}
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
                  value="e"
                  checked={acc_permission === "e"}
                  onChange={() => setAccPermission("e")}
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
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
