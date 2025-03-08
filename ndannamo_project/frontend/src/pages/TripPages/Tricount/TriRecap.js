import React, { useEffect, useState } from 'react';
import { TCListHeader } from './TriListItem';

const TCListRecapItem = ({userId, expenseData}) => {
    
    const [amount, setAmount] = useState([]);

    useEffect(() => {
        setAmount(findAmount(expenseData));
    }, [expenseData])

    function findAmount(expense) {

        if (expense && expense.amountPerUser) {
            expense.amountPerUser.map((e) => {
                if (e.user === userId) return e.amount;
            })
        }

        return 0;
    }

    return (
        <div className={"tc-item"}>
            <div className="tc-column tc-name">{expenseData.title}</div>
            <div className="tc-column tc-expense">{amount}</div>
            <div className="tc-column tc-date">{expenseData.date.toDateString()}</div>
        </div>
    )
}

const TCUserRecap = ({user, userNickname, expenses}) => {

    useEffect(() => {

    }, [user, userNickname, expenses]);


    function handleItemSelection() {
        console.log("L'oggetto è stato cliccato");
    }

    return (
        <div className='tc-form'>
            <div>{userNickname}</div>
            <div className="tc-list">
                <TCListHeader names={["Name", "Expense", "Date"]}/>
                {expenses.map((item, index) => (
                    <TCListRecapItem
                        key={index}
                        userId={user}
                        expenseData={item}
                        onClick={() => handleItemSelection(item)}
                    />
                ))}
            </div>
        </div>
    )
}

export default TCUserRecap
