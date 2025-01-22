import { useState, useRef, useEffect } from "react";
import TCListItem, {TCListHeader} from "./TripPages/Tricount/TriListItem";
import SearchBar from "../components/SearchBar";
import TCForm from "./TripPages/Tricount/TriForm";
import TriRefund, {ScrollableRow, TriBalance} from "./TripPages/Tricount/TriRefund";
import "../styles/Main.css";

class ExpenseDto {
    constructor(params = {}) {
        this.id = params.id || -1;
        this.tripId = params.tripId || -1;
        this.paidBy = params.paidBy || -1;
        this.paidByNickname = params.paidByNickname || "";
        this.title = params.title || "";
        this.date = params.date || "";
        this.amount = params.amount || 0;
        this.splitEven = params.splitEven || true;
        this.amountPerUser = params.amountPerUser || [];
    }
}

class Refound {
    constructor(params = {}) {
        this.amount = params.amount || 0;
        this.by = params.by || -1;
        this.to = params.to || -1;
    }
}

function Tricount() {
    const tripInfo = {users: [[0, "Sara"], [1, "Pino"], [2, "Anna"], [3, "Piero"], [4, "Marta"], [5, "Mari grace"]], startingData: new Date()};
    const userId = 3;

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
    });
    const itemsRefs = useRef([]);
    const [selected, setSelected] = useState(-1);
    const [myTotalExpenses, setMyTotalExpenses] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [data, setData] = useState(retrieveTricounts());
    const [searchData, setSearchData] = useState([...data]);
    const [balance, setBalance] = useState([]);
    const [refund, setRefund] = useState([]);

    useEffect(() => {
        retriveExpenses(data);
        const newBalance = calcBalance(data);
        setBalance(newBalance);
        setRefund(calcRefund(newBalance));
    }, [data]);

    function retrieveTricounts() {
        const retrievedData = [
            new ExpenseDto(
                {
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
        setActiveText(id);
    };

    const handleTricountSelection = (index) => {
        setFormData({
            expenseData: data[index],
            users: tripInfo.users,
            filled: true,
            status: 1,
            startingData: tripInfo.startingData,
            itemIndex: index,
            onSubmit: submit,
            onClose: () => setFormVisibility(false),
        });
        if (!formVisibility)
            setFormVisibility(true);
        if (selected != -1 && itemsRefs.current[selected])
            itemsRefs.current[selected].setClicked(false);
        setSelected(index);
    };

    function addSale() {
        if (formData.status == 1 || !formVisibility) {
            setFormData({
                expenseData: new ExpenseDto,
                users: tripInfo.users,
                filled: false,
                status: 0,
                startingData: tripInfo.startingData,
                onSubmit: submit,
                onClose: () => setFormVisibility(false),
            });
            setFormVisibility(true);
            if (selected != -1 && itemsRefs.current[selected])
                itemsRefs.current[selected].setClicked(false);
            setSelected(-1);
        }
    }

    function createNewExpense(newExpense) {
        const newExpenseDto = new ExpenseDto(newExpense);
        const newData = [...data];
        newData.push(newExpenseDto);
        const now = new Date();
        newData.sort((a, b) => Math.abs(b.date - now) - Math.abs(a.date - now));
        setData(newData);
    }

    function submit(newExpense, itemIndex = -1) {
        if (itemIndex == -1)
            createNewExpense(newExpense);
        else if (itemIndex < data.length)
        {
            const newExpenseDto = new ExpenseDto(newExpense);
            const newData = [...data];
            newData[itemIndex] = newExpenseDto;
            setData(newData);
        }
    }


    function checkExpensesSearch(value, searchTerm) {
        if (!value || !searchTerm) return false;
        return value.title.toLowerCase().includes(searchTerm.toLowerCase());
    }


    function retriveExpenses(expensesData) {
        let totExpenses = 0;
        let myExpenses = 0;

        expensesData.map((expense) => {
            totExpenses += expense.amount;
            expense.amountPerUser.map((e) => {
                if (e.user == userId)
                    myExpenses += e.amount;
            })
        })

        setTotalExpenses(totExpenses);
        setMyTotalExpenses(myExpenses);
    }

    function calcBalance(expenses) {
        var dict = {}
        const balances = []

        tripInfo.users.map((u) => {
            dict[u[0]] = 0;
        })

        expenses.map((e) => {
            dict[e.paidBy] += e.amount;
            e.amountPerUser.map((userAmount) => {
                dict[userAmount.user] -= userAmount.amount;
            })
        })

        const sorted = Object.entries(dict)
            .map(([key, value]) => [Number(key), value])
            .sort(([, valueA], [, valueB]) => valueB - valueA);
        sorted.map((value) => {
            const newBalance = {amount: value[1], id: value[0], nickname: tripInfo.users[value[0]][1]};
            balances.push(newBalance);
        })

        return balances;
    }

    function calcRefund(balances) {
        const refounds = [];
        const copyBalances = balances.map(balance => ({ ...balance }));

        if (balances.length <= 0)
            return [];

        var lastValue = copyBalances.pop();
        lastValue.amount *= -1;
        let i = 0;
        while (balances[i].amount > 0) {
            var toRefound = balances[i].amount;
            while (toRefound > 0) {
                if (lastValue.amount == 0) {
                    lastValue = copyBalances.pop();
                    lastValue.amount *= -1;
                }
                if (lastValue.amount < 0)
                    break;
                var refoundValue = 0
                if (toRefound > lastValue.amount)
                    refoundValue = lastValue.amount;
                else
                    refoundValue = toRefound;
                toRefound -= refoundValue;
                lastValue.amount -= refoundValue;
                const refound = new Refound({to: balances[i].id, amount: refoundValue, by: lastValue.id})
                refounds.push(refound);
            }

            i += 1;
        }

        return refounds;
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
                    {activeText === "list" && ( <>
                    <div className="tc-main-recap">
                        <div className="tc-recap">
                            <div>Le mie spese</div>
                            <div className="tc-recap-expenses">{myTotalExpenses.toFixed(2)}</div>
                        </div>
                        <div className="tc-recap">
                            <div>Spese totali</div>
                            <div className="tc-recap-expenses">{totalExpenses.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="tc-middle">
                        <div className="tc-title">Spese</div>
                        <SearchBar items={searchData} setItems={setSearchData} itemsAll={data} checkItemSearch={checkExpensesSearch}/>
                    </div>
                    <div className="tc-list">
                        <TCListHeader names={["Name", "Expense", "Total", "Date", "Paid by"]}/>
                        {searchData.map((item, index) => (
                            <TCListItem
                                key={index}
                                userId={userId}
                                expenseData={item}
                                onClick={()=>handleTricountSelection(index)}
                                ref={(el) => (itemsRefs.current[index] = el)}
                            />
                        ))}
                    </div>
                    <div className="tc-button-container">
                        <div className="tc-add-button" onClick={() => addSale()}>+ Add Spesa</div>
                    </div>
                    </>)}
                    {activeText === "sales" && (<>
                        <TCListHeader names={["Nickname", "Balance"]}/>
                        <div className="tc-list">
                            <div className="tc-list-inner" style={{maxHeight: '150px'}}>
                                {balance
                                    .sort((a, b) => (a.id === userId ? -1 : b.id === userId ? 1 : 0)) // Porta l'elemento con id === user.id in cima
                                    .map((b, index) => (
                                        <TriBalance
                                            key={index}
                                            id={b.id}
                                            nickname={b.nickname}
                                            amount={b.amount}
                                        />
                                ))}
                            </div>
                        </div>
                        <div className="tc-middle">
                            <div className="tc-title">Refund</div>
                        </div>
                        <div className="tc-list">
                            <TCListHeader names={["By", "To", "Amount", ""]}/>
                            {refund.map((r, index) => (
                                <TriRefund
                                    key={index}
                                    by={r.by}
                                    to={r.to}
                                    amount={r.amount}
                                    toNick={tripInfo.users[r.to][1]}
                                    byNick={tripInfo.users[r.by][1]}
                                />
                            ))}
                        </div>
                    </>)}
                </div>
                {
                    formVisibility == true &&
                    <div className="tc-right">
                        <TCForm {...formData}/>
                    </div>
                }
            </div>
        </div>
    )
}

export default Tricount;
