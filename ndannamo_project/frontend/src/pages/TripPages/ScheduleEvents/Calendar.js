
import DateUtilities from "../../../utils/DateUtilities";

import '../../../styles/Common.css';

export default function Calendar({dates, scrollFunction}) {

    return (
        <div id="calendar" className="flex-row align-items-center">
            {dates.map((date, index) =>
                <button key={index} onClick={() => scrollFunction(date)} className="calendar-element">  
                    <div className="calendar-element-content">
                        <div className="flex-column align-items-center date-day">
                            <h3>{DateUtilities.yyyymmdd_To_dd(date)}</h3>
                        </div>
                        <div className="flex-column align-items-center date-month">
                            <h6>{DateUtilities.yyyymmdd_To_MONTH(date, "short")}</h6>
                        </div>
                    </div>             
                </button>
            )}
        </div>
    );
}