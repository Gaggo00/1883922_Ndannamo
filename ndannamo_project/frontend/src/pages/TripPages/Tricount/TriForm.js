import TextField, { DateField, PickedField, PickField } from "../../../components/Fields/Fields";
import "./Tricount.css"
import {state, useState, useEffect} from 'react'
import { BsXLg } from "react-icons/bs";
import { GoPencil } from "react-icons/go";

/***
 * split ha dei booleani
 * splitValue i valori
***/
function TCForm({
    expenseData={},
    status=0,
    users=[],
    startingData=new Date(),
    itemIndex = -1,
    filled=false,
    onSubmit= () => {},
    onClose= () => {}}
) {

    const [sTitle, setTitle] = useState(expenseData.title);
    const [sAmount, setAmount] = useState(expenseData.amount);
    const [sPaidBy, setPaidBy] = useState(expenseData.paidByNickname);
    const [sDate, setDate] = useState(expenseData.date);
    const [sSplitMethod, setSplitMethod] = useState(expenseData.splitMethod);
    const [sSplitValue, setSplitValue] = useState([]);
    const [sStatus, setStatus] = useState(status); // 0: new, 1: filled, 2: modify

    useEffect(() => {
        setTitle(expenseData.title);
        setAmount(expenseData.amount);
        setPaidBy(expenseData.paidByNickname);
        setSplitValue(expenseData.amountPerUser);
        setStatus(status);
    }, [expenseData, status]);


    function divideMoney(total, people) {
        const baseAmount = Math.floor((total / people) * 100) / 100;
        const remainder = Math.round((total - baseAmount * people) * 100);
        const shares = Array(people).fill(baseAmount);
      
        for (let i = 0; i < remainder; i++) {
          shares[i] += 0.01;
        }

        return shares;
    }

    function doSplit(value) {
        let newSplitValue = [...sSplitValue];
        const countNonZero = newSplitValue.length;
        if (countNonZero != 0)
            var shares = divideMoney(value, countNonZero);
        else
            var shares = Array(newSplitValue.length).fill(0);
        for (let i = 0; i < newSplitValue.length; i++) {
            newSplitValue[i].amount = shares[i];
        }
        setSplitValue(newSplitValue);
    }

    function handleCheck(userId, userNickname) {
        if (sSplitValue.find(split => split.user === userId)) {
            let indexToRemove = sSplitValue.findIndex(split => split.user === userId);
            sSplitValue.splice(indexToRemove, 1);
        }
        else
            sSplitValue.push({user: userId, userNickname: userNickname, amount: 0});
        doSplit(sAmount);
    }

    function changeAmount(value) {
        console.log("L'amount è: ", value);
        setAmount(value);
        doSplit(value);
    }

    function checkSubmit() {
        if (sTitle == "" || sTitle == undefined)
            return false;
        if (sAmount <= 0 || sTitle == undefined)
            return false;
        if (sPaidBy == "" || sPaidBy == undefined)
            return false;
        if (sDate < Date.now() || sDate == undefined)
            return false;
        if (sSplitValue == [] || sSplitValue == undefined)
            return false;
        return true;
    }

    function submit() {
        if (!checkSubmit())
            return;
        console.log("Tipo di sAmount:", typeof sAmount);
        const newExpense = {
            title: sTitle,
            amount: sAmount,
            date: sDate,
            paidByNickname: sPaidBy,
            amountPerUser: sSplitValue,           
        }
        console.log("Tipo di sAmount:", typeof newExpense.amount);
        onSubmit(newExpense, itemIndex);
        close();
    }

    function close() {
        onClose();
    }

    function modify() {
        setStatus(2);
    }

    function notEmpty(titleValue) {
        if (titleValue == "")
            return false;
        return true;
    }

    function validateAmount(amountValue) {
        if (amountValue <= 0)
            return false;
        return true;
    }

    return (
        <div className="tc-form">
            <div className="tc-button-line">
                {sStatus > 0 && <GoPencil className="tc-button" onClick={() => modify()} />}
                <BsXLg className="tc-button" onClick={() => close()}/>
            </div>
            <TextField value={sTitle} setValue={setTitle} name="Title" disabled={sStatus == 1} validate={notEmpty}/>
            <div>
                <TextField value={sAmount} setValue={changeAmount} name="Amount" type="number" disabled={sStatus == 1} validate={validateAmount}/>
            </div>
            <div className="tc-form-line">
                <PickField value={sPaidBy} setValue={setPaidBy} name="Paid By" options={users.map(user => user[1])} style={{flex: "3"}} disabled={sStatus == 1} validate={notEmpty}/>
                <DateField value={sDate} setValue={setDate} name="When" style={{flex: "2"}} disabled={sStatus == 1} minDate={startingData} validate={() => {return true}}/>
            </div>
            <div className="tc-form-line">
                <div>Split</div>
                <PickField value={sSplitMethod} setValue={setSplitMethod} options={["In modo equo"]} disabled={sStatus == 1}/>
            </div>
            <div className="list">
                {users.map((user, index) => (
                    <div className="tc-list-item" key={index}>
                        <div className="tc-list-left">
                            <input
                                type="checkbox"
                                checked={!!sSplitValue.find(expense => expense.user === user[0])}
                                id={`item-${index}`}
                                onChange={() => handleCheck(user[0], user[1])}
                                disabled={sStatus == 1}
                            />
                            <label htmlFor={`item-${index}`}>{user[1]}</label>
                        </div>
                        <div className="tc-list-right">{sSplitValue.find(expense => expense.user === user[0])?.amount ?? 0}</div>
                    </div>
                ))}
            </div>
            <div className="tc-button-container">
                {
                    sStatus != 1 &&
                    <div className="tc-add-button" onClick={() => submit()}>{sStatus == 0 ? "Send" : "Save"}</div>
                }
            </div>
        </div>
    )
}

export default TCForm;
