FROM openjdk:27-ea-oraclelinux9
# Add your JAR
COPY target/connect.jar /connect.jar

ENTRYPOINT ["java", "-jar", "/connect.jar"]
