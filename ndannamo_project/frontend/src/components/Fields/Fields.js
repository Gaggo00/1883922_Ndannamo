import { forwardRef, useImperativeHandle, useState } from 'react';
import './Field.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function DateField({
    value,
    setValue,
    name="",
    style={},
    titleStyle={},
    ...rest
}) {

    return (
        <div className="field-container" style={style}>
            <div className="field-title" style={titleStyle}>{name}</div>
            <DatePicker
                className='field-input'
                selected={value}
                onChange={(date) => setValue(date)}
                {...rest}
            />
        </div>
    )
}


export const PickedField = forwardRef(({
    value,
    setValue,
    name = "",
    placeholder = name,
    options = [],
    style = {},
    titleStyle = {},
    formStyle = {}
}, ref) => {

    const [suggestions, setSuggestions] = useState([])
    const [search, setSearch] = useState("")

    const handleChange = (event) => {
        var newSearch = event.target.value
        setSearch(newSearch)

        if (newSearch) {
            const filteredSuggestions = options.filter((option) => option.toLowerCase().includes(newSearch.toLowerCase()));
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (suggestion) => {
        setSearch(suggestion);
        setValue(suggestion);
        setSuggestions([]);
    };

    const reset = () => {
        setSearch("");
        setSuggestions([]);
    };

    useImperativeHandle(ref, () => ({
        reset,
    }));

    return (
        <div className="field-container" style={style}>
            <div className="field-title" style={titleStyle}>{name}</div>
            <input
                className="field-input"
                style={formStyle}
                value={search}
                placeholder={placeholder}
                onChange={(e) => handleChange(e)}
            />
            {suggestions.length > 0 && <ul className='field-suggestions'>
                {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSelect(suggestion)} className='field-suggestions-data'>
                        {suggestion}
                    </li>
                ))}
            </ul>}
        </div>
    )
})


export function TextField({
    value,
    setValue,
    name="",
    type="text",
    placeholder=name,
    titleStyle={},
    formStyle={}
}) {

    return (
        <div className="field-container">
            <div className="field-title" style={titleStyle}>{name}</div>
            <input
                className="field-input"
                type={type}
                style={formStyle}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}

export default TextField;
