package com.example.backend.controller;

import com.example.backend.dto.ExpenseDTO;
import com.example.backend.service.ExpenseService;

RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/expense")
public class ExpenseController {
    
    private final ExpenseService expenseService;

    @PostMapping("/save")
    public ResponseEntity<Expense> saveExpense(@RequestBody ExpenseDTO expenseDto) {
        Expense savedExpense = expenseService.saveExpense(expenseDto);
        return new ResponseEntity<>(savedExpense, HttpStatus.CREATED);
    }
}
