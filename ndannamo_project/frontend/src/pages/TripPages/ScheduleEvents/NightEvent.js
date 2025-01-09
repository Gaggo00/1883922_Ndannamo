
import "./ScheduleEvents.css";


export default function NightEvent({night, selectEvent}) {

    return (
        <div className="event-block night" onClick={() => {selectEvent(night)}}>
            <div className="event-block-left">                
                <div className="info-left bold big">Night</div>
                <i className="bi bi-moon-stars h1"></i>
                <div className="info-left bold">{night.place.split(",")[0]}</div>
            </div>
            <div className="event-block-right">
                <div className="night-name event-block-title">
                    Stay at {night.overnightStay && night.overnightStay.name}{!night.overnightStay && "?"}
                </div>
                <div className="address spaced">
                    <i className="bi bi-geo-alt icon-with-margin"></i>{night.overnightStay && night.overnightStay.address}{!night.overnightStay && "-"}
                </div>
                <div className="contact spaced">
                <i className="bi bi-telephone icon-with-margin"></i>{night.overnightStay && night.overnightStay.contact}{!night.overnightStay && "-"}
                </div>

            </div>
        </div>
    );

}