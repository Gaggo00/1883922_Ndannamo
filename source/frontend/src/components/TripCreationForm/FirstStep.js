import React, { useState } from 'react';

const FirstStep = ({ nextStep, handleChange, values }) => {

    // Questi parametri devono essere gli stessi anche nel backend, dentro TripValidation.java
    const TITLE_MAX_LENGTH = 30;

    const [error, setError] = useState('');

    const handleNext = () => {
        if (values.title.trim() === '') {
            setError('The title is required!');
        } 
        else if (values.title.trim().length > TITLE_MAX_LENGTH) {
            setError('Title can be at most ' + TITLE_MAX_LENGTH + ' characters long!');
        }
        else {
            setError('');
            nextStep();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleNext();
        }
    };

    // Per quando scrivi qualcosa in un campo editabile
    const handleInputChange = (e) => {
        var input = e.target.value;

        // Limita numero di caratteri
        input = input.substring(0, TITLE_MAX_LENGTH);

        handleChange(e.target.name, input)
    }

    return (
        <div className="trip-creation-page">
            <div className="fill-flex2">
                <div className='top-bar'>
                    <h2>Choose a title</h2>
                </div>
                <div className="input-and-error">
                    <input
                        type="text"
                        name="title"
                        className='input-medium'
                        value={values.title}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder='Title'
                    />
                    {error && <p style={{ color: 'red'}}>{error}</p>}
                </div>
            </div>
            <div className="auto-flex2">
                <button id="previous" disabled={true}>Previous</button>
                <button id="next" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default FirstStep;
