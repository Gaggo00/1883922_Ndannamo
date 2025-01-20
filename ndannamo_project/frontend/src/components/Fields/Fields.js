import { forwardRef, useImperativeHandle, useState } from 'react';
import './Field.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsChevronDown } from "react-icons/bs";

import DateUtilities from '../../utils/DateUtilities';


export function DateField({
    value,
    setValue,
    name="",
    style={},
    titleStyle={},
    disabled=false,
    minDate=null,
    maxDate=null,
    ...rest
}) {


    // serve perche' quando si seleziona una data per la prima volta, per problemi di time zone, imposta il giorno
    // prima rispetto al giorno selezionato
    const fix_UTC_problem = (date) => {
        const dateString = date.toLocaleString('default', {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        });
        const dateArray = dateString.split("/");
        const day = dateArray[0];
        const month = dateArray[1];
        const year = dateArray[2];
        const res = year + "-" + month + "-" + day;
        return res;
    }

    return (
        <div className="field-container" style={style}>
            <div className="field-title" style={titleStyle}>{name}</div>
            <DatePicker
                className={disabled ? 'field-input f-disabled' : 'field-input'}
                selected={value}
                onChange={(date) =>  setValue(fix_UTC_problem(date))/*setValue(DateUtilities.date_To_yyyymmdd(fix_UTC_problem(date)))*/}
                disabled={disabled}
                /*includeDates={includeDates}*/
                minDate={minDate}
                maxDate={maxDate}    
                dateFormat="dd/MM/YYYY"
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
    disabled=false,
}) {

    const [flag, setFlag] = useState(0);

    const handleClick = () => {
        if (!disabled)
            setFlag(1);
    }

    const handleSelect = (suggestion) => {
        setValue(suggestion);
        setFlag(0);
    };

    return (
        <div className="field-container" style={style}>
            <div className="field-title" style={titleStyle}>{name}</div>
            <div className={disabled ? "field-input f-pick f-disabled" : "field-input f-pick"} onClick={() => handleClick()}>
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
    titleStyle={},
    formStyle={},
    disabled=false,
}) {

    return (
        <div className="field-container">
            <div className="field-title" style={titleStyle}>{name}</div>
            <input
                className={disabled ? "field-input f-disabled" : "field-input"}
                type={type}
                style={formStyle}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={disabled}
            />
        </div>
    )
}

export default TextField;
