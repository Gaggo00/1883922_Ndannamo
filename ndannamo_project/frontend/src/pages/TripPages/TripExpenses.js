import React, {useEffect, useState, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import ExpenseService from '../../services/ExpenseService';
import UserService from '../../services/UserService';
import TripService from '../../services/TripService';
import TCForm from './Tricount/TriForm';
import TCSales from './Tricount/TriSales';
import { TCRefund } from "./Tricount/TriRefund";

import './InternalMenu.css'
import "../../styles/Main.css";


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

export default function TripExpenses() {
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    console.log(tripInfo.list_participants);
    const [userId, setUserId] = useState(-1);

    const [data, setData] = useState([]);

    useEffect(() => {
        retrieveTricounts();
        getUserId();
        retrieveTrip();
    }, []);

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
        onSubmit: submit,
        onClose: () => setFormVisibility(false),
    });
    const itemsRefs = useRef([]);
    const [selected, setSelected] = useState(-1);
    const navigate = useNavigate();

    const getUserId = async () => {
        try {
            const response = await UserService.getProfile(localStorage.getItem('token'))
            setUserId(response.id);
        } catch (error) {
            console.error('Error fetching user information:', error);
        }

    }

    const retrieveTrip = async () => {
        try {
            const trip = await TripService.getTrip(localStorage.getItem('token'), location.state?.trip.id)
            console.log(trip);
        } catch (error) {
            console.error('Error fetching trip information:', error);
        }
    }

    const retrieveTricounts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await ExpenseService.getExpenses(token, tripInfo.id);

            if (response) {
                setData(response);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching expenses information:', error);
        }
    };


    const handleClick = (id) => {
        if (id == 'sales') {
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
        if (formData.status == 1 || !formVisibility) {
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
            if (selected != -1 && itemsRefs.current[selected])
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
        if (expenseId == -1)
            createNewExpense(newExpense);
        else
        {
            const oldExpenseIndex = data.findIndex((expense) => expense.id == expenseId);
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
        const index = data.findIndex(expense => expense.id == expenseId);
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
                    {activeText == "sales" &&
                        <TCRefund
                            user={userId}
                            expenses={data}
                            users={tripInfo.users}
                        />
                    } 
                </div>
                {formVisibility == true &&
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

