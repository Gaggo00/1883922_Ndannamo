import { useState } from "react";
import TCListItem, {TCListHeader} from "../components/Tricount/TriListItem";
import TCForm from "../components/Tricount/TriForm"
import "../styles/Main.css";

function Tricount() {

    const [activeText, setActiveText] = useState("list");

    const handleClick = (id) => {
        setActiveText(id);
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
                        <TCListItem name="Ristorante" total="100$" by="Luca" expense="20$" date="30 Ottobre"/>
                        <TCListItem name="Ristorante cinese buono" total="100$" by="Luca" expense="20$" date="30 Ottobre"/>
                    </div>
                    <div className="tc-button-container">
                        <div className="tc-add-button">+ Add Spesa</div>
                    </div>
                </div>
                <div className="tc-right">
                    <TCForm/>
                </div>
            </div>
        </div>
    )
}

export default Tricount;
