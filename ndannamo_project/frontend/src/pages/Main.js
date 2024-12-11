import React from 'react';
import LateralMenu from '../components/LateralMenu/LateralMenu';
import TripCreationForm from '../components/TripCreationForm/TripCreationForm';
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

    return (
        <div style={{width: "100%", heigth: "100%", display: "flex", flexDirection: "row"}}>
            <LateralMenu trips_list={trips}></LateralMenu>
            <div style={{position: "absolute", left: "250px", heigth: "100px", width: "calc(100% - 250px)"}}>
                <TripCreationForm/>
            </div>
        </div>
    );
}

export default Main;