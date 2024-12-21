import React, { useState } from 'react';

const ThirdStep = ({ nextStep, prevStep, handleChange, values }) => {
    const [error, setError] = useState('');
    const [newCity, setNewCity] = useState('');

    const addCity = () => {
        if (newCity.trim() === '') {
            setError('City name cannot be empty!');
            return;
        }
        if (values.city.includes(newCity.trim())) {
            setError('City already added!');
            return;
        }
        setError('');
        const updatedCities = [...values.city, newCity];
        handleChange({ target: { name: 'city', value: updatedCities } });
        setNewCity('');
    };

    const removeCity = (index) => {
        const updatedCities = values.city.filter((_, i) => i !== index);
        handleChange({ target: { name: 'city', value: updatedCities } });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newCity.trim()) {
                addCity();
            } else {
                nextStep();
            }
        }
    };

    return (
        <div className="trip-creation-page">
            <div className="Step">
                <h2>Where are you going?</h2>
                <div className="city">
                    <label>
                        <input
                            type="text"
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </label>
                    <button onClick={addCity}>+</button>
                </div>
                {error && <p style={{color: 'red'}}>{error}</p>}
                {(values.city).length !== 0 && <h6>Selected Cities:</h6>}
                {(values.city).length !== 0 && <div className="list-city">
                    <ul>
                        {values.city.map((city, index) => (
                            <li key={index}>
                                {city}
                                <button onClick={() => removeCity(index)}>X</button>
                            </li>
                        ))}
                    </ul>
                </div>}
                <div className="button-div">
                    <button id="previous" onClick={prevStep}>Previous</button>
                    <button id="next" onClick={nextStep}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default ThirdStep;
