package com.example.backend.utils;

import java.time.LocalDate;

public class DateUtilities {
    

    public static long daysBetween(LocalDate date1, LocalDate date2) {
        if (date2.isAfter(date1)) {
            return date1.until(date2, java.time.temporal.ChronoUnit.DAYS);
        }
        return date2.until(date1, java.time.temporal.ChronoUnit.DAYS);
    }
}
