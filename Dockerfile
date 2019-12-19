FROM tomcat:8-jdk8-openjdk-slim

ENV JAVA_OPTS="-Denv=staging"

RUN ["rm", "-fr", "/usr/local/tomcat/webapps/ROOT"]
COPY build/libs/wwwapps.war /usr/local/tomcat/webapps/wwwapps.war

RUN ["rm", "-fr", "/opt"]
COPY opt/ /opt

EXPOSE 8080
CMD ["catalina.sh", "run"]