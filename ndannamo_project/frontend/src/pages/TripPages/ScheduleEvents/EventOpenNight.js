import React, {useEffect, useState} from 'react';
import Map from './Map';
import ScheduleService from '../../../services/ScheduleService';
import AttachmentService from "../../../services/AttachmentService";
import EventOpenDatePlace from './EventOpenDatePlace';
import '../TripSchedule.css';
import '../../../styles/Common.css';
import '../../../styles/Attachments.css'
import DataManipulationsUtils from "../../../utils/DataManipulationsUtils";

export default function EventOpenNight({
                                           night,
                                           latitude,
                                           longitude,
                                           reloadSchedule,
                                           openCreateAccomodationModal,
                                           openEditAccomodationModal,
                                           tripStartDate,
                                           tripEndDate
                                       }) {

    // Existing state management...
    const [attachments, setAttachments] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewType, setPreviewType] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Existing useEffect and functions...
    useEffect(() => {
        if (night.id) {
            loadAttachments();
        }
    }, [night.id]);

    const loadAttachments = async () => {
        try {
            const token = localStorage.getItem('token');
            const fetchedAttachments = await AttachmentService.getAttachments(token, night.id);
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
            const uploadedFiles = await AttachmentService.uploadFiles(token, selectedFiles);
            await AttachmentService.linkAttachmentsToAttachable(token, night.id, uploadedFiles);
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
            await AttachmentService.unlinkAttachment(token, night.id, attachment.id);
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

    // Rest of your existing component code...

    if (night.overnightStay == null) {
        return (
            <div id="event-open">
                <div className='top-row'>
                    <EventOpenDatePlace event={night} reloadSchedule={reloadSchedule} saveDateFunction={null}
                                        savePlaceFunction={ScheduleService.changeNightPlace}
                                        tripStartDate={tripStartDate} tripEndDate={tripEndDate}
                                        canEditDate={false}/>
                </div>
                <div className='no-selected-events flex-column align-items-center'>
                    <p>You don't have an accomodation for this night</p>
                    <button className='custom-button' onClick={() => {
                        openCreateAccomodationModal(night.id, night.date)
                    }}>Create
                    </button>
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
    } else if (overnightStay.startCheckInTime != null) {
        checkInTime = "From " + overnightStay.startCheckInTime
    } else if (overnightStay.endCheckInTime != null) {
        checkInTime = "Until " + overnightStay.endCheckInTime
    }

    if (overnightStay.startCheckOutTime != null && overnightStay.endCheckOutTime != null) {
        checkOutTime = overnightStay.startCheckOutTime + " - " + overnightStay.endCheckOutTime;
    } else if (overnightStay.startCheckOutTime != null) {
        checkOutTime = "From " + overnightStay.startCheckOutTime
    } else if (overnightStay.endCheckOutTime != null) {
        checkOutTime = "Until " + overnightStay.endCheckOutTime
    }

    return (
        // ... rest of your JSX remains the same until the attachments list
        <div id="event-open">
            <div className='top-row'>
                <button onClick={() => {
                    openEditAccomodationModal(night.id, overnightStay)
                }} title='Edit accomodation'
                        className='float-right no-background no-border top-row-button'><i
                    className="bi bi-pencil-fill h5 gray-icon"/></button>

                <EventOpenDatePlace event={night} reloadSchedule={reloadSchedule} saveDateFunction={null}
                                    savePlaceFunction={ScheduleService.changeNightPlace} tripStartDate={tripStartDate}
                                    tripEndDate={tripEndDate}
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
            </div>
            <PreviewModal/>
        </div>
    );
}