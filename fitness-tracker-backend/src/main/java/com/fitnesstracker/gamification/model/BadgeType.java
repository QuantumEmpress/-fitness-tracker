package com.fitnesstracker.gamification.model;

public enum BadgeType {
    FIRST_WORKOUT("First Steps", "Completed your first workout"),
    WORKOUT_5("High Five", "Completed 5 workouts"),
    WORKOUT_10("On Fire", "Completed 10 workouts"),
    WORKOUT_25("Dedicated", "Completed 25 workouts"),
    WORKOUT_50("Elite", "Completed 50 workouts"),
    EARLY_BIRD("Early Bird", "Completed a workout before 8 AM"),
    NIGHT_OWL("Night Owl", "Completed a workout after 8 PM"),
    WEEKEND_WARRIOR("Weekend Warrior", "Completed a workout on the weekend");

    private final String displayName;
    private final String description;

    BadgeType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
