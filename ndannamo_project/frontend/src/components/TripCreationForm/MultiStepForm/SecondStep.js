import React, { useState } from 'react';

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

    return (
        <div className="trip-creation-page" onKeyDown={handleKeyDown} tabIndex="0">
            <div className="Step">
                <h2>Pick your date!</h2>
                <div className="date">
                    <div className="date-input" >
                        <label id="left">
                            Start date:
                            <input
                                type="date"
                                name="startDate"
                                value={values.startDate}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="date-input" >
                        <label id="right">
                            End Date:
                            <input
                                type="date"
                                name="endDate"
                                value={values.endDate}
                                onChange={handleChange}
                            />
                        </label>

                    </div>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="button-div">
                    <button id="previous" onClick={prevStep}>Previous</button>
                    <button id="next" onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default SecondStep;
