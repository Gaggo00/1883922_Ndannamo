import React, { useRef } from "react";
import "./SearchBar.css";

function SearchBar({
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

    // Per gestire la ricerca
    const handleSearch = async (event) => {
        const value = event.target.value;

        // resetta le trip se il campo e' vuoto
        if (!value) {
            setItems(itemsAll);
        }

        // se c'e' almeno un carattere
        else {
            const filteredItems = items.filter(
                (item) => checkItemSearch(item, value.toLowerCase())
            );
            setItems(filteredItems);
        }
    };


    return (
        <div className="sb-search-bar" style={style}>
            <i className="bi bi-search"></i>
            <input type={type} placeholder={placeholder} onChange={handleSearch}/>
        </div>
    )
}

export default SearchBar;
