package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ExpenseDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Expense;
import com.example.backend.repositories.ExpenseRepository;

@Service
public class ExpenseService {
        private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Expense not found!"));
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Expense expense) {
        expenseRepository.delete(expense);
    }

    public void deleteExpenseById(Long id) {
        Expense expense = getExpenseById(id); // Verifica che esista o lancia un errore
        expenseRepository.delete(expense);
    }

    public Expense updateExpense(Long id, ExpenseDTO expenseDto) {
        // Recupera la spesa esistente dal database
        Expense expense = getExpenseById(id);
        
        // Aggiorna i campi della spesa
        expense.setTitle(expenseDto.getTitle());
        expense.setPaidBy(expenseDto.getPaidBy());
        expense.setDate(expenseDto.getDate());
        expense.setAmount(expenseDto.getAmount());
        expense.setAmountPerUser(expenseDto.getAmountPerUser());
        // Aggiungi altri campi che desideri aggiornare
        
        // Salva la spesa aggiornata
        return expenseRepository.save(expense);
    }
}