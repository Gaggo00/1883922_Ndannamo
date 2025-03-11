import {state, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

import TextField, { DateField, PickedField, PickField } from "../../../components/Fields/Fields";

import ScheduleService from '../../../services/ScheduleService';
import Loading from '../../../components/Loading';

import DateUtilities from '../../../utils/DateUtilities';

import "./OvernightStayForm.css";
import '../../../styles/Common.css';


export default function OvernightStayForm({tripId, tripStartDate, tripEndDate, overnightStay, closeModal, reloadSchedule, editing, nightId}) {

    const navigate = useNavigate();

    const initializeNullField = (val) => {
        if (val != null) return val;
        return "";
    }

    // campi classe OvernightStay:
    // id, startDate, endDate, startCheckInTime, endCheckInTime, startCheckOutTime, endCheckOutTime, address, contact, name

    const [name, setName] = useState(overnightStay.name);
    const [startDate, setStartDate] = useState(overnightStay.startDate);
    const [endDate, setEndDate] = useState(overnightStay.endDate);

    const [startCheckInTime, setStartCheckInTime] = useState(initializeNullField(overnightStay.startCheckInTime));
    const [endCheckInTime, setEndCheckInTime] = useState(initializeNullField(overnightStay.endCheckInTime));

    const [startCheckOutTime, setStartCheckOutTime] = useState(initializeNullField(overnightStay.startCheckOutTime));
    const [endCheckOutTime, setEndCheckOutTime] = useState(initializeNullField(overnightStay.endCheckOutTime));

    const [address, setAddress] = useState(overnightStay.address);
    const [contact, setContact] = useState(overnightStay.contact);


    // Per i messaggi di errore (solo per i campi importanti)
    const [errorName, setErrorName] = useState('');
    const [errorStartDate, setErrorStartDate] = useState('');
    const [errorEndDate, setErrorEndDate] = useState('');

    // Per mostrare la schermata di loading
    const [loading, setLoading] = useState(false);


    const getLastAvailableCheckInDate = () => {
        if (endDate != null) return DateUtilities.getPreviousDay(endDate);
        return DateUtilities.getPreviousDay(tripEndDate);
    }

    const getFirstAvailableCheckOutDate = () => {
        if (startDate != null) return DateUtilities.getNextDay(startDate);
        return DateUtilities.getNextDay(tripStartDate);
    }
    
    // per debug
    const printAll = () => {
        const value = {name, startDate, endDate, startCheckInTime, endCheckInTime, startCheckOutTime, endCheckOutTime, address, contact};
        console.log(value);
    }


    const createAccomodation = async () => {
        // verifica se i campi sono corretti
        var fieldsOk = true;
        if (name.trim() === '') {
            setErrorName('A name is required!');
            fieldsOk = false;
        }
        if (startDate == null) {
            setErrorStartDate("Check-in date is required!");
            fieldsOk = false;
        }
        if (endDate == null) {
            setErrorEndDate("Check-out date is required!");
            fieldsOk = false;
        }
        
        if (fieldsOk) {

            var _startCheckInTime = startCheckInTime ? startCheckInTime : null;
            var _endCheckInTime = endCheckInTime ? endCheckInTime : null;
            var _startCheckOutTime = startCheckOutTime ? startCheckOutTime : null;
            var _endCheckOutTime = endCheckOutTime ? endCheckOutTime : null;
    
            // manda richiesta al server
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate("/login");
                }
        
                setLoading(true);

                var response;

                if (editing) {
                    // modifica overnight stay
                    response = await ScheduleService.editOvernightStay(token, tripId, overnightStay.id, name, startDate, endDate, _startCheckInTime,
                        _endCheckInTime, _startCheckOutTime, _endCheckOutTime, address, contact);
                }
                else {
                    // crea overnight stay
                    response = await ScheduleService.createOvernightStay(token, tripId, name, startDate, endDate, _startCheckInTime,
                        _endCheckInTime, _startCheckOutTime, _endCheckOutTime, address, contact);
                }

                if (response) {
                    
                    // aggiorna in locale
                    // TODO

                    // ricarica la schedule a sinistra
                    reloadSchedule(nightId, false, true);
                }
                else {
                    console.error('Invalid response data');
                    alert("Server error");
                }
            } catch (error) {
                console.error('Error creating accomodation:', error);
                alert("Error creating accomodation: " + error.message);
            }

            setLoading(false);
            closeModal();
        }
    }


    return (
        <div> 
            {!loading && <div id="overnight-stay-form" className='flex-column'>
                <h2>Accomodation</h2>
                <div className='form-content'>
                    <div className='form-row'>
                        <TextField value={name} setValue={(name) => {setName(name); setErrorName('')}} name="Name"/>
                        {errorName && <p style={{ color: 'red'}}>{errorName}</p>}
                    </div>

                    <div className='form-row flex-row'>
                        <div className='flex-column'>
                            <DateField value={startDate} setValue={(date) => {setStartDate(date); setErrorStartDate('')}} name="Check-in date" minDate={tripStartDate}
                            maxDate={getLastAvailableCheckInDate()} style={{flex: "2"}}/>
                            {errorStartDate && <p style={{ color: 'red'}}>{errorStartDate}</p>}
                        </div>
                    
                        <div className='flex-column'>
                            <DateField value={endDate} setValue={(date) => {setEndDate(date); setErrorEndDate('')}} name="Check-out date"
                            minDate={getFirstAvailableCheckOutDate()} maxDate={tripEndDate} style={{flex: "2"}}/>
                            {errorEndDate && <p style={{ color: 'red'}}>{errorEndDate}</p>}
                        </div>
                    </div>

                    <h6>Optional fields</h6>

                    <div className='flex-row'>
                        <div className='flex-column'>
                            <div className='field-title'>Check-in time:</div>
                            <div className='flex-row'>
                                From
                                <input type="time" 
                                    className="value edit-time-input"
                                    value={startCheckInTime}
                                    onChange={(e) => {setStartCheckInTime(e.target.value)}}/>
                                To
                                <input type="time" 
                                    className="value edit-time-input"
                                    value={endCheckInTime}
                                    onChange={(e) => {setEndCheckInTime(e.target.value)}}/>
                            </div>
                        </div>
                        
                        <div className='flex-column'>
                            <div className='field-title'>Check-out time:</div>
                            <div className='flex-row'>
                                From
                                <input type="time" 
                                    className="value edit-time-input"
                                    value={startCheckOutTime}
                                    onChange={(e) => {setStartCheckOutTime(e.target.value)}}/>
                                To
                                <input type="time" 
                                    className="value edit-time-input"
                                    value={endCheckOutTime}
                                    onChange={(e) => {setEndCheckOutTime(e.target.value)}}/>
                            </div>
                        </div>
                    </div>


                    <div className='form-row'>
                        <TextField value={address} setValue={setAddress} name="Address"/>
                    </div>

                    <div className='form-row'>
                        <TextField value={contact} setValue={setContact} name="Contacts"/>
                    </div>

                    <div className='form-row'>
                        {editing && <button className='custom-button red-button'>Delete</button>}
                        <button className='custom-button' onClick={createAccomodation}>{editing ? ("Save") : ("Create")}</button>
                    </div>
                </div>
            </div>}
            {loading && <div id="overnight-stay-form" className='flex-column'>
                {editing ?
                    (<Loading message={"Saving accomodation..."}/>)
                    :
                    (<Loading message={"Creating accomodation..."}/>)
                }
            </div>}
        </div>
        
    );

}