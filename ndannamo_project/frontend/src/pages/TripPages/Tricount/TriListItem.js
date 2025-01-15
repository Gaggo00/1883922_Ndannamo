import "./Tricount.css"
import { useState, useEffect, forwardRef, useImperativeHandle} from "react";

export function TCListHeader() {
    return (
        <div className="tc-header">
            <div className="tc-column tc-name h">Name</div>
            <div className="tc-column tc-expense h">Expense</div>
            <div className="tc-column tc-total h">Total</div>
            <div className="tc-column tc-date h">Date</div>
            <div className="tc-column tc-by h">Paid by</div>
        </div>
    )
}

const TCListItem = forwardRef(({userId, expenseData, onClick}, ref) => {

    const [clicked, setClicked] = useState(false);
    const [myExpense, setMyExpense] = useState(0);

    function handleClick() {
        setClicked(true);
        onClick();
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
        <div className={!clicked ? "tc-item" : "tc-item tc-item-clicked"} onClick={handleClick}>
            <div className="tc-column tc-name">{expenseData.title}</div>
            <div className="tc-column tc-expense">{myExpense}</div>
            <div className="tc-column tc-total">{expenseData.amount}</div>
            <div className="tc-column tc-date">{expenseData.date.toDateString()}</div>
            <div className="tc-column tc-by">{expenseData.paidByNickname}</div>
        </div>
    )
})

export default TCListItem
