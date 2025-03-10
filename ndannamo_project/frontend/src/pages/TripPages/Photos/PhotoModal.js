import React, { useState, useEffect } from 'react';
//import { useLocation, useNavigate, useParams } from 'react-router-dom';

import DateUtilities from '../../../utils/DateUtilities';

import ConfirmDelete from '../../../common/ConfirmDelete';

import "../TripPhotos.css"


export default function PhotoModal({photoUrl, photoInfo, deletePhoto}) {

    /*

    NOTA: photoInfo e' cosi':

        "id": -1,
        "name": "",
        "type": "",
        "uploadDate": null,
        "tripId": -1,
        "uploadedBy": {
            "id": -1,
            "nickname": "",
            "email": ""
        },
        "description": "",
        "imageData":""

    */

    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    
    function openDeletePopup() {
        document.getElementById("photo-modal").classList.add("darker");
        setIsDeletePopupOpen(true);
    }
    function closeDeletePopup() {
        document.getElementById("photo-modal").classList.remove("darker");
        setIsDeletePopupOpen(false);
    }

    var uploadDate = DateUtilities.date_To_ddmmyy(new Date(photoInfo.uploadDate), "/");


    return (
        <div className=''>
            <div id="photo-modal" className="photo-modal">
                <div className='flex-row justify-content-space-between photo-modal-top-bar'>
                    <div className='photo-name'>{photoInfo.name}</div>
                    
                    <button onClick={openDeletePopup} id="delete-button" title='Delete activity' className='no-background no-border'>
                        <i className="bi bi-trash3-fill h5 red-icon"/>
                    </button>
                </div>
                <img className="" src={photoUrl}/>
                <div className='photo-modal-bottom-bar'>
                    <div className='photo-modal-info-row flex-row justify-content-space-between'>
                        <div className='photo-uploaded-by'><i>Uploaded by {photoInfo.uploadedBy.nickname}</i></div>
                        <div className='photo-uploaded-date'><i>{uploadDate}</i></div> 
                    </div>
                </div>
                {isDeletePopupOpen && (
                    <div id="dark-overlay">
                    </div>
                )}
            </div>
            {isDeletePopupOpen && (
                <div className="confirm-delete-photo">
                    <ConfirmDelete
                        message={"Do you really want to delete photo \"" + photoInfo.name + "\"?"}
                        onConfirm={() => {deletePhoto(photoInfo.id);}}
                        onClose={closeDeletePopup}/>
                </div>
            )} 
        </div>
        
    );
}



