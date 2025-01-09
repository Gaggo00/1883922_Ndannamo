import "./Tricount.css"
import { useState, forwardRef, useImperativeHandle} from "react";

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

const TCListItem = forwardRef(({name, expense, total, date, by, onClick}, ref) => {

    const [clicked, setClicked] = useState(false);

    function handleClick() {
        setClicked(true);
        onClick();
    }


    useImperativeHandle(ref, () => ({
        setClicked: (value) => setClicked(value),
    }));
    

    return (
        <div className={!clicked ? "tc-item" : "tc-item tc-item-clicked"} onClick={handleClick}>
            <div className="tc-column tc-name">{name}</div>
            <div className="tc-column tc-expense">{expense}</div>
            <div className="tc-column tc-total">{total}</div>
            <div className="tc-column tc-date">{date}</div>
            <div className="tc-column tc-by">{by}</div>
        </div>
    )
})

export default TCListItem
