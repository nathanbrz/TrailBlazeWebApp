import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const SearchForm = ({ onSearch }) => {
  const [query, setQuery] = useState(""); // State to hold the search query

  // Function to handle the search action
  const handleSearch = () => {
    if (onSearch) {
      onSearch(query); // Pass the internal query to the parent
    }
  };

  // Function to handle 'Enter' key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission
      handleSearch();
    }
  };

  return (
    <div className="input-group my-3">
      <button className="btn btn-light" type="button" onClick={handleSearch}>
        <i className="bi bi-search"></i>
      </button>
      <input
        type="text"
        className="form-control"
        placeholder="Type to search"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update internal state
        onKeyDown={handleKeyPress} // Allows pressing 'Enter' to search
      />
    </div>
  );
};

export default SearchForm;
