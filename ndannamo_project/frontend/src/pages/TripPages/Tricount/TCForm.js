import TextField, { DateField, PickedField, PickField } from "../../../components/Fields/Fields";
import "./Tricount.css"
import {useState, useEffect, useRef} from 'react'
import { BsXLg, BsTrash3 } from "react-icons/bs";
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
    onDestroy= () => {},
    onClose= () => {}},
) {

    const [sTitle, setTitle] = useState(expenseData.title);
    const [sAmount, setAmount] = useState(expenseData.amount);
    const [sPaidBy, setPaidBy] = useState(expenseData.paidByNickname);
    const [sDate, setDate] = useState(expenseData.date);
    const [sSplitMethod, setSplitMethod] = useState(expenseData.splitMethod);
    const [sSplitValue, setSplitValue] = useState([]);
    const [sStatus, setStatus] = useState(status); //0: new, 1: filled, 2: modify
    const [expenseId, setId] = useState(expenseData.id);
    const [showBanner, setShowBanner] = useState(false);
    const [showDestroyBanner, setShowDestroyBanner] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        setTitle(expenseData.title);
        setAmount(expenseData.amount);
        setPaidBy(expenseData.paidByNickname);
        setSplitValue(expenseData.amountPerUser);
        setDate(expenseData.date);
        setId(expenseData.id);
        setStatus(status);
        setSplitMethod(expenseData.splitEven == true ? "Equally" : "As Amounts")
    }, [expenseData, status]);


    useEffect(() => {
    }, [sSplitMethod])

    function setDateToString(dateString) {
        const newDate = new Date(dateString);
        setDate(newDate);
    }

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
        if (countNonZero !== 0)
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
        doSplit(Number(sAmount));
    }


    const handleChangeCost = (index, e) => {
        let newValue = e.target.value;
    
        // Se il valore non è vuoto, rimuovi lo zero iniziale solo se il numero non è zero
        if (newValue && newValue[0] === '0' && newValue.length > 1) {
          newValue = newValue.replace(/^0+/, ''); // Rimuove tutti gli zeri iniziali
        }
    
        // Aggiorna lo stato solo con numeri validi
        const newAmount = newValue === '' ? "" : parseInt(newValue, 10);
    
        // Aggiorna l'array in base all'indice
        setSplitValue((prev) =>
          prev.map((expense, idx) =>
            idx === index
              ? { ...expense, amount: isNaN(newAmount) ? "" : newAmount }
              : expense
          )
        );
    };

    const handleFocusCost = (index, e) => {
        // Se il valore è 0, rimuovilo
        if (sSplitValue[index].amount === 0) {
          setSplitValue((prev) =>
            prev.map((expense, idx) =>
              idx === index ? { ...expense, amount: '' } : expense
            )
          );
        }
      };
    
      const handleBlurCost = (index, e) => {
        // Se l'input è vuoto, ripristina il valore a 0
        console.log(e.target.value)
        if (e.target.value <= 0) {
            setSplitValue((prev) =>
                prev.filter((expense, idx) => idx !== index) // Rimuovi l'elemento con l'indice 'index'
            );
        }
      };

    function changeAmount(value) {
        setAmount(value);
        doSplit(value);
    }

    function checkSubmit() {
        if (sTitle === "" || sTitle === undefined) {
            console.log("problema titolo");
            return false;}
        if (Number(sAmount) <= 0 || sTitle === undefined){
            console.log("problema amount");
            return false;}
        if (sPaidBy === "" || sPaidBy === undefined){
            console.log("problema paid");
            return false;}
        const compDat1 = new Date(sDate);
        const compDat2 = new Date();
        compDat1.setHours(0, 0, 0, 0);
        compDat2.setHours(0, 0, 0, 0)
        if (compDat1 < compDat2 || sDate === undefined){
            console.log("problema con date 1");
            return false;}
        if (sSplitValue.length === 0 || sSplitValue === undefined){
            console.log("problema splitvalue");
            return false;}
        const totalAmount = sSplitValue.reduce((sum, item) => sum + item.amount, 0);
        if (totalAmount != sAmount){
            console.log("total amount", totalAmount);
            console.log("sAmount:",sAmount);
            console.log("problema totale");
            return false;}
        return true;
    }

    function submit() {
        if (!checkSubmit()) {

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            setShowBanner(true);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            timeoutRef.current = setTimeout(() => {
                setShowBanner(false);
            }, 3000);

            return;
        }

        const paidByUser = users.find((u) => u[1] === sPaidBy);
        const newExpense = {
            title: sTitle,
            amount: Number(sAmount),
            date: sDate,
            paidBy: paidByUser === undefined ? -1 : paidByUser[0],
            paidByNickname: sPaidBy,
            amountPerUser: sSplitValue,
            splitEven: sSplitMethod === 'In modo equo' ? true : false,
        }
        onSubmit(newExpense, expenseId);
        reset();
        //close();
    }

    function reset() {
        setTitle("");
        setAmount("");
        setPaidBy("");
        setDate("");
        setSplitValue([]);
        setId(-1);
        setStatus(0);
    }

    function close() {
        onClose();
    }

    function modify() {
        setStatus(2);
    }

    function destroy () {
        setShowDestroyBanner(false);
        onDestroy(expenseId);
        reset();
    }

    function notEmpty(titleValue) {
        if (titleValue === "")
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
                {sStatus > 0 && <BsTrash3 className="tc-button" onClick={() => setShowDestroyBanner(true)}/>}
                {sStatus > 0 && <GoPencil className="tc-button" onClick={() => modify()} />}
                <BsXLg className="tc-button" onClick={() => close()}/>
            </div>
            <div className="tc-title">
                {sStatus === 2 && "Edit Expenses"}
                {sStatus === 0 && "Add Expenses"}</div>
            <TextField value={sTitle} setValue={setTitle} name="Title" placeholder="E.g. Dinner" disabled={sStatus === 1} validate={sStatus !== 1 ? notEmpty : undefined}/>
            <TextField value={sAmount} setValue={changeAmount} name="Amount (€)" placeholder="0.00" type="number" disabled={sStatus === 1} validate={sStatus !== 1 ? validateAmount : undefined}/>
            <div className="tc-form-line"  id="paid" style={{gap: '15px'}}>
                <PickField  value={sPaidBy} setValue={setPaidBy} name="Paid By" options={users.map(user => user[1])} style={{flex: "3"}} disabled={sStatus === 1} validate={sStatus !== 1 ? notEmpty : undefined}/>
                <DateField value={sDate} setValue={setDateToString} name="When" style={{flex: "2"}} disabled={sStatus === 1} minDate={startingData} validate={sStatus !== 1 ? () => {return true} : undefined}/>
            </div>
            <div className="tc-form-line" id="split" style={{alignItems: "center"}}>
                <div>Split</div>
                <PickField  value={sSplitMethod} setValue={setSplitMethod} options={["Equally", "As Amounts"]} disabled={sStatus === 1} style={{width: '60%'}}/>
            </div>
            <div className="tc-form-list">
                {users.map((user, index) => (
                    <div className="tc-list-item" key={index}>
                        <div className="tc-list-left">
                            <input
                                type="checkbox"
                                checked={!!sSplitValue.find(expense => expense.user === user[0])}
                                id={`item-${index}`}
                                onChange={() => handleCheck(user[0], user[1])}
                                disabled={sStatus === 1}
                            />
                            <label htmlFor={`item-${index}`}>{user[1]}</label>
                        </div>
                        {
                            sSplitMethod === 'Personalizzato' &&
                            <div className="tc-list-right">
                                <input
                                    type="number"
                                    min={0}
                                    value={sSplitValue.find(expense => expense.user === user[0])?.amount ?? ""}
                                    onChange={(e) => handleChangeCost(index, e)}
                                    onFocus={(e) => handleFocusCost(index, e)} // Gestisce il focus
                                    onBlur={(e) => handleBlurCost(index, e)} // Gestisce il blur
                                    step="1"
                                    style={{width: "80px"}}
                                    disabled={!sSplitValue.find(expense => expense.user === user[0])}
                                />
                            </div>
                        }
                        {
                            sSplitMethod !== 'Personalizzato' &&
                            <div className="tc-list-right">€ {sSplitValue.find(expense => expense.user === user[0])?.amount ?? 0}</div>
                        }
                    </div>
                ))}
            </div>
            <div className="tc-button-container">
                {
                    sStatus !== 1 &&
                    <div className="tc-add-button-form" onClick={() => submit()}>{sStatus === 0 ? "Add" : "Save"}</div>
                }
            </div>
            {showBanner && (
                <div className="tc-form-banner">
                    <p>Campi vuoti o errati</p>
                    <BsXLg className="tc-button" onClick={() => setShowBanner(false)}/>
                </div>
            )}
            {showDestroyBanner && (
                <div className="tc-form-destroy-banner">
                    <p>Vuoi eliminare {sTitle}?</p>
                    <div>
                        <button onClick={() => destroy()}>Yes</button>
                        <button onClick={() => setShowDestroyBanner(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TCForm;
