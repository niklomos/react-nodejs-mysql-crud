import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap 5 CSS
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(""); // State for image preview
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(""); // Add error state

  // Extract query parameters
  const params = new URLSearchParams(location.search);
  const currentPage = parseInt(params.get("currentPage")) || 1;
  const search = params.get("search") || ""; // Handle search query

  useEffect(() => {
    // Fetch user data
    axios
      .get(`http://localhost:3001/${id}`)
      .then((response) => {
        const user = response.data[0];
        setName(user.name);
        setDob(user.dob);
        setEmail(user.email);
        setImagePreviewUrl(`http://localhost:3001/uploads/${user.image}`);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setError("Failed to load user data.");
      })
      .finally(() => {
        setLoading(false); // End loading
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    // Show image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("dob", dob);
    formData.append("email", email);
    if (profileImage) {
      formData.append("image", profileImage);
    }

    // Send PUT request to update user
    axios
      .put(`http://localhost:3001/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        navigate(`/home?currentPage=${currentPage}&search=${search}`);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setError("Failed to update user.");
      });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) return <div className="container mt-5">Loading...</div>; // Show loading state

  return (
    <div className="container mt-3">
      <div className="card  ">
        <div className="card-header ">
          <h2 className="text-center  text-light">Edit Users</h2>
        </div>
        <div className="card-body ">
          {error && <div className="alert alert-danger">{error}</div>}{" "}
          {/* Display error message */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name">First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                
              />
              <small className="form-text text-muted">
                Age: {calculateAge(dob)}
              </small>
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
