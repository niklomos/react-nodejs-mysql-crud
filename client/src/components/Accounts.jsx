import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // นำเข้า CSS ของ Bootstrap 5
import { useCallback, useEffect, useState } from "react";
import { FaStar } from "react-icons/fa"; // นำเข้าไอคอนจาก React Icons
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // นำเข้า SweetAlert2
import Pagination from "./partialviews/Pagination";
import Search from "./partialviews/Search";


const showConfirmAlert = (onConfirm) => {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this account?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm(); // เรียกใช้ฟังก์ชัน callback เมื่อยืนยัน
    }
  });
};

const Accounts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("currentPage")) || 1
  );
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search") || "");
  const accountsPerPage = 5;

  const fetchUsers = useCallback(() => {
    const offset = (currentPage - 1) * accountsPerPage;

    setLoading(true); // Start loading

    axios
      .get(
        `http://localhost:3001/account//?limit=${accountsPerPage}&offset=${offset}&acc_status=1&search=${encodeURIComponent(
          searchTerm
        )}`
      )
      .then((response) => {
        if (response.data.accounts.length === 0 && currentPage > 1) {

          // If no users are found and currentPage > 1, redirect to the previous page
          navigate(
            `?currentPage=${currentPage - 1}&search=${encodeURIComponent(
              searchTerm
            )}`
          );
          setCurrentPage(currentPage - 1);
        } else {
          setAccounts(response.data.accounts); // Set users data
          setTotalAccounts(response.data.totalAccount); // Set total users
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoading(false); // End loading
      });
  }, [currentPage, searchTerm, navigate, accountsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteAccount = (id) => {
    showConfirmAlert(() => {
      axios
        .put(`http://localhost:3001/account/delete/${id}`)
        .then(() => {
          // After deleting, re-fetch the users on the current page
          fetchUsers();
          
          // Navigate with the current page and search term
          navigate(
            `/accounts?currentPage=${currentPage}&search=${encodeURIComponent(
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

  const totalPages = Math.ceil(totalAccounts / accountsPerPage);
  return (
    <div className="container pt-3">
      <div className="card ">
        <div className="card-header ">
          <h2 className="text-center  text-light ">Accounts</h2>
          <div className="row">
            <div className="col d-flex justify-content-end mb-3 gap-2">
              <Link to="/insert-accounts" className="btn btn-primary">
              <i className="fas fa-plus me-1"></i>Create Account
              </Link>
              <Link to="/recycle-accounts" className="btn btn-danger">
              <i className="fas fa-trash-alt me-1"></i>Recycle
              </Link>
            </div>
          </div>
        <div className="row">
        <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        </div>
        </div>
        <div className="  card-body  table-responsive p-0 ">
        <table className="table table-dark table-dark-custom m-0">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Permission</th>
              <th scope="col">Avata</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
          {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : accounts.length > 0 ? (
                accounts.map((account, index) => (
                  <tr key={account.acc_id}>
                    <th scope="row">
                      {(currentPage - 1) * accountsPerPage + index + 1}
                    </th>
                  <td>{account.username}</td>
                  <td>
                    {account.acc_permission === "a" ? (
                      <>
                        Administrator <FaStar />
                      </>
                    ) : (
                      <>
        Employee <i className="fas fa-user"></i> {/* ใช้คลาสสำหรับไอคอน Employee */}
        </>
                    )}
                  </td>
                  <td>
                    <img
                      src={`http://localhost:3001/uploads/${account.image}`}
                      alt={`${account.username}'s avatar`}
                      width="50"
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                    <Link
                          to={`/edit-account/${account.acc_id
                          }?currentPage=${currentPage}&search=${encodeURIComponent(
                            searchTerm
                          )}`}
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </Link>
                      <button
                        onClick={() => deleteAccount(account.acc_id)}
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
              <td colSpan="6" className="text-center">
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

export default Accounts;
