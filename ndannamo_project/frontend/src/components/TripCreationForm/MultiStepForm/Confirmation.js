import React from 'react';

const Confirmation = ({ prevStep, values, handleSubmit }) => {
    return (
        <div className="trip-creation-page">
            <div className="Step">
                <h2>Confirmation</h2>
                <ul>
                    <li><b>Title:</b> {values.title}</li>
                    <li><b>Start Date:</b> {values.startDate}</li>
                    <li><b>End Date:</b> {values.endDate}</li>
                    <li><b>Destinations:</b> {values.city.join(", ")}</li>
                </ul>
                <div className="button-div">
                    <button id="previous" onClick={prevStep}>Previous</button>
                    <button id="next" onClick={handleSubmit}>Submit</button>
                </div>
                </div>
            </div>
            );
            };

            export default Confirmation;