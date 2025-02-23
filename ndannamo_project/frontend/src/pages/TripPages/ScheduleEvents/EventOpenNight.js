import React, {useEffect, useState} from 'react';
import Map from './Map';
import ScheduleService from '../../../services/ScheduleService';
import AttachmentService from "../../../services/AttachmentService";
import EventOpenDatePlace from './EventOpenDatePlace';
import '../TripSchedule.css';
import '../../../styles/Common.css';
import DataManipulationsUtils from "../../../utils/DataManipulationsUtils";

export default function EventOpenNight({night, latitude, longitude, reloadSchedule, openCreateAccomodationModal, openEditAccomodationModal,
                                           tripStartDate, tripEndDate}) {

    // Add state for attachments and selected files
    const [attachments, setAttachments] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Load attachments when component mounts or night changes
    useEffect(() => {
        if (night.id) {
            loadAttachments();
        }
    }, [night.id]);

    // Function to load attachments
    const loadAttachments = async () => {
        try {
            const token = localStorage.getItem('token');
            const fetchedAttachments = await AttachmentService.getEventAttachments(token, night.id);
            setAttachments(fetchedAttachments);
        } catch (error) {
            console.error("Error loading attachments:", error);
        }
    };

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files));
    };

    // Handle file upload
    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;

        try {
            const token = localStorage.getItem('token');
            const uploadedFiles = await AttachmentService.uploadFiles(token, selectedFiles);
            await AttachmentService.linkAttachmentsToEvent(token, night.id, uploadedFiles);
            await loadAttachments();
            setSelectedFiles([]);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    // Function to handle file preview
    const handleFilePreview = async (attachment) => {
        try {
            const token = localStorage.getItem('token');
            const response = await AttachmentService.getEventAttachmentData(token, attachment.url);

            const byteArray = DataManipulationsUtils.convertBase64ToBitArray(response.fileData);

            const blob = new Blob([byteArray], { type: response.fileType });
            const fileType = blob.type;
            const url = URL.createObjectURL(blob);

            setPreviewType(fileType);
            setPreviewUrl(url);
            setShowPreviewModal(true);
        } catch (error) {
            console.error("Error previewing file:", error);
        }
    };

    // Function to handle file download
    const handleFileDownload = async (attachment) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(attachment.url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const blob = await response.blob();
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
    const PreviewModal = () => {
        if (!showPreviewModal) return null;

        return (
            <div className="preview-modal">
                <div className="preview-modal-content">
                    <button
                        className="preview-modal-close"
                        onClick={() => {
                            setShowPreviewModal(false);
                            URL.revokeObjectURL(previewUrl);
                        }}
                    >
                        ×
                    </button>
                    {previewType?.startsWith('image/') ? (
                        <img src={previewUrl} alt="Preview" className="preview-image" />
                    ) : previewType?.startsWith('application/pdf') ? (
                        <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            className="preview-pdf"
                        />
                    ) : (
                        <div className="preview-not-available">
                            Preview not available for this file type
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Rest of your existing component code...

    if (night.overnightStay == null) {
        return (
            <div id="event-open">
                <div className='top-row'>
                    <EventOpenDatePlace event={night} reloadSchedule={reloadSchedule} saveDateFunction={null}
                                        savePlaceFunction={ScheduleService.changeNightPlace} tripStartDate={tripStartDate} tripEndDate={tripEndDate}
                                        canEditDate={false}/>
                </div>
                <div className='no-selected-events flex-column align-items-center'>
                    <p>You don't have an accomodation for this night</p>
                    <button className='custom-button' onClick={()=> {openCreateAccomodationModal(night.id, night.date)}}>Create</button>
                </div>
            </div>
        );
    }

    // Your existing code for overnight stay...
    const overnightStay = night.overnightStay;

    // Your existing code for check-in and check-out times...
    var checkInTime = "";
    var checkOutTime = "";

    if (overnightStay.startCheckInTime != null && overnightStay.endCheckInTime != null) {
        checkInTime = overnightStay.startCheckInTime + " - " + overnightStay.endCheckInTime;
    }
    else if (overnightStay.startCheckInTime != null) {
        checkInTime = "From " + overnightStay.startCheckInTime
    }
    else if (overnightStay.endCheckInTime != null) {
        checkInTime = "Until " + overnightStay.endCheckInTime
    }

    if (overnightStay.startCheckOutTime != null && overnightStay.endCheckOutTime != null) {
        checkOutTime = overnightStay.startCheckOutTime + " - " + overnightStay.endCheckOutTime;
    }
    else if (overnightStay.startCheckOutTime != null) {
        checkOutTime = "From " + overnightStay.startCheckOutTime
    }
    else if (overnightStay.endCheckOutTime != null) {
        checkOutTime = "Until " + overnightStay.endCheckOutTime
    }

    return (
        <div id="event-open">
            <div className='top-row'>
                <button onClick={()=>{openEditAccomodationModal(night.id, overnightStay)}} title='Edit accomodation'
                        className='float-right no-background no-border top-row-button'><i className="bi bi-pencil-fill h5 gray-icon"/></button>

                <EventOpenDatePlace event={night} reloadSchedule={reloadSchedule} saveDateFunction={null}
                                    savePlaceFunction={ScheduleService.changeNightPlace} tripStartDate={tripStartDate} tripEndDate={tripEndDate}
                                    canEditDate={false}/>

                <div className='title'>
                    Stay at "{overnightStay.name}"
                </div>
            </div>

            <div className="map-banner">
                <Map latitude={latitude} longitude={longitude} message={"Accomodation"}/>
            </div>

            <div className='event-info'>
                <div className='event-info-top-row'>
                    <div className='row-element'>
                        <div className='label'>Address</div>
                        <div className='value'>
                            {overnightStay.address}
                        </div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>Check-in</div>
                        <div className='value'>
                            {checkInTime}
                        </div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>Check-out</div>
                        <div className='value'>
                            {checkOutTime}
                        </div>
                    </div>
                    <div className='row-element'>
                        <div className='label'>Contacts</div>
                        <div className='value'>
                            {overnightStay.contact}
                        </div>
                    </div>
                </div>
                <div className="attachments">
                    <div className="label">Attachments</div>
                    <div className="attachment-controls">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            multiple
                            className="custom-file-input"
                        />
                        <button
                            onClick={handleUpload}
                            className="custom-button"
                            disabled={selectedFiles.length === 0}
                        >
                            Upload Attachment
                        </button>
                    </div>
                    <div className="value">
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
                                            className="download-button"
                                            onClick={() => handleFileDownload(attachment)}
                                            title="Download file"
                                        >
                                            <i className="bi bi-download"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No attachments available</p>
                        )}
                    </div>
                </div>
            </div>
            <PreviewModal />
        </div>
    );
}