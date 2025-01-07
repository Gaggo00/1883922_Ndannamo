
import NightEvent from "./NightEvent";
import ActivityEvent from "./ActivityEvent";
import TravelEvent from "./TravelEvent";


export default function ScheduleDay({day, openCreateEventForm}) {

    const createActivity = (previousEventTime) => {
        openCreateEventForm();
    }
    const createTravel = (previousEventTime) => {
        openCreateEventForm();
    }
    

    return (
        <div className="day">
            <div className="day-date">{day.date}</div>
            <div className="hidden-button-parent">
                <button className="hidden-button" onClick={()=>{createActivity("08:00")}}><i className="bi bi-plus-lg h4"></i></button>
                <button className="hidden-button" onClick={()=>{createTravel("08:00")}}><i className="bi bi-airplane h4"></i></button>
            </div>
            {day.activitiesAndTravels.map((event, index) => {
                    if (event.constructor.name == "Activity") {
                        return <div key={index}> 
                            <ActivityEvent activity={event}/>
                            <div className="hidden-button-parent">
                                <button className="hidden-button" onClick={()=>{createActivity("08:00")}}><i className="bi bi-plus-lg h4"></i></button>
                                <button className="hidden-button" onClick={()=>{createTravel("08:00")}}><i className="bi bi-airplane h4"></i></button>
                            </div>
                        </div>;
                    }
                    else if (event.constructor.name == "Travel") {
                        return <div key={index}>
                            <TravelEvent travel={event}/>
                            <div className="hidden-button-parent">
                                <button className="hidden-button" onClick={()=>{createActivity("08:00")}}><i className="bi bi-plus-lg h4"></i></button>
                                <button className="hidden-button" onClick={()=>{createTravel("08:00")}}><i className="bi bi-airplane h4"></i></button>
                            </div>
                        </div>;
                    }
                })
            }
            {day.night && <NightEvent night={day.night}/>}
        </div>
    );

}