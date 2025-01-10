import React from 'react';
import './ConfirmDelete.css'


const ConfirmDelete = ({onConfirm, onClose }) => {



    return (
        <div className="confirmDelete">
            <div className="confirmDelete-box">
                <p>Are you sure?</p>
                <div className="buttons">
                    <button id="yes" onClick={onConfirm}>yes</button>
                    <button id="no" onClick={onClose}>no</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;
