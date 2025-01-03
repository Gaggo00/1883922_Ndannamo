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

export default function InternalMenu() {
    const navigate = useNavigate();
    const { id } = useParams(); // Ottieni l'ID dinamico dalla URL
    const location = useLocation(); // Ottieni la URL corrente
    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null); // Stato per l'hover
    const [tripInfo, setTripInfo] = useState({
        id: '',
        title: '',
        locations: [],
        creationDate: '',
        startDate: '',
        endDate: '',
        createdBy: '',
        list_participants: [],
        creator: '',
    });

    const options = [
        { id: "summary", icon: information_icon, label: "Summary", path: `/trips/${id}/summary` },
        { id: "schedule", icon: schedule_icon, label: "Schedule", path: `/trips/${id}/schedule` },
        { id: "expenses", icon: coin_icon, label: "Expenses", path: `/trips/${id}/expenses` },
        { id: "photos", icon: image_icon, label: "Photos", path: `/trips/${id}/photos` },
        { id: "tickets", icon: ticket_icon, label: "Ticket", path: `/trips/${id}/tickets` },
        { id: "chat", icon: message_icon, label: "Message", path: `/trips/${id}/chat` },
    ];

    useEffect(() => {
        fetchTripInfo();
    }, []);

    useEffect(() => {
        const currentPath = location.pathname;
        const activeOption = options.find((option) => currentPath.includes(option.id));
        if (activeOption) {
            setSelectedOption(activeOption.id);
        }
    }, [location.pathname, options]);

    const handleNavigation = (optionId, path) => {
        setSelectedOption(optionId);
        //navigate(path);
        navigate(path, { state: { trip: tripInfo } });
    };

    const handleMouseEnter = (optionId) => {
        setHoveredOption(optionId);
    };

    const handleMouseLeave = () => {
        setHoveredOption(null);
    };
    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            const response = await TripService.getTrip(id, token);

            if (response) {
                setTripInfo(response);

            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

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
                    <img src={option.icon} alt={`${option.id}-icon`} />
                    {(selectedOption === option.id || hoveredOption === option.id) && <p>{option.label}</p>}
                </div>
            ))}
        </div>
    );
}