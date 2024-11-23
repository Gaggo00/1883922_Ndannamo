# Fase 1: Build
FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /app

# Copia i file di configurazione Maven e il progetto
COPY pom.xml .
COPY src ./src

# Compila il progetto con Maven
RUN mvn clean package -DskipTests

# Fase 2: Runtime
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copia il file JAR dalla fase di build
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Comando di avvio
ENTRYPOINT ["java", "-jar", "app.jar"]
