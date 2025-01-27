import React, { useState } from 'react';
import DateUtilities from '../../utils/DateUtilities';

import TextField, { DateField, PickedField, PickField } from "../../components/Fields/Fields";

const SecondStep = ({ nextStep, prevStep, handleChange, values }) => {
    const [error, setError] = useState('');

    const initializeStartDate = () => {
        if (values.startDate != null) return values.startDate;
        return new Date();
    }
    const [startDate, setStartDate] = useState(initializeStartDate());

    const initializeEndDate = () => {
        if (values.endDate != null) return values.endDate;
        else if (values.startDate != null) return DateUtilities.getNextDay(values.startDate);
        return DateUtilities.getNextDay(new Date());
    }
    const [endDate, setEndDate] = useState(initializeEndDate());


    const handleNext = () => {
        if (!values.startDate || !values.endDate) {
            setError('Both start and end dates are required!');
        } else if (new Date(values.startDate) >= new Date(values.endDate)) {
            setError('The start date must be before the end date!');
        } else {
            setError('');
            nextStep();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleNext();
        }
    };

    /*
    const setMinStartDate = () => {
        var today = DateUtilities.date_To_yyyymmdd(new Date());
        document.getElementById("startDate").setAttribute('min', today);
    }
    const setMinEndDate = () => {
        if (values.startDate) {
            var nextDay = DateUtilities.getNextDay(values.startDate);
            document.getElementById("endDate").setAttribute('min', nextDay);
            // se endDate non e' ancora stata scelta, la imposto al valore minimo cosi' il calendario si apre su quella data
            if (!values.endDate) {
                values.endDate = nextDay;
            }
        }
        else {
            //console.log("start date not selected yet");
            var today = DateUtilities.date_To_yyyymmdd(new Date());
            document.getElementById("endDate").setAttribute('min', DateUtilities.getNextDay(today));
        }
    }
    */

    const setMinStartDate = () => {
        return new Date();
    }
    const setMinEndDate = () => {
        if (values.startDate) return DateUtilities.getNextDay(values.startDate);
        return DateUtilities.getNextDay(new Date());
    }

    return (
        <div className="trip-creation-page" onKeyDown={handleKeyDown} tabIndex="0">
            <div className="fill-flex2">
                <div className='top-bar'>
                    <h2>Choose the dates</h2>
                </div>
                <div className="input-and-error">
                    <div className="date">
                        <div className="date-input" id="left" >
                            <DateField id="startDate" value={startDate} setValue={(date) => {setStartDate(date); handleChange("startDate", date);}}
                            name="Start date:" minDate={setMinStartDate()}/>
                        </div>
                        <div className="date-input" id="right">
                            <DateField id="endDate" value={endDate} setValue={(date) => {setEndDate(date); handleChange("endDate", date);}} name="End date:"
                            minDate={setMinEndDate()}/>
                        </div>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
            <div className="auto-flex2">
                <button id="previous" onClick={prevStep}>Previous</button>
                <button id="next" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default SecondStep;


