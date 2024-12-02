import React from 'react';
import TripButton from '../components/TripButton/TripButton'
import "../styles/Main.css"

function Main() {

    const colors = [
        '#FFBC70',
        '#FFF4C7',
    ]

    var upcoming_list = [
        {destination: 'Parigi', data: '22/03 - 26/03'},
        {destination: 'Londra', data: '28/09 - 2/10'},
        {destination: 'Milano', data: '28/09 - 2/10'}
    ]

    var past_list = [
        {destination: 'Parigi', data: '22/03 - 26/03'},
        {destination: 'Londra', data: '28/09 - 2/10'},
        {destination: 'Milano', data: '28/09 - 2/10'}
    ]

    return (
        <div className='page-container'>
            <div className='section-container'>
                <div className='title-text'>Upcoming trips</div>
                <div className='trips-container'>
                    {upcoming_list.map((trip, index) => (
                        <TripButton
                            destination={trip.destination}
                            data={trip.data}
                            bg_color={colors[index % colors.length]}
                        />
                    ))}
                </div>
            </div>
            <div className='section-container'>
                <div className='title-text'>Past trips</div>
                <div className='trips-container'>
                    {past_list.map((trip, index) => (
                        <TripButton
                            destination={trip.destination}
                            data={trip.data}
                            bg_color={'#E9E9E9'}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Main;