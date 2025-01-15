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
    filled=false,
    onSubmit= () => {},
    onClose= () => {}},
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

    function doSplit(value) {
        let newSplitValue = [...sSplitValue];
        const countNonZero = newSplitValue.length;
        const newValue = countNonZero ? (value / countNonZero) : 0;
        for (let i = 0; i < newSplitValue.length; i++) {
            newSplitValue[i].amount = newValue;
        }
        setSplitValue(newSplitValue);
    }

    function handleCheck(user) {
        if (sSplitValue.find(split => split.userNickname === user)) {
            let indexToRemove = sSplitValue.findIndex(split => split.userNickname === user);
            sSplitValue.splice(indexToRemove, 1);
        }
        else
            sSplitValue.push({userNickname: user, amount: 0});
        doSplit(sAmount);
    }

    function changeAmount(value) {
        setAmount(value);
        doSplit(value);
    }

    function submit() {
        onSubmit({
        });
        close();
    }

    function close() {
        onClose();
    }

    function modify() {
        setStatus(2);
    }

    return (
        <div className="tc-form">
            <div className="tc-button-line">
                {sStatus > 0 && <GoPencil className="tc-button" onClick={() => modify()} />}
                <BsXLg className="tc-button" onClick={() => close()}/>
            </div>
            <TextField value={sTitle} setValue={setTitle} name="Title" disabled={sStatus == 1}/>
            <div>
                <TextField value={sAmount} setValue={changeAmount} name="Amount" type="number" disabled={sStatus == 1}/>
            </div>
            <div className="tc-form-line">
                <PickField value={sPaidBy} setValue={setPaidBy} name="Paid By" options={users} style={{flex: "3"}} disabled={sStatus == 1}/>
                <DateField value={sDate} setValue={setDate} name="When" style={{flex: "2"}} disabled={sStatus == 1}/>
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
                                checked={!!sSplitValue.find(expense => expense.userNickname === user)}
                                id={`item-${index}`}
                                onChange={() => handleCheck(user)}
                                disabled={sStatus == 1}
                            />
                            <label htmlFor={`item-${index}`}>{user}</label>
                        </div>
                        <div className="tc-list-right">{sSplitValue.find(expense => expense.userNickname === user)?.amount ?? 0}</div>
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
