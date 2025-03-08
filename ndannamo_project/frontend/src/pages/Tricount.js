import { useState, useRef, useEffect } from "react";
import TCListItem, {TCListHeader} from "./TripPages/Tricount/TriListItem";
import SearchBar from "../components/SearchBar";
import TCForm from "./TripPages/Tricount/TCForm";
import TCSales from './TripPages/Tricount/TriSales';
import { TCRefund } from "./TripPages/Tricount/TriRefund";
import "../styles/Main.css";
import TCUserRecap from "./TripPages/Tricount/TriRecap";

class ExpenseDto {
    constructor(params = {}) {
        this.id = params.id ?? -1;
        this.tripId = params.tripId ?? -1;
        this.paidBy = params.paidBy ?? -1;
        this.paidByNickname = params.paidByNickname ?? "";
        this.title = params.title ?? "";
        this.date = params.date ?? "";
        this.amount = params.amount ?? 0;
        this.splitEven = params.splitEven ?? true;
        this.amountPerUser = params.amountPerUser ?? [];
    }
}


function Tricount() {
    const tripInfo = {users: [[0, "Sara"], [1, "Pino"], [2, "Anna"], [3, "Piero"], [4, "Marta"], [5, "Mari grace"]], startingData: new Date()};
    const userId = 3;
    const userNickname = "Piero";

    const [activeText, setActiveText] = useState("list");
    const [formVisibility, setFormVisibility] = useState(true);
    const [formData, setFormData] = useState({
        expenseData: new ExpenseDto,
        users: tripInfo.users,
        filled: false,
        status: 0,
        startingData: tripInfo.startingData,
        onSubmit: submit,
        onClose: () => setFormVisibility(false),
        onDestroy: destroy,
    });
    const itemsRefs = useRef([]);
    const [selected, setSelected] = useState(-1);
    const [data, setData] = useState(retrieveTricounts());

    function retrieveTricounts() {
        const retrievedData = [
            new ExpenseDto(
                {
                    id: 1,
                    title:"Ristorante",
                    amount: 42.10,
                    paidBy: 1,
                    paidByNickname:"Pino",
                    expense: 21.05,
                    date: new Date(),
                    amountPerUser: [
                        {
                            "user": 2,
                            "userNickname": "Anna",
                            "amount": 21.05
                        },
                        {
                            "user": 1,
                            "userNickname": "Pino",
                            "amount": 21.05,
                        }
                    ],
                }
            ),
        ];
        return retrievedData;
    };

    const handleClick = (id) => {
        if (id === 'sales') {
            setFormData({
                expenseData: new ExpenseDto,
                users: tripInfo.users,
                filled: false,
                status: 0,
                startingData: tripInfo.startingData,
                onSubmit: submit,
                onClose: () => setFormVisibility(false),
                onDestroy: destroy,
            })
        }
        setActiveText(id);
    };

    const handleTricountSelection = (event, itemData) => {
        setFormData({
            expenseData: itemData,
            users: tripInfo.users,
            filled: true,
            status: 1,
            startingData: tripInfo.startingData,
            itemIndex: -1,
            onSubmit: submit,
            onClose: () => setFormVisibility(false),
            onDestroy: destroy,
        });
        if (!formVisibility)
            setFormVisibility(true);
        /*if (selected != -1 && itemsRefs.current[selected])
            itemsRefs.current[selected].setClicked(false);
        setSelected(index);*/
    };

    function addSale() {
        if (formData.status === 1 || !formVisibility) {
            setFormData({
                expenseData: new ExpenseDto,
                users: tripInfo.users,
                filled: false,
                status: 0,
                startingData: tripInfo.startingData,
                onSubmit: submit,
                onClose: () => setFormVisibility(false),
                onDestroy: destroy,
            });
            setFormVisibility(true);
            if (selected !== -1 && itemsRefs.current[selected])
                itemsRefs.current[selected].setClicked(false);
            setSelected(-1);
        }
    }

    function getNewExpenseId() {
        const max = Math.max(...data.map(expense => expense.id));
        return max + 1;
    }

    function createNewExpense(newExpense) {
        const newExpenseDto = new ExpenseDto(newExpense);
        const newId = getNewExpenseId();
        newExpenseDto.id = newId;
        const newData = [...data];
        newData.push(newExpenseDto);
        const now = new Date();
        newData.sort((a, b) => Math.abs(b.date - now) - Math.abs(a.date - now));
        setData(newData);
    }

    function submit(newExpense, expenseId = -1) {
        console.log("Expense id: ", expenseId);
        if (expenseId === -1)
            createNewExpense(newExpense);
        else
        {
            const oldExpenseIndex = data.findIndex((expense) => expense.id === expenseId);
            if (oldExpenseIndex >= 0) {
                const newData = [...data];
                const oldExpense = data[oldExpenseIndex];
                const newExpenseDto = {
                    ...oldExpense,
                    ...newExpense,
                }
                newData[oldExpenseIndex] = newExpenseDto;
                setData(newData);
            }
        }
    }

    
    function destroy(expenseId) {
        const index = data.findIndex(expense => expense.id === expenseId);
        if (index >= 0) {
            const newData = [...data];
            newData.splice(index, 1);
            setData(newData);
        }
    }


    return (
        <div className="main">
            <div className="content tc-content">
                <div className="tc-left">
                    <div className="tc-top">
                        <div className={`tc-top-text ${activeText === "list" ? "active" : "inactive"}`}
                            id="list" onClick={()=>handleClick("list")}>Lista spese</div>
                        <div className={`tc-top-text ${activeText === "sales" ? "active" : "inactive"}`}
                            id="sales" onClick={()=>handleClick("sales")}>Saldi</div>
                    </div>
                    {activeText === "list" &&
                        <TCSales
                            data={data}
                            userId={userId}
                            handleSelection={handleTricountSelection}
                            handleAdd={addSale}/>
                    }
                    {activeText === "sales" &&
                        <TCRefund
                            user={userId}
                            expenses={data}
                            users={tripInfo.users}
                        />
                    } 
                </div>
                {formVisibility === true &&
                    <div className="tc-right">
                        <TCForm {...formData}/>
                        {/***activeText === "sales" &&
                            <TCUserRecap
                                user={userId}
                                userNickname={userNickname}
                                expenses={data}
                            />
                        ***/}
                    </div>
                }
            </div>
        </div>
    )
}

export default Tricount;
