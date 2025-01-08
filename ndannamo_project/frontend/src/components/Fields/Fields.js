import { forwardRef, useImperativeHandle, useState } from 'react';
import './Field.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsChevronDown } from "react-icons/bs";

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

export function PickField({
    value,
    setValue,
    name="",
    options=[],
    style={},
    titleStyle={},
}) {

    const [flag, setFlag] = useState(0);

    const handleClick = () => {
        setFlag(1);
    }

    const handleSelect = (suggestion) => {
        setValue(suggestion);
        setFlag(0);
    };

    return (
        <div className="field-container" style={style}>
            <div className="field-title" style={titleStyle}>{name}</div>
            <div className="field-input f-pick" onClick={() => handleClick()}>
                {value}
                <BsChevronDown/>
            </div>
            {flag > 0 && <ul className='field-suggestions'>
                {options.map((option, index) => (
                    <li key={index} onClick={() => handleSelect(option)} className='field-suggestions-data'>
                        {option}
                    </li>
                ))}
            </ul>}
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

    const handleClick = () => {
        setSuggestions(options);
    }

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
                onClick={() => handleClick()}
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
    filled=false,
    titleStyle={},
    formStyle={}
}) {

    return (
        <div className="field-container">
            <div className="field-title" style={titleStyle}>{name}</div>
            <input
                className={filled ? "field-input f-filled" : "field-input"}
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
