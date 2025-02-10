import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.reconnectDelay = 5000; // Millisecondi per tentare la riconnessione
        this.onMessageReceived = null; // Callback per i messaggi
    }

    connect(onMessageReceived) {
        this.onMessageReceived = onMessageReceived;

        const socket = new SockJS('http://localhost:3000/chat'); // URL corretto del WebSocket
        this.stompClient = Stomp.over(socket);

        // Puoi disabilitare il logging in produzione
        // this.stompClient.debug = null;

        this.stompClient.connect(
            {},
            () => {
                console.log('WebSocket connected');
                this.connected = true;

                // Sottoscrivi al topic
                this.stompClient.subscribe('/topic/public', (message) => {
                    if (this.onMessageReceived) {
                        try {
                            this.onMessageReceived(JSON.parse(message.body));
                        } catch (error) {
                            console.error('Error parsing message:', error);
                        }
                    }
                });
            },
            (error) => {
                console.error('WebSocket error:', error);
                this.connected = false;

                // Riprova la connessione
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    this.connect(this.onMessageReceived);
                }, this.reconnectDelay);
            }
        );
    }

    sendMessage(message) {
        if (this.stompClient && this.connected) {
            this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
        } else {
            console.warn('Cannot send message, WebSocket is not connected.');
        }
    }

    addUser(user) {
        if (this.stompClient && this.connected) {
            this.stompClient.send('/app/chat.addUser', {}, JSON.stringify(user));
        } else {
            console.warn('Cannot add user, WebSocket is not connected.');
        }
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect(() => {
                console.log('WebSocket disconnected');
                this.connected = false;
            });
        }
    }
}

export default new WebSocketService();
