import React, { useState, useEffect } from 'react';
import WebSocketService from './WebSocketService';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        WebSocketService.connect((msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
    }, []);

    const handleSendMessage = () => {
        if (message.trim() && username.trim()) {
            const chatMessage = {
                sender: username,
                content: message,
                type: 'CHAT'
            };
            WebSocketService.sendMessage(chatMessage);
            setMessage('');
        }
    };

    const handleAddUser = () => {
        if (username.trim()) {
            const userMessage = {
                sender: username,
                type: 'JOIN'
            };
            WebSocketService.addUser(userMessage);
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={handleAddUser}>Join Chat</button>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}: </strong>{msg.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;