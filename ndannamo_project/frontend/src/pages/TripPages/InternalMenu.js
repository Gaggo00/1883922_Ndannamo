import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ticket_icon from "../../static/svg/icons/ticket_icon.svg";
import schedule_icon from "../../static/svg/icons/file_icon.svg";
import image_icon from "../../static/svg/icons/image_icon.svg";
import information_icon from "../../static/svg/icons/information_icon.svg";
import coin_icon from "../../static/svg/icons/coin_icon.svg";
import message_icon from "../../static/svg/icons/message_icon.svg";
import './InternalMenu.css';
import TripService from "../../services/TripService";
import MultiStepForm from "../../components/TripCreationForm/MultiStepForm";
import ConfirmDelete from "../../common/ConfirmDelete";
import ScheduleService from "../../services/ScheduleService";

export default function InternalMenu() {
    const navigate = useNavigate();
    const { id } = useParams(); // Ottieni l'ID dinamico dalla URL
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null); // Stato per l'hover
    const [isModalOpen, setIsModalOpen] = useState(false);


    const options = [
        /*
        { id: "summary", icon: information_icon, label: "Summary", path: `/trips/${id}/summary` },
        { id: "schedule", icon: schedule_icon, label: "Schedule", path: `/trips/${id}/schedule` },
        { id: "expenses", icon: coin_icon, label: "Expenses", path: `/trips/${id}/expenses` },
        { id: "photos", icon: image_icon, label: "Photos", path: `/trips/${id}/photos` },
        { id: "tickets", icon: ticket_icon, label: "Ticket", path: `/trips/${id}/tickets` },
        { id: "chat", icon: message_icon, label: "Message", path: `/trips/${id}/chat` },
        */
        { id: "summary", icon: "bi bi-info-circle h3", label: "Summary", path: `/trips/${id}/summary` },
        { id: "schedule", icon: "bi bi-file-earmark-text h3", label: "Schedule", path: `/trips/${id}/schedule` },
        { id: "expenses", icon: "bi bi-currency-dollar h3", label: "Expenses", path: `/trips/${id}/expenses` },
        { id: "photos", icon: "bi bi-images h3", label: "Photos", path: `/trips/${id}/photos` },
        { id: "tickets", icon: "bi bi-ticket-perforated h3", label: "Tickets", path: `/trips/${id}/tickets` },
        { id: "chat", icon: "bi bi-chat-left-text h3", label: "Messages", path: `/trips/${id}/chat` },
    ];

    useEffect(() => {

        const currentPath = location.pathname;
        const activeOption = options.find((option) => currentPath.includes(option.id));
        if (activeOption) {
            setSelectedOption(activeOption.id);
        }
    }, [location.pathname, options]);

    const handleNavigation = (optionId, path) => {
        setSelectedOption(optionId);
        navigate(path, { state: { trip: tripInfo } });
    };

    const handleMouseEnter = (optionId) => {
        setHoveredOption(optionId);
    };

    const handleMouseLeave = () => {
        setHoveredOption(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleExit = () =>{
        setIsModalOpen(true);
    }
    const handleConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            let response;
            if (tripInfo.creator) {
                response = await TripService.deleteTrip(token, tripInfo.id);
            } else {
                response = await TripService.leaveTrip(token, tripInfo.id);
            }

            if (response) {
                setIsModalOpen(false)
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    }



    return (
        <div className="internal-menu">
            {options.map((option) => (
                <div
                    key={option.id}
                    className={`internal-option ${selectedOption === option.id ? "selected" : ""}`}
                    onClick={() => handleNavigation(option.id, option.path)}
                    onMouseEnter={() => handleMouseEnter(option.id)}
                    onMouseLeave={handleMouseLeave}
                >
                    <i className={option.icon}/>
                    {(selectedOption === option.id || hoveredOption === option.id) && <p>{option.label}</p>}
                </div>
            ))}
            {tripInfo.creator &&
                <div
                className={'internal-option'} id={"exit"}
                onMouseEnter={()=> handleMouseEnter("delete")}
                onClick={() => handleExit("delete")}
                onMouseLeave={handleMouseLeave}
                >
                <i className="bi bi-trash3 h3"></i>
                {hoveredOption === "delete" && <p>Delete trip</p>}
            </div>}
            {!tripInfo.creator &&
                <div
                    className={'internal-option'} id={"exit"}
                    onMouseEnter={() => handleMouseEnter("leave")}
                    onClick={() => handleExit("leave")}
                    onMouseLeave={handleMouseLeave}>
                <i className="bi bi-box-arrow-right h3"></i>
                {hoveredOption === "leave" && <p>Leave trip</p>}
            </div>}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="trip-box">
                        <ConfirmDelete
                            onConfirm={handleConfirm}
                            onClose={closeModal}/>
                    </div>
                </div>
            )}
        </div>

    );
}