# Stage 1: Build application with Maven
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy Maven wrapper and dependencies specification
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Download dependencies in advance for layer caching
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and package executable JAR
COPY src src
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal production runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Create non-root user for secure container execution
RUN groupadd -r wander && useradd -r -g wander -d /app wander

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar
RUN chown -R wander:wander /app

USER wander

# Default port (Render overrides this at runtime via PORT environment variable)
ENV PORT=8080
EXPOSE 8080

# Memory tuning for Render 512MB RAM instance with headless mode for WebP processing
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.awt.headless=true", "-Djava.io.tmpdir=/tmp", "-jar", "app.jar"]
