import React from 'react';

const Confirmation = ({ prevStep, values, handleSubmit }) => {
    return (
        <div className="trip-creation-page">
            <div className="Step fill-flex2">
                <div className='top-bar'>
                    <h2>Confirmation</h2>
                </div>
                <div className="input-and-error confirmation">
                    <ul>
                        <li><b>Title:</b> {values.title}</li>
                        <li><b>Start Date:</b> {values.startDate}</li>
                        <li><b>End Date:</b> {values.endDate}</li>
                        <li><b>Destinations:</b> {values.city.join(", ")}</li>
                    </ul>
                </div>

            </div>
            {/* PULSANTI PREVIOUS E NEXT */}
            <div className="auto-flex2">
                <button id="previous" onClick={prevStep}>Previous</button>
                <button id="next" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};
            
export default Confirmation;