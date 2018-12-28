FROM openjdk:8-alpine

COPY ./target/uberjar/curatify.jar /curatify/app.jar

EXPOSE 3000

CMD ["java", "-jar", "/curatify/app.jar"]
