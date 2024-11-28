import React from 'react';
import './TripButton.css'
import { BsChevronRight } from 'react-icons/bs';

function TripButton({destination, data, bg_color}) {
    console.log(bg_color)
    return (
        <div className='mainContainer' style={{backgroundColor: bg_color}}>
            <div className='secondaryContainer' style={{flex: '4'}}>
                <div className='destination'>{destination}</div>
                <div className='data'>{data}</div>
            </div>
            <div style={{height: '100%', alignContent: 'center', flex: '1'}}>
                <BsChevronRight style={{height: '30%', width: '100%'}}/>
            </div>
        </div>
    );
}

export default TripButton;
