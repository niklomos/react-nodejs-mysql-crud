import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // นำเข้า CSS ของ Bootstrap 5
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2

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

const RecycleDetail = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // Change age to dob
  const [email, setEmail] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // State สำหรับแสดงภาพตัวอย่าง
  const navigate = useNavigate();

  // Extract query parameters
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get("currentPage")) || 1;
  const search = params.get("search") || ""; // Handle search query

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${id}`)
      .then((response) => {
        const user = response.data[0];
        setName(user.name);
        setDob(user.dob); // Change age to dob
        setEmail(user.email);
        setImagePreviewUrl(`http://localhost:3001/uploads/${user.image}`);
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, [id]);

  const restoreUser = (id) => {
    showConfirmAlert(() => {
      axios
        .put(`http://localhost:3001/restore/${id}`)
        .then(() => {
          navigate(
            `/recycle-users?currentPage=${currentPage}&search=${search}`
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
          <h2 className="text-center  text-light">Recycle Detail</h2>
        </div>
        <div className="card-body ">
          <div className="mb-3">
            <label htmlFor="name">First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={name}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dob">Date of Birth</label> {/* Change Age to Date of Birth */}
            <input
              type="text"
              className="form-control"
              placeholder="Date of Birth"
              value={dob} // Change age to dob
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
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
          <button className="btn btn-primary" onClick={() => restoreUser(id)}>
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleDetail;
