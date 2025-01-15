import { useState, useRef } from "react";
import TCListItem, {TCListHeader} from "./TripPages/Tricount/TriListItem";
import TCForm from "./TripPages/Tricount/TriForm"
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

function Tricount() {
    const tripInfo = {users: ["Sara", "Anna", "Pino"]};
    const userId = 1;

    const [activeText, setActiveText] = useState("list");
    const [formVisibility, setFormVisibility] = useState(true);
    const [formData, setFormData] = useState({
        expenseData: new ExpenseDto,
        users: tripInfo.users,
        filled: false,
        status: 0,
        onSubmit: submit,
        onClose: () => setFormVisibility(false),
    });
    const itemsRefs = useRef([]);
    const [selected, setSelected] = useState(-1);

    function retrieveTricounts() {
        return [
            new ExpenseDto(
                {
                    title:"Ristorante",
                    amount: 42.10,
                    paidBy: 1,
                    paidByNickname:"Pino",
                    expense:"20",
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
        ]
    };

    const handleClick = (id) => {
        setActiveText(id);
    };

    const data = retrieveTricounts();

    const handleTricountSelection = (index) => {
        setFormData({
            expenseData: data[index],
            users: tripInfo.users,
            filled: true,
            status: 1,
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
                onSubmit: submit,
                onClose: () => setFormVisibility(false),
            });
            setFormVisibility(true);
            if (selected != -1 && itemsRefs.current[selected])
                itemsRefs.current[selected].setClicked(false);
            setSelected(-1);
        }
    }

    function createNewExpense(data) {
        const newExpenseDto = new ExpenseDto(data);
        data.push(newExpenseDto);
    }

    function submit(data) {
        console.log(data);
        createNewExpense(data);
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
                    <div className="tc-middle">
                        <div className="tc-title">Spese</div>
                    </div>
                    <div className="tc-list">
                        <TCListHeader/>
                        {data.map((item, index) => (
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
                </div>
                <div className="tc-right">
                    {formVisibility == true && <TCForm {...formData}/>}
                </div>
            </div>
        </div>
    )
}

export default Tricount;
