# Use pre-built JAR from Jenkins workspace (avoids rebuilding inside Docker)
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
