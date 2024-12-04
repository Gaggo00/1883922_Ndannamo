import {React, useState} from 'react';
import TripButton from '../TripButton/TripButton';
import './TripsList.css'

function TripsList({trip_list = [], title, colors = ['#eb9b17', '#eee8da'], max_size = 3}) {

    const [showUpcoming, setShowUpcoming] = useState(trip_list.length > max_size);

    const toggleVisibility = (boolean) => {
        setShowUpcoming(!boolean);
    };

    return (
        <div className='section-container'>
            <div className='title-text'>{title}</div>
            <div className='trips-container'>
                {trip_list.map((trip, index) => {
                    if (index > max_size - 1 && showUpcoming) return null;
                    return (
                        <TripButton
                            destination={trip.getDestination()}
                            data={trip.getDateStr(1)}
                            bg_color={colors[index % colors.length]}
                            key={index}
                        />
                    )
                })}
            </div>
            <div className='button-container'>
                {showUpcoming && <button className='show-more-button' onClick={() => toggleVisibility(showUpcoming)}>
                    Show More
                </button>}
            </div>
        </div>
    );
}

export default TripsList;