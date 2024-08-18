import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const InsertUsers = () => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState(""); // Changed state variable to dob
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob); // Append dob instead of age
    formData.append("email", email);
    if (image) {
      formData.append("image", image);
    }

    axios
      .post("http://localhost:3001/insert", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/home");
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
    setImage(e.target.files[0]);
  };

  return (
    <div className="container mt-3">
      <div className="card">
        <div className="card-header">
          <h2 className="text-center text-light">Create Users</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dob"
                placeholder="Enter your date of birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)} // Updated onChange handler
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={handleFileChange}
              />
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

export default InsertUsers;
