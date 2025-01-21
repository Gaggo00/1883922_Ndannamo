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
                <div className='top-bar'>
                    <h2>Choose a title</h2>
                </div>
                <div className="input-and-error">
                    <input
                        type="text"
                        name="title"
                        className='input-medium'
                        value={values.title}
                        onChange={(e) => {handleChange(e.target.name, e.target.value)}}
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
