import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import './InternalMenu.css';
import TripService from "../../services/TripService";
import ConfirmDelete from "../../common/ConfirmDelete";

export default function InternalMenu({tripInfo, profileInfo}) {
    const navigate = useNavigate();
    const { id } = useParams(); // Ottieni l'ID dinamico dalla URL
    const location = useLocation();

    const [selectedOption, setSelectedOption] = useState(null);
    const [hoveredOption, setHoveredOption] = useState(null); // Stato per l'hover
    const [isModalOpen, setIsModalOpen] = useState(false);


    const options = [
        { id: "summary", icon: "bi bi-info-circle h3", label: "Summary", path: `/trips/${id}/summary` },
        { id: "schedule", icon: "bi bi-file-earmark-text h3", label: "Schedule", path: `/trips/${id}/schedule` },
        { id: "expenses", icon: "bi bi-currency-dollar h3", label: "Expenses", path: `/trips/${id}/expenses` },
        { id: "photos", icon: "bi bi-images h3", label: "Photos", path: `/trips/${id}/photos` },
        { id: "chat", icon: "bi bi-chat-left-text h3", label: "Messages", path: `/trips/${id}/chat` },
    ];

    useEffect(() => {

        const currentPath = location.pathname;
        const activeOption = options.find((option) => currentPath.includes(option.id));
        if (activeOption) {
            setSelectedOption(activeOption.id);
        }
    }, [location.pathname]);

    const handleNavigation = (optionId, path) => {
        setSelectedOption(optionId);
        navigate(path, { state: { trip: tripInfo, profile: profileInfo } });
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
                setIsModalOpen(false);
                navigate("/trips");
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    }



    return (
        <div>
            {tripInfo &&
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
                                message={tripInfo.creator ?
                                    "Do you really want to delete the trip \"" + tripInfo.title + "\"?"
                                    :
                                    "Do you really want to leave the trip \"" + tripInfo.title + "\"?"}
                                onConfirm={handleConfirm}
                                onClose={closeModal}/>
                        </div>
                    </div>
                )}
            </div>
            }
        </div>
        
    );
}