## Build app

FROM maven:3-sapmachine-17 as builder 
ARG MVN_ARGS
ADD ./src/ /app/src/
ADD ./pom.xml /app/pom.xml
WORKDIR /app
RUN mvn --batch-mode package ${MVN_ARGS}



## Run app

FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

## Set docker arguments with defaults
ARG service_port=3003

EXPOSE ${service_port}

ENV PORT=${service_port}

ENV SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/customer-db

ENTRYPOINT java -jar app.jar --server.port=${PORT}