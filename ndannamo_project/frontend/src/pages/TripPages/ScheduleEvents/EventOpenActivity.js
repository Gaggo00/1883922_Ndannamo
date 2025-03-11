import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import Map from './Map';
import DateUtilities from '../../../utils/DateUtilities';

import ScheduleService from '../../../services/ScheduleService';
import CityService from '../../../services/CityService';
import ConfirmDelete from '../../../common/ConfirmDelete';

import EventOpenDatePlace from './EventOpenDatePlace';
import { DateField } from '../../../components/Fields/Fields';

import '../TripSchedule.css'
import '../../../styles/Attachments.css'
import '../../../styles/Common.css';
import AttachmentService from "../../../services/AttachmentService";
import DataManipulationsUtils from "../../../utils/DataManipulationsUtils";

export default function EventOpenActivity({activity, latitude, longitude, reloadSchedule, tripStartDate, tripEndDate}) {

    // Questi parametri devono essere gli stessi anche nel backend, dentro EventValidation.java
    const TITLE_MAX_CHARACTERS = 30;
    const ADDRESS_MAX_CHARACTERS = 60;
    const INFO_MAX_CHARACTERS = 500;

    const [attachments, setAttachments] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const navigate = useNavigate();

    // Per il pop up di conferma
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (activity.id) {
            loadAttachments();
        }
    }, [activity.id]);

    const handleOverlayClick = (e) => {
        // Verifica se l'utente ha cliccato sull'overlay e non sul contenuto del modal
        if (e.target.className === "modal-overlay") {
            setIsModalOpen(false);
        }
    };


    // Per eliminare l'activity
    const deleteActivity = async () => {
        // disabilita pulsante per eliminare, altrimenti uno puo' ri-cliccarlo mentre gia' sta eliminando
        document.getElementById("delete-button").disabled = true;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            
            const response = await ScheduleService.deleteActivity(token, activity.tripId, activity.id);

            if (response) {
                // Ricarica la schedule a sinistra
                reloadSchedule(null, true, true);
            } else {
                console.error('Invalid response data');
                document.getElementById("delete-button").disabled = false;  // se non sei riuscito a eliminare l'attivita' ri-abilita il pulsante
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
            document.getElementById("delete-button").disabled = false;  // se non sei riuscito a eliminare l'attivita' ri-abilita il pulsante
        }
    }



    // Per modificare nome attivita'
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState(activity.name);


    const saveNewName = async () => {
  
        // Se il titolo e' una stringa vuota o e' uguale a prima, non fare nulla
        if (newName.trim() === "" || activity.name === newName) {
            setEditingName(false);
            return;
        }

        // manda richiesta al server
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
    
            // cambia nome nel backend
            const response = await ScheduleService.changeActivityName(token, activity.tripId, activity.id, newName);
    
            if (response) {
                // aggiorna in locale
                activity.name = newName;
                setEditingName(false);
        
                // ricarica la schedule a sinistra
                reloadSchedule(null, false, false);
            }
            else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error modifying title:', error);
            alert("Couldn't modify title: " + error.message);
        }
    }


    // Per modificare indirizzo
    const [editingAddress, setEditingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState(activity.address);


    const saveNewAddress = async () => {
    
        // Se e' una stringa vuota o e' uguale a prima, non fare nulla
        if (newAddress.trim() === "" || activity.address === newAddress) {
            setEditingAddress(false);
            return;
        }

        // manda richiesta al server
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
    
            // cambia nome nel backend
            const response = await ScheduleService.changeActivityAddress(token, activity.tripId, activity.id, newAddress);
    
            if (response) {
                // aggiorna in locale
                activity.address = newAddress;
                setEditingAddress(false);
        
                // ricarica la schedule a sinistra
                reloadSchedule(null, false, false);
            }
            else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error modifying address:', error);
            alert("Couldn't modify address: " + error.message);
        }
    }



    // Per modificare l'orario
    const getEndTime = () => {
        if (activity.endTime != null) return activity.endTime;
        return activity.startTime;
    }
    const [editingTime, setEditingTime] = useState(false);
    const [newStartTime, setNewStartTime] = useState(activity.startTime);
    const [newEndTime, setNewEndTime] = useState(getEndTime());


    const saveNewTime = async () => {

        // Se e' tutto uguale a prima, non fare nulla
        if (newStartTime === activity.startTime && newEndTime === activity.endTime) {
            setEditingTime(false);
            return;
        }

        // manda richiesta al server
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
    
            // cambia nome nel backend
            const response = await ScheduleService.changeActivityTime(token, activity.tripId, activity.id, newStartTime, newEndTime);

            if (response) {
                // aggiorna in locale
                activity.startTime = newStartTime;
                activity.endTime = newEndTime;
                setEditingTime(false);
        
                // ricarica la schedule a sinistra
                reloadSchedule(null, false, true);
            }
            else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error modifying start time:', error);
            alert("Couldn't modify start time: " + error.message);
        }
    }



    // Per modificare info
    const [editingInfo, setEditingInfo] = useState(false);
    const [newInfo, setNewInfo] = useState(activity.info);

    const saveNewInfo = async () => {
        // se non è cambiato niente, non fare nulla
        if (activity.info === newInfo) {
            setEditingInfo(false);
            return;
        }

        try {
            // manda richiesta al server
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // cambia le info nel backend
            const response = await ScheduleService.changeActivityInfo(token, activity.tripId, activity.id, newInfo);

            if (response) {
                // aggiorna in locale
                activity.info = newInfo;
                setEditingInfo(false);

                // ricarica la schedule a sinistra
                reloadSchedule(null, false, false);
            } 
            else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error modifying info:', error);
            alert("Couldn't modify info: " + error.message);
        }
    }



    /********* Roba condivisa da tutte le funzioni di editing di un campo *********/

    // Per quando scrivi qualcosa in un campo editabile
    const handleInputChange = (event, allowWhiteSpaces, maxCharacters, setFunction) => {
        var input = event.target.value;

        if (!allowWhiteSpaces) {
            input = input.replaceAll(" ", "");
        }
        
        // Limita numero di caratteri
        input = input.substring(0, maxCharacters);
        
        if (setFunction) {
            setFunction(input);
        }
    }

    // Per quando stai modificando qualcosa e premi invio
    const handleKeyDown = (e, saveFunction) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveFunction();
        }
    };

    // ATTACHMENTS ---------------------------------

    const loadAttachments = async () => {
        try {
            const token = localStorage.getItem('token');
            const fetchedAttachments = await AttachmentService.getAttachments(token, activity.id);
            setAttachments(fetchedAttachments);
        } catch (error) {
            console.error("Error loading attachments:", error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files));
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        try {
            const token = localStorage.getItem('token');
            const uploadedFiles = await AttachmentService.uploadFiles(token, selectedFiles, activity.tripId);
            await AttachmentService.linkAttachmentsToAttachable(token, activity.id, uploadedFiles);
            await loadAttachments();
            setSelectedFiles([]);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    // New functions for unlink and delete
    const handleUnlink = async (attachment) => {
        try {
            const token = localStorage.getItem('token');
            await AttachmentService.unlinkAttachment(token, activity.id, attachment.id);
            // Generic function - to be implemented
            console.log("Unlinking attachment:", attachment.id);
            // After unlinking, reload the attachments
            await loadAttachments();
        } catch (error) {
            console.error("Error unlinking attachment:", error);
        }
    };

    const handleDelete = async (attachment) => {
        try {
            const token = localStorage.getItem('token');
            await AttachmentService.deleteAttachment(token, attachment.id);
            // Generic function - to be implemented
            console.log("Deleting attachment:", attachment.id);
            // After deleting, reload the attachments
            await loadAttachments();
        } catch (error) {
            console.error("Error deleting attachment:", error);
        }
    };

    // Existing preview and download functions...
    const handleFilePreview = async (attachment) => {
        try {
            const token = localStorage.getItem('token');
            const response = await AttachmentService.getAttachmentData(token, attachment.url);

            const byteArray = DataManipulationsUtils.convertBase64ToBitArray(response.fileData);

            const blob = new Blob([byteArray], {type: response.fileType});
            const fileType = blob.type;
            const url = URL.createObjectURL(blob);

            setPreviewType(fileType);
            setPreviewUrl(url);
            setShowPreviewModal(true);
        } catch (error) {
            console.error("Error previewing file:", error);
        }
    };

    const handleFileDownload = async (attachment) => {
        try {
            const token = localStorage.getItem('token');
            const response = await AttachmentService.getAttachmentData(token, attachment.url);
            const byteArray = DataManipulationsUtils.convertBase64ToBitArray(response.fileData);
            const blob = new Blob([byteArray], {type: response.fileType});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = attachment.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    // Preview Modal Component
    // Modifica il componente PreviewModal per aggiungere un pulsante di apertura in nuova scheda
    const PreviewModal = () => {
        if (!showPreviewModal) return null;

        const openInNewTab = () => {
            window.open(previewUrl, '_blank');
        };

        return (
            <div className="preview-modal">
                <div className="preview-modal-content">
                    <div className="preview-modal-controls">
                        <button
                            className="preview-modal-close"
                            onClick={() => {
                                setShowPreviewModal(false);
                                URL.revokeObjectURL(previewUrl);
                            }}
                        >
                            ×
                        </button>
                        <button
                            className="open-new-tab-button"
                            onClick={openInNewTab}
                            title="Open in new tab"
                        >
                            <i className="bi bi-box-arrow-up-right"></i>
                        </button>
                    </div>
                    {previewType?.startsWith('image/') ? (
                        <div className="preview-container">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="preview-image"
                                onClick={openInNewTab}
                                style={{cursor: 'pointer'}}
                            />
                        </div>
                    ) : previewType?.startsWith('application/pdf') ? (
                        <div className="preview-container">
                            <iframe
                                src={previewUrl}
                                title="PDF Preview"
                                className="preview-pdf"
                            />
                            <div
                                className="preview-overlay"
                                onClick={openInNewTab}
                                title="Click to open in new tab"
                            ></div>
                        </div>
                    ) : (
                        <div className="preview-not-available">
                            <p>Preview not available for this file type</p>
                            <button
                                className="custom-button"
                                onClick={openInNewTab}
                            >
                                Open in new tab
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    


    return (
        <div id="event-open">
            <div className='top-row'>
                {/* Pulsante per eliminare l'activity */}
                <button onClick={()=>{setIsModalOpen(true);}} id="delete-button" title='Delete activity' className='float-right no-background no-border top-row-button'>
                    <i className="bi bi-trash3-fill h5 red-icon"/>
                </button>
                
                <EventOpenDatePlace event={activity} reloadSchedule={reloadSchedule} saveDateFunction={ScheduleService.changeActivityDate}
                savePlaceFunction={ScheduleService.changeActivityPlace} tripStartDate={tripStartDate} tripEndDate={tripEndDate}
                canEditDate={true}/>
                
                {!editingName ? (
                    <div className='title hidden-btn-parent'>
                        {/* Titolo */}
                        <div id="activity-name">
                            {activity.name}
                        </div>
                        {/* Pulsante per modificare il titolo */}
                        <button onClick={() => {setNewName(activity.name);setEditingName(true);}} title='Edit name'
                        className='no-background no-border flex-row align-items-center hidden-btn'>
                            <i className="bi bi-pencil-fill h5 gray-icon spaced margin-bottom"/>
                        </button>
                    </div>
                ) : (
                    <div className='title'>
                        {/* Campo editabile dove modificare il titolo */}
                        <input type="text" 
                            className="edit-title-input"
                            value={newName}
                            onChange={(e) => {handleInputChange(e, true, TITLE_MAX_CHARACTERS, setNewName);}}
                            onKeyDown={(e) => {handleKeyDown(e, saveNewName);}}/>
                        {/* Pulsante per salvare il titolo */}
                        <button onClick={saveNewName} title='Save' className='no-background no-border flex-row align-items-center'>
                            <i className="bi bi-floppy-fill h5 gray-icon spaced margin-bottom"/>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="map-banner">
                <Map latitude={latitude} longitude={longitude} message={activity.address}/>
            </div>

            <div className='event-info'>
                <div className='event-info-top-row'>
                    {/* Address */}
                    <div className='row-element hidden-btn-parent'>
                        <div className='flex-row align-items-center'>
                            <div className='label'>Address</div>
                            {!editingAddress ? (
                                <button onClick={() => {setNewAddress(activity.address);setEditingAddress(true);}} title='Edit address'
                                className='no-background no-border flex-column hidden-btn'>
                                    <i className="bi bi-pencil-fill gray-icon spaced"/>
                                </button>
                            ) : (
                                <button onClick={saveNewAddress} title='Save' className='no-background no-border flex-column'>
                                    <i className="bi bi-floppy-fill gray-icon spaced"/>
                                </button>
                            )}
                        </div>
                        <div className='address'>
                            {!editingAddress ? (
                                <div className='value'>{activity.address}</div>
                            ) : (
                                <input type="text" 
                                    className="value edit-address-input"
                                    value={newAddress}
                                    onChange={(e) => {handleInputChange(e, true, ADDRESS_MAX_CHARACTERS, setNewAddress);}}
                                    onKeyDown={(e) => {handleKeyDown(e, saveNewAddress);}}/>
                            )}
                        </div>
                    </div>
                    {/* Start time */}
                    <div className='row-element hidden-btn-parent'>
                        <div className='flex-row align-items-center'>
                            <div className='label'>Time</div>
                            {!editingTime ? (
                                <button onClick={() => {setNewStartTime(activity.startTime);setEditingTime(true);}} title='Edit time'
                                className='no-background no-border flex-column hidden-btn'>
                                    <i className="bi bi-pencil-fill gray-icon spaced"/>
                                </button>
                            ) : (
                                <button onClick={saveNewTime} title='Save' className='no-background no-border flex-column'>
                                    <i className="bi bi-floppy-fill gray-icon spaced"/>
                                </button>
                            )}
                        </div>
                        {!editingTime ? (
                            <div className='value'>{activity.startTime}</div>
                        ) : (
                            <input type="time" 
                                className="value edit-time-input"
                                value={newStartTime}
                                onChange={(e) => {handleInputChange(e, false, 10, setNewStartTime);}}
                                onKeyDown={(e) => {handleKeyDown(e, saveNewTime);}}/>
                        )}
                    </div>
                    {/* End time */}
                    <div className='row-element hidden-btn-parent'>
                        <div className='flex-row align-items-center'>
                            <div className='label'>End</div>
                            {!editingTime ? (
                                <button onClick={() => {setNewEndTime(activity.endTime);setEditingTime(true);}} title='Edit time'
                                className='no-background no-border flex-column hidden-btn'>
                                    <i className="bi bi-pencil-fill gray-icon spaced"/>
                                </button>
                            ) : (
                                <button onClick={saveNewTime} title='Save' className='no-background no-border flex-column'>
                                    <i className="bi bi-floppy-fill gray-icon spaced"/>
                                </button>
                            )}
                        </div>
                        {!editingTime ? (
                            <div className='value'>{activity.endTime}</div>
                        ) : (
                            <input type="time" 
                                className="value edit-time-input"
                                value={newEndTime}
                                onChange={(e) => {handleInputChange(e, false, 10, setNewEndTime);}}
                                onKeyDown={(e) => {handleKeyDown(e, saveNewTime);}}/>
                        )}
                    </div>
                    <div className='row-element'>
                        <div className='label'>Weather</div>
                        <div className='value'>Not available</div>
                    </div>
                </div>

                {!editingInfo ? (
                    <div className='event-info-other hidden-btn-parent'>
                        {/* Pulsante per modificare le info */}
                        <button onClick={() => {setNewInfo(activity.info);setEditingInfo(true);}} title='Edit info' className='float-right no-background no-border hidden-btn'>
                            <i className="bi bi-pencil-fill gray-icon"></i>
                        </button>
                        {/* Info */}
                        <div className='info-content'>{activity.info}</div>
                    </div>
                ) : (
                    <div className='event-info-other'>
                        {/* Campo editabile dove modificare le info */}
                        <textarea 
                            className="edit-info-input"
                            value={newInfo}
                            onChange={(e) => {handleInputChange(e, true, INFO_MAX_CHARACTERS, setNewInfo);}}
                            onKeyDown={(e) => {handleKeyDown(e, saveNewInfo);}}/>
                        {/* Pulsante per salvare le info */}
                        <button onClick={saveNewInfo} title='Save' className='float-right no-background no-border'>
                            <i className="bi bi-floppy-fill gray-icon"></i>
                        </button>
                    </div>
                )}

                <div className="attachments">
                    <div className="label">Attachments</div>
                    <div className="attachment-controls">
                        <label className="custom-file-upload">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                multiple
                                className="file-input-hidden"
                            />
                            <i className="bi bi-upload"></i> Select Files
                        </label>
                        <button
                            onClick={handleUpload}
                            className="custom-button"
                            disabled={selectedFiles.length === 0}
                        >
                            Upload Attachment
                        </button>
                    </div>
                    <div className="value">
                        {selectedFiles.length > 0 && (
                            <div className="selected-files">
                                <span>{selectedFiles.length} file(s) selected</span>
                            </div>
                        )}
                        {attachments.length > 0 ? (
                            <ul className="attachment-list">
                                {attachments.map((attachment) => (
                                    <li key={attachment.id} className="attachment-item">
                                        <span
                                            className="attachment-name"
                                            onClick={() => handleFilePreview(attachment)}
                                        >
                                            {attachment.name}
                                        </span>
                                        <button
                                            className="action-button"
                                            onClick={() => handleFileDownload(attachment)}
                                            title="Download file"
                                        >
                                            <i className="bi bi-download"></i>
                                        </button>
                                        <button
                                            className="action-button"
                                            onClick={() => handleUnlink(attachment)}
                                            title="Unlink attachment"
                                        >
                                            <i className="bi bi-link-45deg"></i>
                                        </button>
                                        <button
                                            className="action-button"
                                            onClick={() => handleDelete(attachment)}
                                            title="Delete attachment"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No attachments available</p>
                        )}
                    </div>
                </div>
                {isModalOpen && (
                    <div className="modal-overlay" onClick={handleOverlayClick}>
                        <div className="trip-box">
                            <ConfirmDelete
                                message={"Do you really want to delete activity \"" + activity.name + "\"?"}
                                onConfirm={deleteActivity}
                                onClose={()=>{setIsModalOpen(false);}}/>
                        </div>
                    </div>
                )} 
            </div>
            <PreviewModal/>
        </div>
    );

}