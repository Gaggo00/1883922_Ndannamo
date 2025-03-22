import React from 'react';
import "../styles/TripPreview.css";
import DateUtilities from '../utils/DateUtilities';


export default function TripSideBarPreview({trip, reloadProfile}) {

    const MAX_ROW_CHARACTERS = 29;

    const startDate = DateUtilities.yyyymmdd_To_ddmmyy(trip.startDate, "-", "/");
    const endDate = DateUtilities.yyyymmdd_To_ddmmyy(trip.endDate, "-", "/");

    var locationString = "";
    if (trip.locations.length > 0) {

        locationString = trip.locations[0];
        if (locationString.length > MAX_ROW_CHARACTERS) {
            locationString = locationString.substring(0, MAX_ROW_CHARACTERS-3) + "...";
        }
        else if (trip.locations.length > 1 && (locationString.length <= MAX_ROW_CHARACTERS-4)) {
            locationString += ", ...";
        }
    }

    return (
        <div className="trip-item">
            <div id="title">{trip.title}</div>
            <div id="date"><i className="bi bi-calendar3 icon-with-margin"></i>{startDate} - {endDate}</div>
            <div id="location"><i className="bi bi-geo-alt icon-with-margin"></i>{locationString}</div>
        </div>
    );
}

