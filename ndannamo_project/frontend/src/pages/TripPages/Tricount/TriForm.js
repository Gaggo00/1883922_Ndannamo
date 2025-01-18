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
    title="",
    amount=0.00,
    date=new Date(),
    users = [""],
    paidBy=users[0],
    split=users.map(() => false),
    splitMethod="In modo equo",
    splitValue=users.map(() => 0),
    status=0,
    filled=false,
    onClose= () => {}},
) {

    const [sTitle, setTitle] = useState(title);
    const [sAmount, setAmount] = useState(amount);
    const [sPaidBy, setPaidBy] = useState(paidBy);
    const [sDate, setDate] = useState(date);
    const [sSplitMethod, setSplitMethod] = useState(splitMethod);
    const [sSplitValue, setSplitValue] = useState(splitValue);
    const [sSplit, setSplit] = useState(split);
    const [sStatus, setStatus] = useState(status); // 0: new, 1: filled, 2: modify

    useEffect(() => {
        setTitle(title);
        setAmount(amount);
        setPaidBy(paidBy);
        setSplit(split);
        setSplitValue(splitValue);
        setStatus(status);
    }, [title, amount, paidBy, split, splitValue, status]);

    function doSplit(value) {
        if (sSplitMethod === "In modo equo") {
            const countNonZero = sSplit.filter(value => value !== false).length;
            const newSplitValue = users.map(() => 0);
            for (let i = 0; i < sSplit.length; i++) {
                if (sSplit[i])
                    newSplitValue[i] = value / countNonZero;
                else
                    newSplitValue[i] = 0
            }
            setSplitValue(newSplitValue);
        }
    }

    function handleCheck(index) {
        const updatedSplit = [...sSplit];
        updatedSplit[index] = !updatedSplit[index];
        setSplit(updatedSplit);
        doSplit(sAmount);
    }

    function changeAmount(value) {
        setAmount(value);
        doSplit(value);
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
            <TextField value={sTitle} setValue={setTitle} name="Title" disabled={sStatus === 1}/>
            <div>
                <TextField value={sAmount} setValue={changeAmount} name="Amount" type="number" disabled={sStatus === 1}/>
            </div>
            <div className="tc-form-line">
                <PickField value={sPaidBy} setValue={setPaidBy} name="Paid By" options={users} style={{flex: "3"}} disabled={sStatus === 1}/>
                <DateField value={sDate} setValue={setDate} name="When" style={{flex: "2"}} disabled={sStatus === 1}/>
            </div>
            <div className="tc-form-line">
                <div>Split</div>
                <PickField value={sSplitMethod} setValue={setSplitMethod} options={["In modo equo"]} disabled={sStatus === 1}/>
            </div>
            <div className="list">
                {users.map((user, index) => (
                    <div className="tc-list-item" key={index}>
                        <div className="tc-list-left">
                            <input
                                type="checkbox"
                                checked={sSplit[index]}
                                id={`item-${index}`}
                                onChange={() => handleCheck(index)}
                                disabled={sStatus === 1}
                            />
                            <label htmlFor={`item-${index}`}>{user}</label>
                        </div>
                        <div className="tc-list-right">{sSplitValue[index]}</div>
                    </div>
                ))}
            </div>
            <div className="tc-button-container">
                {
                    sStatus !== 1 &&
                    <div className="tc-add-button">{sStatus === 0 ? "Send" : "Save"}</div>
                }
            </div>
        </div>
    )
}

export default TCForm;
