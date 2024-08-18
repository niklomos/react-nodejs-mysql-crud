import PropTypes from 'prop-types';

const Search = ({ searchTerm, onSearchChange }) => {
    return (
        <div className='mb-3'>
            <input
                type="text"
                className="form-control text-light"
                placeholder="Search users..."
                value={searchTerm}
                onChange={onSearchChange}
            />
        </div>
    );
};

Search.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
};

export default Search;
