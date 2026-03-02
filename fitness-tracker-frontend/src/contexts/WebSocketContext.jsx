import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import websocketService from '../services/websocketService';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

// eslint-disable-next-line react-refresh/only-export-components
export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [connected, setConnected] = useState(false);
    const [lastExerciseEvent, setLastExerciseEvent] = useState(null);
    const [lastDashboardEvent, setLastDashboardEvent] = useState(null);
    const subscribedRef = useRef(false);

    const setupSubscriptions = useCallback(() => {
        if (subscribedRef.current || !user) return;
        subscribedRef.current = true;

        // 1. Exercise broadcasts (admin adds/updates/deletes exercises)
        websocketService.subscribe('/topic/exercises', (message) => {
            setLastExerciseEvent({ ...message, timestamp: Date.now() });

            if (message.type === 'CREATED') {
                toast('🏋️ New exercise added: ' + (message.data?.name || 'Unknown'), {
                    icon: '🆕',
                    duration: 4000,
                });
            } else if (message.type === 'UPDATED') {
                toast('✏️ Exercise updated: ' + (message.data?.name || 'Unknown'), {
                    icon: '📝',
                    duration: 3000,
                });
            } else if (message.type === 'DELETED') {
                toast('🗑️ An exercise was removed', {
                    icon: '❌',
                    duration: 3000,
                });
            }
        });

        // 2. Personal notifications (goal deadlines & achievements)
        if (user.id) {
            websocketService.subscribe('/topic/notifications/' + user.id, (message) => {
                toast(message.body || message.title, {
                    icon: message.title?.includes('Achieved') ? '🎯' : '⏰',
                    duration: 6000,
                    style: {
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))',
                        border: '1px solid rgba(139,92,246,0.3)',
                    },
                });
            });

            // 3. Dashboard live updates
            websocketService.subscribe('/topic/dashboard/' + user.id, (message) => {
                setLastDashboardEvent({ ...message, timestamp: Date.now() });
            });
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            websocketService.connect(
                () => {
                    setConnected(true);
                    setupSubscriptions();
                },
                (error) => {
                    console.error('WebSocket connection error:', error);
                    setConnected(false);
                }
            );
        }

        return () => {
            subscribedRef.current = false;
            websocketService.disconnect();
            setConnected(false);
        };
    }, [user, setupSubscriptions]);

    return (
        <WebSocketContext.Provider value={{
            connected,
            lastExerciseEvent,
            lastDashboardEvent,
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWebSocket = () => useContext(WebSocketContext);
