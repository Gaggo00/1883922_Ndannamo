
import NightEvent from "./NightEvent";
import ActivityEvent from "./ActivityEvent";
import TravelEvent from "./TravelEvent";


export default function ScheduleDay({day, openCreateEventForm}) {

    const createActivity = (previousActivityTime) => {
        openCreateEventForm();
    }

    return (
        <div className="day">
            <div className="day-date">{day.date}</div>
            <div className="hidden-button-parent">
                <button className="hidden-button" onClick={()=>{createActivity("08:00")}}><i className="bi bi-plus-circle h4"></i></button>
            </div>
            {day.activitiesAndTravels.map((event, index) => {
                    if (event.constructor.name == "Activity") {
                        return <div>
                            <ActivityEvent key={index} activity={event}/>
                            <div className="hidden-button-parent">
                                <button className="hidden-button" onClick={()=>{createActivity(event.startTime)}}><i className="bi bi-plus-circle h4"></i></button>
                            </div>
                        </div>;
                    }
                    else if (event.constructor.name == "Travel") {
                        return <div>
                            <TravelEvent key={index} travel={event}/>
                            <div className="hidden-button-parent">
                                <button className="hidden-button" onClick={()=>{createActivity(event.startTime)}}><i className="bi bi-plus-circle h4"></i></button>
                            </div>
                        </div>;
                    }
                })
            }
            {day.night && <NightEvent night={day.night}/>}
        </div>
    );

}