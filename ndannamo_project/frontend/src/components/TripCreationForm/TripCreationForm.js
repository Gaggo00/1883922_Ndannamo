import React, {useRef, useState} from 'react';
import TripService from '../../services/TripService';
import {TextField, DateField, PickedField} from '../Fields/Fields';
import './TripCreation.css'


const ListItem = ({ name, onClick }) => {
    return (
      <li className='tfc-list-item'>
        <span>{name}</span>
        <button className="tfc-list-item-button" type="button" onClick={onClick}>
          -
        </button>
      </li>
    );
};


function TripCreationForm() {

    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [destination, setDestination] = useState("");
    const [destinations, setDestinations] = useState([]);

    const pickerRef = useRef();
    var lastPossibleDate = new Date();
    lastPossibleDate.setDate(lastPossibleDate.getDate() + 720);

    function changeStartDate(new_date) {
        if (new_date > endDate)
            setEndDate(new_date);
        setStartDate(new_date);
    }

    function _dateToString(date, format = 0, separator = '/', yearB = false) {
        var dateStr = "";
        var day = date.getDate().toString().padStart(2, '0');
        var month = date.getMonth().toString().padStart(2, '0');
        var year = date.getFullYear().toString()

        if (format == 0) {
            dateStr = month + separator + day
            if (yearB)
                dateStr = year.concat(separator, dateStr)
        }
        else if (format == 1) {
            dateStr = day + separator + month
            if (yearB)
                dateStr = dateStr.concat(separator, year)
        }
        else {
            dateStr = month + separator + day
            if (yearB)
                dateStr = dateStr.concat(separator, year)
        }
        
        return dateStr
    }

    const locations = [
        "Parigi",
        "Parma",
        "Padova",
        "Palermo",
        "Londra",
        "Roma",
        "Madrid",
        "Barcellona",
        "Milano",
        "Firenze",
        "Perugia",
    ];

    /*const handleSubmit = () => {
        var new_filled = filled
        for (var i = 0; i <= step; i++)
            new_filled[i] = 1
        setFilled(new_filled)
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            TripService.create(inputValue, destinations, _dateToString(startDate, 0, '-', true), _dateToString(endDate, 0, '-', true));
        }
    };*/

    function addDestination() {
        if (destination) {
            var dest = destinations.slice()
            dest.push(destination);
            setDestinations(dest);
            setDestination("");
            pickerRef.current.reset();
        }
    }

    function handleRemotion() {
        console.log("Eliminare!")
    }

    return (
        <form className="tcf-main-container">
            <div className="tfc-row">
                <div className="tfc-block">
                    <TextField value={title} setValue={setTitle} name="Title"/>
                </div>
            </div>
            <div className="tfc-row">
                <div className="tfc-block">
                    <DateField
                        value={startDate}
                        setValue={changeStartDate}
                        name="Start date"
                        includeDateIntervals={[{start: new Date() - 1, end: lastPossibleDate}]}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                <div className="tfc-block">
                    <DateField
                        value={endDate}
                        setValue={setEndDate}
                        name="End date"
                        includeDateIntervals={[{start: startDate - 1, end: lastPossibleDate}]}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
            </div>
            <div className="tfc-row tfx-last-row">
                <div className="tfc-block">
                    <div style={{flex: '1', display: 'flex', gap: '12px'}}>
                        <PickedField ref={pickerRef} style={{flex: '6'}} setValue={setDestination} name="Destination" options={locations}/>
                        <button
                            value={destination}
                            className='general-button'
                            type='button'
                            onClick={() => addDestination()}
                            style={{
                                flex: '1',
                                borderRadius: '14px',
                                marginTop: '26px',
                                marginBottom: '6px',
                                backgroundColor: 'white',
                                border: '1px solid grey',
                            }}
                        >
                            {"+"}
                        </button>
                    </div>
                </div>
                <div className="tfc-block">
                    <ul className="tfc-list">
                        {destinations.map((d, index) => (
                            <ListItem name={d} key={index} onClick={handleRemotion}/>
                        ))}
                    </ul>
                </div>
            </div>
        </form>
    )
}

export default TripCreationForm;
