import {React, useState} from 'react';
import LateralMenu from '../components/LateralMenu/LateralMenu';
import Form from 'react-bootstrap/Form';
import TripCreationForm from '../components/TripCreationForm/TripCreationForm';
import {TextField, DateField} from '../components/Fields/Fields';
import "../styles/Main.css"
import Trip from '../models/Trip';
import TripService from '../services/TripService';

function Main() {

    var trips = [
        new Trip(1, "Parigi", 1739194088000, 1739294088000),
        new Trip(1, "Bolo", 1739194088000, 1739294088000),
        new Trip(1, "Monti", 1739194088000, 1739294088000),
        new Trip(1, "Sali", 1739194088000, 1739294088000),
        new Trip(2, "Londra", 1736456488000, 1737629288000),
        new Trip(3, "Roma", 1756456488000, 1762629288000),
        new Trip(4, "Amsterdam", 1773456488000, 1778629288000),
        new Trip(5, "Praga", 1725456488000, 1725629288000),
        new Trip(6, "Stoccolma", 1725456488000, 1725629288000),
        new Trip(7, "Praga", 1725456488000, 1725629288000),
        new Trip(8, "Milano", 1725456488000, 1725629288000),
        new Trip(9, "Napoli", 1725456488000, 1725629288000),
    ]

    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    var lastPossibleDate = new Date();
    lastPossibleDate.setDate(lastPossibleDate.getDate() + 720);

    function changeStartDate(new_date) {
        if (new_date > endDate)
            setEndDate(new_date);
        setStartDate(new_date);
    }

    return (
        <div style={{width: "100%", heigth: "100%", display: "flex", flexDirection: "row"}}>
            <TripCreationForm/>
        </div>
    );
}

export default Main;