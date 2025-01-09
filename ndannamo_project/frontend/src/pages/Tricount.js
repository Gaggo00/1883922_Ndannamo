import { useState, useRef } from "react";
import TCListItem, {TCListHeader} from "../components/Tricount/TriListItem";
import TCForm from "../components/Tricount/TriForm"
import "../styles/Main.css";

function Tricount() {

    const [activeText, setActiveText] = useState("list");
    const [formVisibility, setFormVisibility] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        amount: 0,
        date: "",
        users: [],
        paidBy: "",
        splitValue: 0,
        split: [],
        filled: false,
        status: 0,
        onClose: () => setFormVisibility(false),
    });
    const itemsRefs = useRef([]);
    const [selected, setSelected] = useState(-1);

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
        setFormData({
            title: data[index].name,
            amount: data[index].total,
            date: data[index].date,
            users: ["Luca", "Damiana"],
            paidBy: data[index].by,
            splitValue: data[index].splitValue,
            split: data[index].split,
            filled: true,
            status: 1,
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
                title: "",
                amount: 0,
                date: "",
                users: [],
                paidBy: "",
                splitValue: 0,
                split: [],
                filled: false,
                status: 0,
                onClose: () => setFormVisibility(false),
            });
            setFormVisibility(true);
            if (selected != -1 && itemsRefs.current[selected])
                itemsRefs.current[selected].setClicked(false);
            setSelected(-1);
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
