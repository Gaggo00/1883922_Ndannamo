import React from 'react';
import TripButton from '../components/TripButton/TripButton'

function Main() {


    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <TripButton destination="Sasso" data="22/03 - 26/03" bg_color='#FFBC70'/>
            <h1>Questo é il main</h1>
        </div>
    );
}

export default Main;