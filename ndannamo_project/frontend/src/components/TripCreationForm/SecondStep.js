import React, { useState } from 'react';
import DateUtilities from '../../utils/DateUtilities';

import TextField, { DateField, PickedField, PickField } from "../../components/Fields/Fields";

const SecondStep = ({ nextStep, prevStep, handleChange, values }) => {

    // Questi parametri devono essere gli stessi anche nel backend, dentro TripValidation.java
    const TRIP_MAX_DAYS = 31;


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
        } else if (DateUtilities.daysBetween(values.startDate, values.endDate) > TRIP_MAX_DAYS) {
            setError('The trip can be at most ' +  TRIP_MAX_DAYS + " days long");
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


    // Per start date
    const setMinStartDate = () => {
        return new Date();
    }
    /*
    const setMaxStartDate = () => {
        // se endDate e' stata scelta ed e' a piu' di TRIP_MAX_DAYS giorni da oggi
        var today = new Date();
        if (values.endDate && (DateUtilities.daysBetween(DateUtilities.date_To_yyyymmdd(today), values.endDate) > TRIP_MAX_DAYS)) {
            return DateUtilities.getNDaysBefore(values.startDate, TRIP_MAX_DAYS);
        }
        return DateUtilities.getNDaysLater(new Date(), TRIP_MAX_DAYS);
    }
    */

    // Per end date
    const setMinEndDate = () => {
        if (values.startDate) return DateUtilities.getNextDay(values.startDate);
        return DateUtilities.getNextDay(new Date());
    }
    const setMaxEndDate = () => {
        if (values.startDate) return DateUtilities.getNDaysLater(values.startDate, TRIP_MAX_DAYS);
        return DateUtilities.getNDaysLater(new Date(), TRIP_MAX_DAYS);
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
                            minDate={setMinEndDate()} maxDate={setMaxEndDate()}/>
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


