import React from 'react';
import './TripButton.css'
import { BsChevronRight } from 'react-icons/bs';

function TripButton({destination, data, bg_color}) {
    console.log(bg_color)
    return (
        <div className='mainContainer' style={{backgroundColor: bg_color}}>
            <div className='secondaryContainer'>
                <div className='destination'>{destination}</div>
                <div className='data'>{data}</div>
            </div>
            <div style={{alignContent: 'center', flex: '0.3'}}>
                <BsChevronRight/>
            </div>
        </div>
    );
}

export default TripButton;
