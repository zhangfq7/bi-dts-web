FROM registry.dataos.io/library/centos:centos7.1.1503

RUN  mkdir -p /home/dts
RUN  mkdir -p /home/dts/tmp/work
COPY jdk1.7.0_79 /usr/java/jdk1.7.0_79
COPY tomcat-7.0.64 /home/dts/tomcat-7.0.64
ADD  bi-web /home/dts/bi-web
ENV TIME_ZONE=Asia/Shanghai
ENV LANG=en_US.UTF-8
ENV JAVA_HOME  /usr/java/jdk1.7.0_79
ENV CATALINA_HOME /home/dts/tomcat-7.0.64
RUN chmod 755 /usr/java/jdk1.7.0_79/bin/*
WORKDIR $CATALINA_HOME/bin
RUN  chmod 755 *.sh
RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone
EXPOSE 8080
CMD ["./catalina.sh", "run"]

