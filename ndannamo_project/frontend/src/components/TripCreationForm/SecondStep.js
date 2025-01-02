import React, { useState } from 'react';
import DateUtilities from '../../utils/DateUtilities';


const SecondStep = ({ nextStep, prevStep, handleChange, values }) => {
    const [error, setError] = useState('');

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

    return (
        <div className="trip-creation-page" onKeyDown={handleKeyDown} tabIndex="0">
            <div className="fill-flex2">
                <div className='top-bar'>
                    <h2>Choose the dates</h2>
                </div>
                <div className="input-and-error">
                    <div className="date">
                        <div className="date-input" >
                            <label id="left">
                                <div className='label-text'>Start date:</div>
                                <input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    value={values.startDate}
                                    onClick={setMinStartDate}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div className="date-input" >
                            <label id="right">
                            <div className='label-text'>End date:</div>
                                <input
                                    type="date"
                                    name="endDate"
                                    id="endDate"
                                    value={values.endDate}
                                    onClick={setMinEndDate}
                                    onChange={handleChange}
                                />
                            </label>

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


