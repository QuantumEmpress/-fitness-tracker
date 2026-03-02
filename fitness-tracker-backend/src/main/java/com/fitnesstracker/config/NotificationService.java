package com.fitnesstracker.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast exercise changes to all connected users
     * 
     * @param type CREATED, UPDATED, or DELETED
     * @param data the exercise data or ID
     */
    public void broadcastExerciseUpdate(String type, Object data) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", type);
        message.put("data", data);
        messagingTemplate.convertAndSend("/topic/exercises", message);
    }

    /**
     * Send a personal notification to a specific user
     * 
     * @param userId the user's ID
     * @param title  notification title
     * @param body   notification body
     */
    public void notifyUser(String userId, String title, String body) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("title", title);
        notification.put("body", body);
        notification.put("timestamp", System.currentTimeMillis());
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, notification);
    }

    /**
     * Notify a user that their dashboard should refresh
     * 
     * @param userId the user's ID
     */
    public void broadcastDashboardUpdate(String userId) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "REFRESH");
        message.put("timestamp", System.currentTimeMillis());
        messagingTemplate.convertAndSend("/topic/dashboard/" + userId, message);
    }
}
