package com.example.backend.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Questa classe la usiamo quando vogliamo mandare una lista di valori (stringhe, booleani, ...)
// come RequestBody, ad esempio per mandare una nuova lista di locations

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenericList<T> {
    private List<T> value = new ArrayList<T>();

    public List<T> getValue() {
        return value;
    }
}
