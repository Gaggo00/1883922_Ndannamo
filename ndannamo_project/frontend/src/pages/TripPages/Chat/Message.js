import React from 'react';

const Message = ({ date, nickname, body, senderId, receiverId }) => {
  // Formatta la data in un formato leggibile
  const formattedDate = new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Condizione per determinare se mostrare il nickname o meno
  const isSender = senderId === receiverId;

  return (
    <div className="ch-message-container" style={{alignSelf: isSender ? 'flex-end' : 'flex-start'}}>
      {/* Se l'ID del mittente è diverso da quello del destinatario, mostra il nickname */}
      {!isSender && (
        <div className="ch-message-nickname">
          {nickname}
        </div>
      )}

      {/* Corpo del messaggio */}
      <div className="ch-message-body">
        {body}
      </div>

      {/* Ora del messaggio */}
      <div className="ch-message-time">
        {formattedDate}
      </div>
    </div>
  );
};

export default Message;