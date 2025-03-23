import React, {useEffect, useState, useRef} from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";

import InternalMenu from "./InternalMenu";

import ExpenseService from '../../services/ExpenseService';
import TripService from '../../services/TripService';
import UserService from '../../services/UserService';

import TCForm from './Tricount/TCForm';
import TCSales from './Tricount/TriSales';
import { TCRefund } from "./Tricount/TriRefund";

import DateUtilities from '../../utils/DateUtilities';

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
        this.refund = params.refund ?? false;
    }
}

export default function TripExpenses() {
    const { id } = useParams();
    const location = useLocation();
    
    const [tripInfo, setTripInfo] = useState(location.state?.trip);
    const [profileInfo, setProfileInfo] = useState(location.state?.profile);
    //const [userId, setUserId] = useState(location.state?.profile.id);
    //const [userId, setUserId] = useState(profileInfo?.id);


    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            const response = await TripService.getTrip(token, id);
            if (response) {
                setTripInfo(response);
            } else {
                navigate("/error");
                console.error('Invalid response data');
            }
        } catch (error) {
            navigate("/error");
            console.error('Error fetching trip info:', error);
        }
    }
    if (!tripInfo) {
        fetchTripInfo();
    }
    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await UserService.getProfile(token);

            if (response) {
                setProfileInfo(response);  // Aggiorniamo lo stato con le informazioni del profilo
                //setUserId(response.id);
                /*
                setUsers(response.list_participants.map(u => [
                    parseInt(u.id),  // Trasforma il primo elemento in intero
                    u.nickname    // Mantieni gli altri elementi invariati
                  ]));
                */
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };
    if (!profileInfo) {
        fetchProfileInfo();
    }
    


    const [users, setUsers] = useState(tripInfo?.list_participants.map(u => [
        parseInt(u.id),  // Trasforma il primo elemento in intero
        u.nickname    // Mantieni gli altri elementi invariati
      ]));

    const [data, setData] = useState([]);

    useEffect(() => {
        retrieveTricounts();
    }, []);

    const submit = async (newExpense, expenseId = -1) => {
        newExpense.refund = false;
        if (expenseId === -1) {
            const backExpenseId = await saveExpense(newExpense);
            createNewExpense(newExpense, backExpenseId);
        }
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
                const now = new Date();
                newData.sort((a, b) => Math.abs(b.date - now) - Math.abs(a.date - now));
                setData(newData);

                const token = localStorage.getItem('token');
                try {
                    const response = await ExpenseService.update(token, tripInfo.id, expenseId, newExpenseDto);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    const [activeText, setActiveText] = useState("list");
    const [formVisibility, setFormVisibility] = useState(true);
    const [formData, setFormData] = useState({
        expenseData: new ExpenseDto(),
        users: users,
        filled: false,
        status: 0,
        onSubmit: submit,
        onClose: () => setFormVisibility(false),
    });
    const itemsRefs = useRef([]);
    const [selected, setSelected] = useState(-1);
    const navigate = useNavigate();

    const retrieveTricounts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await ExpenseService.getExpenses(token, id);
            //const response = undefined
            if (response) {
                //console.log("E'arrivata una risposta", response);
                response.map(expense => [
                    expense.date = new Date(expense.date),
                ]);

                const now = new Date();
                response.sort((a, b) => Math.abs(b.date - now) - Math.abs(a.date - now));
                //console.log("E'arrivata una risposta", response);

                const retrievedOldUsers = [...users];

                response.forEach(expense => {
                    let retrievedUser = [expense.paidBy, expense.paidByNickname];
                
                    const alreadyRetrieved = retrievedOldUsers.some(user => user[0] === retrievedUser[0]);
                
                    if (!alreadyRetrieved) {
                        retrievedOldUsers.push(retrievedUser);
                    }
                
                    expense.amountPerUser.forEach(a => {
                        retrievedUser = [a.user, a.userNickname];
                
                        const alreadyRetrieved = retrievedOldUsers.some(user => user[0] === retrievedUser[0]);
                
                        if (!alreadyRetrieved) {
                            retrievedOldUsers.push(retrievedUser);
                        }
                    });
                });                
                
                setUsers(retrievedOldUsers);
                setData(response);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching expenses information:', error);
        }
    };


    const handleClick = (id) => {
        if (id === 'sales') {
            setFormData({
                expenseData: new ExpenseDto(),
                users: users,
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
            users: users,
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
                expenseData: new ExpenseDto(),
                users: users,
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

    function createNewExpense(newExpense, newId) {
        const newExpenseDto = new ExpenseDto(newExpense);
        newExpenseDto.id = newId;
        
        setData(prevData => {
            // Combina i dati precedenti con la nuova spesa
            const newData = [...prevData, newExpenseDto];
            const now = new Date();
            newData.sort((a, b) => Math.abs(b.date - now) - Math.abs(a.date - now));
            
            return newData;
        });
    }

    const saveExpense = async (newExpense) => {
        const token = localStorage.getItem('token');
        const {title, paidByNickname, paidBy, date, amount, amountPerUser, splitEven, refund} = newExpense;
        try {
            const response = await ExpenseService.create(token, tripInfo.id, title, paidByNickname, paidBy, date, amount, splitEven, amountPerUser, refund);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    
    const destroy = async (expenseId) => {
        const index = data.findIndex(expense => expense.id === expenseId);
        if (index >= 0) {
            const newData = [...data];
            newData.splice(index, 1);
            setData(newData);
        }

        const token = localStorage.getItem('token');
        try {
            const response = await ExpenseService.delete(token, tripInfo.id, expenseId);
        } catch (error) {
            console.log(error);
        }
    }

    const onRefund = async (newExpense) => {
        const backExpenseId = await saveExpense(newExpense);
        createNewExpense(newExpense, backExpenseId);
    }


    return (
        <div>
            {tripInfo && profileInfo &&
                <div className="trip-info">
                    <InternalMenu tripInfo={tripInfo} profileInfo={profileInfo}/>
                    <div className="trip-content">
                        <div className="trip-top">
                            <span> <strong>{tripInfo.title}:</strong> {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.startDate)} - {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.endDate)}</span>
                        </div>
                        <div className="tc-content">
                            <div className="tc-left">
                                <div className="tc-top">
                                    <div className={`tc-top-text ${activeText === "list" ? "active" : "inactive"}`}
                                        id="list" onClick={()=>handleClick("list")}>Expenses</div>
                                    <div className={`tc-top-text ${activeText === "sales" ? "active" : "inactive"}`}
                                        id="sales" onClick={()=>handleClick("sales")}>Balances</div>
                                </div>
                                {activeText === "list" &&
                                    <TCSales
                                        data={data}
                                        userId={profileInfo.id}
                                        formVisibility={formVisibility}
                                        handleSelection={handleTricountSelection}
                                        handleAdd={addSale}/>
                                }
                                {activeText === "sales" &&
                                    <TCRefund
                                        user={profileInfo.id}
                                        expenses={data}
                                        users={users}
                                        onRefund={onRefund}
                                    />
                                }
                            </div>
                            {formVisibility &&
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
                </div>
            }
        </div>
    )
}

