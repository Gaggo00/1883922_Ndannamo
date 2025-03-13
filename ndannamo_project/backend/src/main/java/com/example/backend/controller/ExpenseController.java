package com.example.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ExpenseDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Expense;
import com.example.backend.service.ExpenseService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/expense")
public class ExpenseController {
    
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveExpense(@RequestBody ExpenseDTO expenseDto) {
        //Expense savedExpense = expenseService.saveExpense(expenseDto);
        //return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
        return ResponseEntity.ok("Spesa non salvata perché ho commentato il codice dentro ExpenseController (- Anna)");
    }

}
