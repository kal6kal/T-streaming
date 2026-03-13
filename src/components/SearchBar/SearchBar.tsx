// src/components/SearchBar/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  value?: string; // add this
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, value = "" }) => {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      value={value}
      onChange={(e) => onSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  );
};

export default SearchBar;