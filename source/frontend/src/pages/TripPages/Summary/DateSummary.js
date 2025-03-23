import "./TripSummary.css";
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import UndoConfirm from "../../../common/UndoConfirm";
import ConfirmDelete from "../../../common/ConfirmDelete";

import DateUtilities from "../../../utils/DateUtilities";

import TripService from "../../../services/TripService";

import calendar_icon from "../../../static/svg/icons/calendar_icon.svg";
import calendar from "../../../static/calendar.png";
import arrow_down from "../../../static/svg/icons/arrow-down2.svg";
import edit_icon from "../../../static/svg/icons/edit_icon.svg";



export default function DateSummary({tripInfo, profileInfo}) {

    const [changeDate, setChangeDate] = useState(false);
    const [newEndDate, setNewEndDate] = useState(null);
    const [newStartDate, setNewStartDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();


    // Per il pop up di conferma
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOverlayClick = (e) => {
        // Verifica se l'utente ha cliccato sull'overlay e non sul contenuto del modal
        if (e.target.className === "modal-overlay") {
            setIsModalOpen(false);
        }
    };

    const checkWhetherToOpenModal = () => {
        // Check if dates are valid before proceeding
        if (errorMessage) {
            return;
        }

        const oldLength = DateUtilities.daysBetween(tripInfo.startDate, tripInfo.endDate);
        const newLength = DateUtilities.daysBetween(newStartDate, newEndDate);
        if (newLength < oldLength) {
            setIsModalOpen(true);
        }
        else {
            handleChangeDates();
        }
    }

    // Function to check if a date is in the past
    const isDateInPast = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to beginning of day for accurate comparison
        const date = new Date(dateString);
        return date < today;
    }

    // Function to check if original dates are in the past
    const areOriginalDatesInPast = () => {
        const startDateInPast = isDateInPast(tripInfo.startDate);
        const endDateInPast = isDateInPast(tripInfo.endDate);
        return { startDateInPast, endDateInPast };
    }

    const handleEditDates = () => {
        const { startDateInPast, endDateInPast } = areOriginalDatesInPast();

        // If both dates are in the past, don't allow editing
        if (startDateInPast && endDateInPast) {
            setErrorMessage("This trip is in the past and cannot be modified.");
            return;
        }

        setNewStartDate(tripInfo.startDate);
        setNewEndDate(tripInfo.endDate);
        setErrorMessage(""); // Clear any previous error messages
        setChangeDate(true);
    }

    const handleChangeDates = async () => {
        if (newEndDate === tripInfo.endDate && newStartDate === tripInfo.startDate) {
            setChangeDate(false);
        } else {
            // Check if either date is in the past
            if (isDateInPast(newStartDate) || isDateInPast(newEndDate)) {
                setErrorMessage("Cannot set dates in the past.");
                return;
            }

            if (newEndDate > newStartDate) {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        navigate("/login");
                    }
                    const response = await TripService.updateDates(token, tripInfo.id, newStartDate, newEndDate);

                    if (response) {
                        setIsModalOpen(false);
                        setChangeDate(false);
                        tripInfo.startDate = newStartDate;
                        tripInfo.endDate = newEndDate;
                        navigate(`/trips/${tripInfo.id}/summary`, { state: { trip: tripInfo, profile: profileInfo } })
                    } else {
                        navigate("/error");
                        console.error('Invalid response data');
                    }
                } catch (error) {
                    navigate("/error");
                    console.error('Error changing dates:', error);
                }
            } else {
                setErrorMessage("End date must be after start date.");
            }
        }
    }

    const handleStartDateChange = (e) => {
        const newDate = e.target.value;
        setNewStartDate(newDate);

        // Validation
        if (isDateInPast(newDate)) {
            setErrorMessage("Cannot set a start date in the past.");
        } else if (newDate > newEndDate) {
            setErrorMessage("Start date cannot be after end date.");
        } else {
            setErrorMessage("");
        }
    };

    const handleEndDateChange = (e) => {
        const newDate = e.target.value;
        setNewEndDate(newDate);

        // Validation
        if (isDateInPast(newDate)) {
            setErrorMessage("Cannot set an end date in the past.");
        } else if (newStartDate > newDate) {
            setErrorMessage("End date cannot be before start date.");
        } else {
            setErrorMessage("");
        }
    };

    function undoChangeDates() {
        setChangeDate(false);
        setErrorMessage("");
    }

    // Calculate minimum allowed dates for inputs
    const getTodayString = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    // Determine if edit button should be shown (hide if trip is entirely in the past)
    const { startDateInPast, endDateInPast } = areOriginalDatesInPast();
    const showEditButton = tripInfo.creator && !(startDateInPast && endDateInPast);

    return (
        <div className="mini-section" id="mini2">
            <div className="header-section" id="section3">
                <div className="icon-label">
                    <img src={calendar_icon} alt="calendar_icon" />
                    <p>Dates</p>
                </div>
                {!changeDate && showEditButton &&
                    <img id="edit" className="editable" onClick={handleEditDates} src={edit_icon} alt="edit_icon" />}
                {changeDate && <UndoConfirm
                    onConfirm={checkWhetherToOpenModal}
                    onUndo={undoChangeDates} />}
            </div>
            <div className="internal-section">
                <img src={calendar} alt="globe" />
                <div className="dates">
                    {!changeDate && <p className="date">{DateUtilities.yyyymmdd_To_ddMONTHyyyy(tripInfo.startDate)}</p>}
                    {changeDate && <input
                        className="date"
                        type="date"
                        name="startDate"
                        onChange={handleStartDateChange}
                        value={newStartDate}
                        min={startDateInPast ? tripInfo.startDate : getTodayString()}
                    ></input>}
                    <img src={arrow_down} alt="arrow_down" />
                    {!changeDate && <p className="date">{DateUtilities.yyyymmdd_To_ddMONTHyyyy(tripInfo.endDate)}</p>}
                    {changeDate && <input
                        className="date"
                        type="date"
                        name="endDate"
                        value={newEndDate}
                        onChange={handleEndDateChange}
                        min={Math.max(newStartDate, getTodayString())}
                    ></input>}
                </div>
            </div>
            {/* Messaggio di errore spostato qui, sotto le date */}
            {errorMessage && <div className="error-container">
                <p className="error-message">{errorMessage}</p>
            </div>}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="trip-box">
                        <ConfirmDelete
                            message={"With these dates, the trip will be shorter. Any events outside the range will be deleted, are you sure?"}
                            onConfirm={handleChangeDates}
                            onClose={()=>{setIsModalOpen(false);}}/>
                    </div>
                </div>
            )}
        </div>
    );
}