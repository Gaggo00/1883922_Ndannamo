import {state, useState, useEffect} from 'react'

import TextField, { DateField, PickedField, PickField } from "../../../components/Fields/Fields";

import DateUtilities from '../../../utils/DateUtilities';

import "./OvernightStayForm.css";



export default function OvernightStayForm({tripStartDate, tripEndDate, overnightStay}) {

    // campi classe OvernightStay:
    // id, startDate, endDate, startCheckInTime, endCheckInTime, startCheckOutTime, endCheckOutTime, address, contact, name


    const [name, setName] = useState(overnightStay.name);
    const [startDate, setStartDate] = useState(overnightStay.startDate);
    const [endDate, setEndDate] = useState(overnightStay.endDate);

    const getLastAvailableCheckInDate = () => {
        if (endDate != null) return DateUtilities.getPreviousDay(endDate);
        return DateUtilities.getPreviousDay(tripEndDate);
    }

    const getFirstAvailableCheckOutDate = () => {
        if (startDate != null) return DateUtilities.getNextDay(startDate);
        return DateUtilities.getNextDay(tripStartDate);
    }
    
    return (
        <div id="overnight-stay-form">
            Accomodation
            <TextField value={name} setValue={setName} name="Name"/>

            <DateField value={startDate} setValue={setStartDate} name="Check-in" minDate={tripStartDate} maxDate={getLastAvailableCheckInDate()} style={{flex: "2"}}/>

            <DateField value={endDate} setValue={setEndDate} name="Check-out" minDate={getFirstAvailableCheckOutDate()} maxDate={tripEndDate} style={{flex: "2"}}/>
        </div>
    );

}