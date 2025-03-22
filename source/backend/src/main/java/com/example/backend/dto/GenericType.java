package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Questa classe la usiamo quando vogliamo mandare un unico valore (stringa, booleano, int, quello che e')
// come RequestBody, ad esempio per mandare il nuovo nickname quando lo si cambia

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenericType<T> {
    private T value;

    public T getValue() {
        return value;
    }
}
