import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <nav aria-label="Page navigation ">
      <ul className="pagination d-flex justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            aria-label="First"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-angle-double-left" />
            {/* <i className="fa-solid fa-angles-left" /> */}
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            aria-label="Previous"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Back{" "}
          </button>
        </li>
        {generatePageNumbers().map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            aria-label="Next"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            {/* <i className="fa-solid fa-chevron-right" /> */}
          </button>
        </li>
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            aria-label="Last"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <i className="fas fa-angle-double-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Define prop types
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
