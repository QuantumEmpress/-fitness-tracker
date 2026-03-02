import { Client } from '@stomp/stompjs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Convert http(s) to ws(s) for WebSocket URL
const WS_URL = API_URL.replace(/^http/, 'ws') + '/ws';
// SockJS fallback URL (uses HTTP)
const SOCKJS_URL = API_URL + '/ws';

let stompClient = null;
const subscriptions = {};

/**
 * Connect to the WebSocket server using SockJS fallback
 */
const connect = (onConnected, onError) => {
    stompClient = new Client({
        // Use SockJS transport via HTTP URL
        webSocketFactory: () => {
            // SockJS uses a regular HTTP URL and upgrades
            return new WebSocket(WS_URL + '/websocket');
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            console.log('WebSocket connected');
            if (onConnected) onConnected();
        },
        onStompError: (frame) => {
            console.error('STOMP error:', frame.headers['message']);
            if (onError) onError(frame);
        },
        onWebSocketClose: () => {
            console.log('WebSocket disconnected');
        },
    });

    stompClient.activate();
};

/**
 * Disconnect from the WebSocket server
 */
const disconnect = () => {
    if (stompClient && stompClient.active) {
        // Unsubscribe from all
        Object.values(subscriptions).forEach((sub) => {
            try { sub.unsubscribe(); } catch (e) { /* ignore */ }
        });
        stompClient.deactivate();
        stompClient = null;
    }
};

/**
 * Subscribe to a topic/queue
 * @param {string} destination - e.g. '/topic/exercises'
 * @param {function} callback - receives the parsed message body
 * @returns {string} subscription key for unsubscribing
 */
const subscribe = (destination, callback) => {
    if (!stompClient || !stompClient.active) {
        console.warn('WebSocket not connected. Cannot subscribe to:', destination);
        return null;
    }

    const sub = stompClient.subscribe(destination, (message) => {
        try {
            const body = JSON.parse(message.body);
            callback(body);
        } catch (e) {
            callback(message.body);
        }
    });

    subscriptions[destination] = sub;
    return destination;
};

/**
 * Unsubscribe from a topic/queue
 * @param {string} destination
 */
const unsubscribe = (destination) => {
    if (subscriptions[destination]) {
        subscriptions[destination].unsubscribe();
        delete subscriptions[destination];
    }
};

/**
 * Check if connected
 */
const isConnected = () => {
    return stompClient && stompClient.active;
};

const websocketService = {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    isConnected,
};

export default websocketService;
