import React from 'react';
import './TripButton.css'
import { BsChevronRight } from 'react-icons/bs';

function TripButton({destination, data, bg_color}) {
    return (
        <div className='mainContainer' style={{backgroundColor: bg_color}}>
            <div className='secondaryContainer'>
                <div className='destination'>{destination}</div>
                <div className='data'>{data}</div>
            </div>
            <BsChevronRight style={{height: '100%'}}/>
        </div>
    );
}

export default TripButton;
