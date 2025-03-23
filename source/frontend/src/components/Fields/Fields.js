import { useRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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
    disabled=false,
    validate=undefined,
    minDate=null,
    maxDate=null,
    dateFormat="dd/MM/YYYY",
    ...rest
}) {
    const [changed, setIsChanged] = useState(false);
    const [valid, setIsValid] = useState(-1);

    useEffect(() => {
        if (changed)
            checkValidation();
    }, [value]);

    function checkValidation() {
        if (validate) {
            if (!value)
                setIsValid(-1);
            else
            {
                const valid = validate(value);
                if (valid)
                    setIsValid(1);
                else
                    setIsValid(0);
            }
        }
    }

    // serve perche' quando si seleziona una data per la prima volta, per problemi di time zone, imposta il giorno
    // prima rispetto al giorno selezionato
    const fix_UTC_problem = (date) => {
        const dateString = date.toLocaleString('it-IT', {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        });
        const dateArray = dateString.split("/");
        /***if (dateFormat="dd/MM/YYYY") {
            const day = dateArray[0];
            const month = dateArray[1];
            const year = dateArray[2];
        }***/
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
                className={
                    `field-input ${disabled ? "f-disabled" : ""}
                    ${valid === 1 ? "f-valid" : valid === 0 ? "f-nvalid" : ""}`
                }
                selected={value}
                onChange={(date) =>  setValue(fix_UTC_problem(date))}
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
    validate=undefined,
    disabled=false,
}) {
    const [changed, setIsChanged] = useState(false);
    const [flag, setFlag] = useState(0);
    const [valid, setIsValid] = useState(-1);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (changed)
            checkValidation();
    }, [value]);


    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setFlag(0);
        }
    };
    

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside); // Cleanup
        };
    }, []);

    function checkValidation() {
        if (validate) {
            if (!value)
                setIsValid(-1);
            else
            {
                const valid = validate(value);
                if (valid)
                    setIsValid(1);
                else
                    setIsValid(0);
            }
        }
        else
            setIsValid(-1);
    }

    const handleClick = () => {
        setIsChanged(true);
        if (!disabled)
            flag === 0 ? setFlag(1) : setFlag(0);
    }

    const handleSelect = (suggestion) => {
        setValue(suggestion);
        setFlag(0);
        if (validate !== undefined) {
            const valid = validate(value);
            if (valid)
                setIsValid(1);
            else
                setIsValid(0);
        }
    };

    const handleBlur = () => {
        if (validate !== undefined) {
            const valid = validate(value);
            if (valid)
                setIsValid(1);
            else
                setIsValid(0);
        }
    };

    return (
        <div className="field-container" style={style} ref={dropdownRef}>
            <div className="field-title" style={titleStyle}>{name}</div>
            <div
                className={
                    `field-input ${disabled ? "f-disabled" : ""}
                    ${valid === 1 ? "f-valid" : valid === 0 ? "f-nvalid" : ""}`
                }
                onClick={() => handleClick()}
                onBlur={handleBlur}
                >
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

    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState("");

    const handleClick = () => {
        if (suggestions !== [])
            setSuggestions([]);
        else
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
    validate=undefined,
    titleStyle={},
    formStyle={},
    disabled=false,
}) {

    const [changed, setIsChanged] = useState(false);
    const [valid, setIsValid] = useState(-1); //0: non valid, 1 valid, else not defined

    useEffect(() => {
        if (changed)
            checkValidation();
    }, [value]);

    function checkValidation() {
        if (validate) {
            if (!value)
                setIsValid(-1);
            else
            {
                const valid = validate(value);
                if (valid)
                    setIsValid(1);
                else
                    setIsValid(0);
            }
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && validate !== undefined) {
          const valid = validate(value);
          if (valid)
            setIsValid(1);
          else
            setIsValid(0);
        }
    };

    const handleBlur = () => {
        if (validate !== undefined) {
            const valid = validate(value);
            if (valid)
                setIsValid(1);
            else
                setIsValid(0);
        }
    };

    function handleChange(newValue) {
        setIsChanged(true);
        setValue(newValue);
    }

    return (
        <div className="field-container">
            <div className="field-title" style={titleStyle}>{name}</div>
            <input
                className={
                    `field-input ${disabled ? "f-disabled" : ""}
                    ${valid === 1 ? "f-valid" : valid === 0 ? "f-nvalid" : ""}`
                }
                type={type}
                style={formStyle}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                //onKeyDown={handleKeyPress}
                //onBlur={handleBlur}
                disabled={disabled}
            />
        </div>
    )
}

export default TextField;
