import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import TripService from "../../services/TripService";
import ExpenseService from '../../services/ExpenseService';
import InternalMenu from "./InternalMenu";
import TCForm from './Tricount/TriForm';
import TCListItem, {TCListHeader} from './Tricount/TriListItem';

import './InternalMenu.css'
import "../../styles/Main.css";


export default function TripExpenses() {
    const { id } = useParams();
    const [tripInfo, setTripInfo] = useState({
        id:'',
        title: '',
        locations: [],
        creationDate:'',
        startDate : '',
        endDate : '',
        createdBy:'',
        list_participants: []
    });
    const navigate = useNavigate();


    const [data, setData] = useState([]);

    /*
    // Struttura di data:
    {
        "id": 903,
        "tripId": 252,
        "paidBy": 2,
        "paidByNickname": "jacopino",
        "title": "sushi",
        "date": "2025-07-05",
        "amount": 42.1,
        "splitEven": true,
        "amountPerUser": [
            {
                "user": 2,
                "userNickname": "anna",
                "amount": 21.05
            },
            {
                "user": 1,
                "userNickname": "jacopino",
                "amount": 21.05
            }
        ]
    }
    */



    useEffect(() => {
        fetchTripInfo();
    }, []);

    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            const response = await TripService.getTrip(token, id);

            if (response) {
                setTripInfo(response);

                // Ottieni le spese
                retrieveTricounts();

            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };



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


    const retrieveTricounts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await ExpenseService.getExpenses(token, id);

            if (response) {
                setData(response);
            } else {
                console.error('Invalid response data');
            }
        }catch (error) {
            console.error('Error fetching expenses information:', error);
        }

        /*
        return [
            {name:"Ristorante", total:"100", by:"Sara", expense:"20", date: new Date(), splitValue: [20, 80], split: [true, true]},
            {name:"Ristorante cinese buono", total:"100", by:"Luca", expense:"60", date: new Date(), splitValue: [60, 40], split: [true, true]},
        ]
        */
    };



    const handleClick = (id) => {
        setActiveText(id);
    };

    //const data = retrieveTricounts();

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
        <div className="trip-info">
            <InternalMenu/>
            <div className="trip-content">
                <div className="trip-top">
                    <span> <strong>{tripInfo.title}</strong> {tripInfo.startDate} {tripInfo.endDate}</span>
                </div>
                <div className="trip-details tc-content">
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
                                    name={item.title}
                                    total={item.amount}
                                    by={item.paidByNickname}
                                    expense={item.expense}
                                    date={item.date}
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
        </div>
    );
}
