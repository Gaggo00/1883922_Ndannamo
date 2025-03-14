import "./Tricount.css"
import { useState, useEffect, forwardRef, useImperativeHandle} from "react";


export function TCListHeader({names = []}) {
    return (
        <div className="tc-header">
            {names.map((value, key) => (
                key === 0 ?
                    <div key={key} className="tc-column tc-name h">{value}</div>
                :
                    <div key={key} className="tc-column tc-expense h">{value}</div>
            )
            )}
        </div>
    )
}

const TCListItem = forwardRef(({userId, expenseData, onClick}, ref) => {

    const [clicked, setClicked] = useState(false);
    const [myExpense, setMyExpense] = useState(0);

    function handleClick(event) {
        setClicked(true);
        onClick(event);
    }

    useEffect(() => {
        setMyExpense(getMyExpense(expenseData.amountPerUser));
    }, [expenseData.amountPerUser, userId]);


    function getMyExpense(expenses) {
        const userExpense = expenses.find(expense => expense.user === userId);
        return userExpense ? userExpense.amount : 0;
    }

    useImperativeHandle(ref, () => ({
        setClicked: (value) => setClicked(value),
    }));
    

    return (
        <div className={!clicked ? "tc-item" : "tc-item tc-item-clicked"} onClick={(event) => handleClick(event)}>
            <div className="tc-column tc-name">{expenseData.title}</div>
            <div className="tc-column tc-expense">€ {myExpense}</div>
            <div className="tc-column tc-total">€ {expenseData.amount}</div>
            <div className="tc-column tc-date">{expenseData.date.toLocaleDateString(
                'it-IT', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}</div>
            <div className="tc-column tc-by">{expenseData.paidByNickname}</div>
        </div>
    )
})

export default TCListItem
