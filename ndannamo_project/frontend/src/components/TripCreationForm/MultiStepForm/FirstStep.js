import React, { useState } from 'react';

const FirstStep = ({ nextStep, handleChange, values }) => {
    const [error, setError] = useState('');

    const handleNext = () => {
        if (values.title.trim() === '') {
            setError('The title is required!');
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
        <div className="trip-creation-page">
            <div className="fill-flex2">
                <h2>Choose a Title</h2>
                <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            <div className="auto-flex2">
                <button id="next" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default FirstStep;
