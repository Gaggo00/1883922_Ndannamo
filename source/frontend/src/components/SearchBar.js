import React from "react";
import "./SearchBar.css";

function SearchBar({
    value,
    setValue=()=>{},
    items = [],
    itemsAll = [],
    setItems = () => {},
    checkItemSearch = (value, searchTerm) => {
      if (!value || !searchTerm) return false;
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    },
    type = "text",
    placeholder = "",
    style={},
  }) {

    const handleSearch = async (event) => {
        const newValue = event.target.value
        setValue(newValue);

        if (!newValue || newValue === "") {
            setItems(itemsAll);
        }

        else {
            const filteredItems = items.filter(
                (item) => checkItemSearch(item, newValue.toLowerCase())
            );
            setItems(filteredItems);
        }
    };


    return (
        <div className="sb-search-bar" style={style}>
            <i className="bi bi-search"></i>
            <input type={type} value={value} placeholder={placeholder} onChange={handleSearch}/>
        </div>
    )
}

export default SearchBar;
