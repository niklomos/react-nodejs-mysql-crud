import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "./partialviews/Pagination";
import Search from "./partialviews/Search";

const showConfirmAlert = (onConfirm) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};

// Function to calculate age from dob
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("currentPage")) || 1
  );
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const usersPerPage = 5;

  const fetchUsers = useCallback(() => {
    const offset = (currentPage - 1) * usersPerPage;

    setLoading(true); // Start loading

    axios
      .get(
        `http://localhost:3001/?limit=${usersPerPage}&offset=${offset}&user_status=1&search=${encodeURIComponent(
          searchTerm
        )}`
      )
      .then((response) => {
        if (response.data.users.length === 0 && currentPage > 1) {
          // If no users are found and currentPage > 1, redirect to the previous page
          navigate(
            `?currentPage=${currentPage - 1}&search=${encodeURIComponent(
              searchTerm
            )}`
          );
          setCurrentPage(currentPage - 1);
        } else {
          setUsers(response.data.users); // Set users data
          setTotalUsers(response.data.totalUser); // Set total users
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoading(false); // End loading
      });
  }, [currentPage, searchTerm, navigate, usersPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = (id) => {
    showConfirmAlert(() => {
      axios
        .put(`http://localhost:3001/delete/${id}`)
        .then(() => {
          // After deleting, re-fetch the users on the current page
          fetchUsers();
          
          // Navigate with the current page and search term
          navigate(
            `/home?currentPage=${currentPage}&search=${encodeURIComponent(
              searchTerm
            )}`
          );
        })
        .catch((error) => {
          console.error("Error updating user status:", error);
        });
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(
      `?currentPage=${newPage}&search=${encodeURIComponent(searchTerm)}`
    );
  };

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page
    navigate(`?currentPage=1&search=${encodeURIComponent(newSearchTerm)}`);
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="container pt-3">
      <div className="card ">
        <div className="card-header ">
          <h2 className="text-center text-light">Employee</h2>
          <div className="row">
            <div className="col d-flex justify-content-end mb-3 gap-2">
              <Link to="/insert-users" className="btn btn-primary">
                <i className="fas fa-plus me-1"></i>Create User
              </Link>
              <Link to="/recycle-users" className="btn btn-danger">
                <i className="fas fa-trash-alt me-1"></i>Recycle
              </Link>
            </div>
          </div>
          <div className="row">
            <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          </div>
        </div>
        <div className="card-body table-responsive p-0">
          <table className="table table-dark table-dark-custom m-0">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Date of Birth</th>
                <th scope="col">Age</th>
                <th scope="col">Email</th>
                <th scope="col">Avatar</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.user_id}>
                    <th scope="row">
                      {(currentPage - 1) * usersPerPage + index + 1}
                    </th>
                    <td>{user.name}</td>
                    <td>{user.dob}</td> {/* Displaying DOB */}
                    <td>{calculateAge(user.dob)}</td> {/* Calculating and displaying age */}
                    <td>{user.email}</td>
                    <td>
                      <img
                        src={`http://localhost:3001/uploads/${user.image}`}
                        alt={`${user.name}'s avatar`}
                        width="50"
                      />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/${user.user_id}?currentPage=${currentPage}&search=${encodeURIComponent(searchTerm)}`}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteUser(user.user_id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Home;
