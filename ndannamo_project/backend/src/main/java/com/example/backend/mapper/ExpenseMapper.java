package com.example.backend.mapper;

import com.example.backend.dto.AmountUserDTO;
import com.example.backend.dto.ExpenseDTO;
import com.example.backend.model.Expense;
import com.example.backend.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;


@Mapper(componentModel = "spring")
public interface ExpenseMapper {

    // Da Expense a ExpenseDTO
    @Mapping(target = "tripId", source = "trip.id")         // Mappa solo l'ID della trip
    //@Mapping(target = "paidById", source = "paidBy.id")     // Mappa solo l'ID dell'user che ha pagato
    @Mapping(target = "amountPerUser", source = "amountPerUser", qualifiedByName = "userMapToAmountUserDTO")
    ExpenseDTO toDTO(Expense expense);

    // Da ExpenseDTO a Expense
    @Mapping(target = "trip.id", source = "tripId")             // Mappa l'ID della trip verso l'entità Trip
    //@Mapping(target = "paidBy.id", source = "paidById")             // Mappa l'ID dell'utente pagante verso l'entità User
    @Mapping(target = "amountPerUser", ignore = true)            // Ignora
    Expense toEntity(ExpenseDTO expenseDTO);


    
    // questa serviva quando amountPerUser era una Map<User,Double> dentro Expense
    @Named("userMapToAmountUserDTO") 
    public static List<AmountUserDTO> userListToStringList(Map<Long, Double> amountUser) { 
        
        List<AmountUserDTO> res = new ArrayList<AmountUserDTO>();
        
        // Converto gli user in AmountUserDTO
        amountUser.forEach( (userId, amount) -> {
            res.add(new AmountUserDTO(userId, amount));
        });

        return res;
    }
    
}

