
import "./ScheduleEvents.css";


export default function EventClosedTravel({travel, selectEvent}) {

    const INFO_MAX_CHARACTERS_SHOWN = 60;

    var info = travel.info;
    info = info.substring(0, INFO_MAX_CHARACTERS_SHOWN);
    if (travel.info.length > INFO_MAX_CHARACTERS_SHOWN) {
        info += "...";
    }

    return (
        <div className="event-block travel" onClick={() => {selectEvent(travel)}}>
            <div className="event-block-left">
                <div className="info-left bold big">{travel.startTime}</div>
                <i className="bi bi-airplane-engines h1"></i>
                <div className="info-left bold">{travel.place.split(",")[0]}</div>
            </div>
            <div className="event-block-right">
                <div className="travel-name event-block-title">
                    Travel to {travel.destination.split(",")[0]}
                </div>
                <div className="address spaced">
                    <i className="bi bi-geo-alt icon-with-margin"></i>{travel.address}
                </div>
                <div className="info spaced">
                    {info}
                </div>
            </div>
        </div>
    );

}