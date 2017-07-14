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

ENV dts_docker=1

ENV dts_zk_address=10.247.33.85:2181

ENV dts_driver_class_name=org.postgresql.Driver
ENV dts_jdbc_url=jdbc:postgresql://10.247.33.85:5432/dts
ENV dts_jdbc_user_name=dts01
ENV dts_web_schema=bi.
ENV dts_encrypt_jdbc_password=127%143%142%75%76%


ENV dts_app_mapper=org.bi.app.handle.mapper,org.bi.db.mapper
ENV dts_app_start=org.bi.app.handle.AppHandleStart
ENV dts_app_log_file_dir=/home/dts/logs
ENV dts_storage_db_type=1


ENV dts_redis_pool_maxTotal=500
ENV dts_redis_pool_maxIdle=50
ENV dts_redis_pool_maxWaitMillis=3000
ENV dts_redis_ip=10.247.33.85
ENV dts_redis_port=6379
ENV dts_redis_database=1
ENV dts_redis_auth=true
ENV dts_redis_password=foobaredd

ENV dts_runMode=debug
ENV dts_repeatLogin=1
ENV dts_resPath=
ENV dts_isStartApp=1
ENV dts_company = 1
ENV dts_publishType = 1
ENV dts_targetEndPoint=
ENV dts_IS_LOG_PUSH_ON=0
ENV dts_URL_INFO_NUM=8
ENV dts_net_type=rpc

RUN chmod 755 /usr/java/jdk1.7.0_79/bin/*
WORKDIR $CATALINA_HOME/bin
RUN  chmod 755 *.sh
RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone
EXPOSE 8080
CMD ["./catalina.sh", "run"]

