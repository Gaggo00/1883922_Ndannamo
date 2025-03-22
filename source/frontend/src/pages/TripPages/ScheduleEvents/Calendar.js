import { useState } from "react";
import DateUtilities from "../../../utils/DateUtilities";
import "../../../styles/Common.css";

export default function Calendar({ dates, scrollFunction }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const visibleCount = 7; // Sempre 7 elementi visibili (3 prima, selezionato, 3 dopo)

    const handleSelect = (index) => {
        setSelectedIndex(index);
        scrollFunction(dates[index]);
    };

    // Calcola gli indici della finestra visibile
    let startIndex, endIndex;
    if (selectedIndex < 3) {
        startIndex = 0;
        endIndex = Math.min(visibleCount, dates.length);
    } else if (selectedIndex > dates.length - 4) {
        startIndex = Math.max(dates.length - visibleCount, 0);
        endIndex = dates.length;
    } else {
        startIndex = selectedIndex - 3;
        endIndex = selectedIndex + 4;
    }

    const visibleDates = dates.slice(startIndex, endIndex);

    return (
        <div id="calendar" className="flex-row align-items-center">
            {visibleDates.map((date, i) => {
                const actualIndex = startIndex + i; // Indice nel dataset originale
                return (
                    <button
                        key={actualIndex}
                        onClick={() => handleSelect(actualIndex)}
                        className={`calendar-element ${actualIndex === selectedIndex ? "selected" : ""}`}
                    >
                        <div className="calendar-element-content">
                            {selectedIndex === actualIndex && (
                                <div className="flex-column align-items-center date-month">
                                    <h6>{DateUtilities.yyyymmdd_To_MONTH(date, "long")}</h6>
                                </div>
                            )}
                            <div className="flex-column align-items-center date-day">
                                <p>{DateUtilities.yyyymmdd_To_dd(date)}</p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
