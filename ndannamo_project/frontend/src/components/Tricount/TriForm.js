import TextField, { DateField, PickedField, PickField } from "../Fields/Fields"
import "./Tricount.css"
import {state, useState} from 'react'

function TCForm({users = ["marta", "teresa"]}) {

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState(0.00);
    const [paidBy, setPaidBy] = useState(users[0]);
    const [date, setDate] = useState();
    const [splitMethod, setSplitMethod] = useState("In modo equo");
    const [splitValue, setSplitValue] = useState(users.map(() => 0));
    const [split, setSplit] = useState(users.map(() => 0));

    function doSplit(value) {
        if (splitMethod === "In modo equo") {
            const countNonZero = split.filter(value => value !== false).length;
            const newSplitValue = users.map(() => 0);
            for (let i = 0; i < split.length; i++) {
                if (split[i])
                    newSplitValue[i] = value / countNonZero;
            }
            setSplitValue(newSplitValue);
        }
    }

    function handleCheck(index) {
        split[index] = !split[index];
        setSplit(split);
        doSplit(amount);
    }

    function changeAmount(value) {
        setAmount(value);
        doSplit(value);
    }

    return (
        <div className="tc-form">
            <TextField value={title} setValue={setTitle} name="Title"/>
            <div>
                <TextField value={amount} setValue={changeAmount} name="Amount" type="number"/>
            </div>
            <div className="tc-form-line">
                <PickField value={paidBy} setValue={setPaidBy} name="Paid By" options={users} style={{flex: "3"}}/>
                <DateField value={date} setValue={setDate} name="When" style={{flex: "2"}}/>
            </div>
            <div className="tc-form-line">
                <div>Split</div>
                <PickField value={splitMethod} setValue={setSplitMethod} options={["In modo equo"]}/>
            </div>
            <div className="list">
                {users.map((user, index) => (
                    <div className="tc-list-item" key={index}>
                    <div className="tc-list-left">
                        <input type="checkbox" id={`item-${index}`} onClick={() => handleCheck(index)}/>
                        <label htmlFor={`item-${index}`}>{user}</label>
                    </div>
                    <div className="tc-list-right">{splitValue[index]}</div>
                    </div>
                ))}
            </div>
            <div className="tc-button-container">
                <div className="tc-add-button">Send</div>
            </div>
        </div>
    )
}

export default TCForm;
