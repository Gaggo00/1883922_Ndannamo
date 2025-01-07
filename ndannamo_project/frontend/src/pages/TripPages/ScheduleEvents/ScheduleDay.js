
import NightEvent from "./NightEvent";
import ActivityEvent from "./ActivityEvent";
import TravelEvent from "./TravelEvent";


export default function ScheduleDay({day}) {

    return (
        <div className="day">
            <div className="day-date">{day.date}</div>
            {day.activitiesAndTravels.map((event, index) => {   
                    if (event.constructor.name == "Activity") {
                        return <ActivityEvent key={index} activity={event}></ActivityEvent>;
                    }
                    else if (event.constructor.name == "Travel") {
                        return <TravelEvent key={index} travel={event}></TravelEvent>;
                    }
                })
            }
            {day.night && <NightEvent night={day.night}></NightEvent>}
        </div>
    );

}