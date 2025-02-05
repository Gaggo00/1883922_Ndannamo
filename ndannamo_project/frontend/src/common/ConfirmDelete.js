import React from 'react';
import './ConfirmDelete.css'


const ConfirmDelete = ({message, onConfirm, onClose }) => {



    return (
        <div className="confirmDelete">
            <div className="confirmDelete-box">
                <p><strong>{message}</strong></p>
                <div className="buttons">
                    <button id="yes" onClick={onConfirm}>Yes</button>
                    <button id="no" onClick={onClose}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;
