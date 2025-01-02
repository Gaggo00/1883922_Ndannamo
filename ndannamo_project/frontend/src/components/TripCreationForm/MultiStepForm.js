import React, { useState } from 'react';
import Step1 from './FirstStep';
import Step2 from './SecondStep';
import Step3 from './ThirdStep';
import Confirmation from './Confirmation';
import Success from './Success';
import './TripCreation.css';
import TripService from "../../services/TripService";
import {useNavigate} from "react-router-dom";

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        endDate: '',
        city: []
    });

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            if (!token) {
                navigate("/login");  // Redirect the user to the login page
                return;
            }

            const formattedStartDate = formData.startDate.split('T')[0];
            const formattedEndDate = formData.endDate.split('T')[0];

            const response = await TripService.create(
                token,
                formData.title,
                formData.city,
                formattedStartDate,
                formattedEndDate
            );

            if (response) {
                nextStep();
            }
        } catch (error) {
            console.log(error);
        }
    };


    // Funzione per rendere i pallini di avanzamento dinamici
    const renderProgressDots = () => {
        const dots = [1, 2, 3]; // 3 passi
        return (
            <div className="header-box">
            <div className="progress-bar">
                {dots.map((dot) => (
                    <span
                        key={dot}
                        className={`dot ${step > dot ? 'completed' : ''} ${step === dot ? 'active' : ''}`}
                    ></span>
                ))}
            </div>
            {step < 4 && <p>STEP {step}</p>}{step >= 4 && <p>DONE!</p>}
            </div>
        );
    };

    return (
        <div className="multi-step-form">
            <div className="trip-creation-page-external">
                <div className="auto-flex1">
            {renderProgressDots()}
                </div>
            {/* Fasi del form */}
                <div className="fill-flex1">
            {step === 1 && <Step1 nextStep={nextStep} handleChange={handleChange} values={formData} />}
            {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} />}
            {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={formData} />}
            {step === 4 && <Confirmation prevStep={prevStep} values={formData} handleSubmit={handleSubmit} />}
            {step === 5 && <Success />}
                </div>
            </div>
        </div>
    );
};

export default MultiStepForm;
