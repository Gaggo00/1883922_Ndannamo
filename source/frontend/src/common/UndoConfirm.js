import React from 'react';
import "../pages/TripPages/Summary/TripSummary.css"

const UndoConfirm = ({onConfirm, onUndo }) => {



    return (
        <div className="undo-change">
            <i id="editable" onClick={onUndo} className="bi bi-x h3"></i>
            <i id="editable" onClick={onConfirm} className="bi bi-check2 h3"></i>
        </div>
    );
};

export default UndoConfirm;
