import React from 'react';
import LateralMenu from '../components/LateralMenu/LateralMenu';
import "../styles/Main.css"
import Trip from '../models/Trip';

function Main() {

    var trips = [
        new Trip("Milano", 1725456488000, 1725629288000)
    ]

    var upcoming_list = [
        {destination: 'Parigi', data: '22/03 - 26/03'},
        {destination: 'Londra', data: '28/09 - 2/10'},
        {destination: 'Milano', data: '28/09 - 2/10'},
        {destination: 'Parma', data: '28/09 - 2/10'}
    ]

    var past_list = [
        {destination: 'Parigi', data: '22/03 - 26/03'},
        {destination: 'Londra', data: '28/09 - 2/10'},
        {destination: 'Milano', data: '28/09 - 2/10'}
    ]

    return (
        <LateralMenu trips_list={trips}></LateralMenu>
    );
}

export default Main;