
import "./ScheduleEvents.css";


export default function ActivityEvent({activity, selectEvent}) {

    const INFO_MAX_CHARACTERS_SHOWN = 60;

    var info = activity.info;
    info = info.substring(0, INFO_MAX_CHARACTERS_SHOWN);
    if (activity.info.length > INFO_MAX_CHARACTERS_SHOWN) {
        info += "...";
    }

    return (
        <div className="event-block activity" onClick={() => {selectEvent(activity)}}>
            <div className="event-block-left">
                <div className="info-left bold big">{activity.startTime}</div>
                <i className="bi bi-sun h1"></i>
                <div className="info-left bold">{activity.place.split(",")[0]}</div>
            </div>
            <div className="event-block-right">
                <div className="activity-name  event-block-title">
                    {activity.name}
                </div>
                <div className="address spaced">
                    <i className="bi bi-geo-alt icon-with-margin"></i>{activity.address}
                </div>
                <div className="info spaced">
                    {info}
                </div>
            </div>
        </div>
    );

}