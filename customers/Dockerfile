FROM jenkins/jnlp-agent-maven:windows-jdk11 as builder 
ARG MVN_ARGS
ADD ./src/ /app/src/
ADD ./pom.xml /app/pom.xml
WORKDIR /app
RUN echo "127.0.0.1 customer-mongodb order-postgres kafka" >> /etc/hosts && mvn --batch-mode package ${MVN_ARGS}

FROM sreekar545/win19server-jdk-mvn-vim:latest
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8102
ENTRYPOINT ["java","-jar","app.jar"]