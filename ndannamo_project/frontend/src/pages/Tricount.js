import { useState } from "react";
import TCListItem, {TCListHeader} from "../components/Tricount/TriListItem";
import TCForm from "../components/Tricount/TriForm"
import "../styles/Main.css";

function Tricount() {

    const [activeText, setActiveText] = useState("list");
    const [form, setForm] = useState(<TCForm/>);

    function retrieveTricounts() {
        return [
            {name:"Ristorante", total:"100", by:"Sara", expense:"20", date: new Date(), splitValue: [20, 80], split: [true, true]},
            {name:"Ristorante cinese buono", total:"100", by:"Luca", expense:"60", date: new Date(), splitValue: [60, 40], split: [true, true]},
        ]
    };

    const handleClick = (id) => {
        setActiveText(id);
    };

    const data = retrieveTricounts();

    const handleTricountSelection = (index) => {
        const newForm = <TCForm
            title={data[index].name}
            amount={data[index].total}
            date={data[index].date}
            users={["Luca", "Damiana"]}
            paidBy={data[index].by}
            splitValue={data[index].splitValue}
            split={data[index].split}
            filled={true}
        />
        
        setForm(newForm);
    };

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
                                name={item.name}
                                total={item.total}
                                by={item.by}
                                expense={item.expense}
                                date={item.date.toDateString()}
                                onClick={()=>handleTricountSelection(index)}
                            />
                        ))}
                    </div>
                    <div className="tc-button-container">
                        <div className="tc-add-button">+ Add Spesa</div>
                    </div>
                </div>
                <div className="tc-right">
                    {form}
                </div>
            </div>
        </div>
    )
}

export default Tricount;
