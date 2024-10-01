import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const SearchForm = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query); // Trigger the search action with the query
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
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
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress} // Allows pressing 'Enter' to search
      />
    </div>
  );
};

export default SearchForm;
