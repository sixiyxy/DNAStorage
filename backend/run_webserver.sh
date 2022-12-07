#! /bin/bash

CELERY="/home/dna/Software/anaconda3/bin/celery"
CELERY_DIR="/home/dna/DNAStorage/backend/"
REDIS="/usr/local/bin/redis-server"
REDIS_CONFIG="/home/dna/Software/redis-5.0.14/redis.conf"
REDIS_LOG="/home/dna/run_web/redis.log"
UWSGI_INIT="/home/dna/run_web/uwsgi.ini"
UWSGI="/home/dna/Software/anaconda3/bin/uwsgi"
UWSGI_PID="/home/dna/run_web/uwsgi.pid"

LOG_DIR="/home/dna/run_web"

now_dir=`pwd`

FRONT_dir="/home/dna/front/"
BACKEND_dir="d/home/dna/DNAStorage"

if [ ! -n "$1" ]
then
    content="Usage: bash run.sh [stop|start|pack]"
    echo  "#### $content ####"
    exit
fi

#tar -zcvf example.tar.gz -p example

####################### package front and backend ####################
if [ $1 = pack ]
then
    # delete front dir
    echo "### Now, tar the front data..."
    rm -rf $FRONT_dir/dna-storage-designer
    tar -zxf $FRONT_dir/dna-storage-designer.tar.gz -C $FRONT_dir
    echo "### Front data is ready!"
    echo "### Now, remove backend script and clone the new sript..."
    rm -rf $BACKEND_dir
    git clone https://github.com/sixiyxy/DNAStorage.git
    echo "### Package front and backend done!"
    exit

####################### kill the running tools ####################
elif [ $1 = stop ]
then 
    tool=$REDIS # redis
    jobs=`ps -ef|grep "redis-server"|grep -v "grep"|awk '{print $2}'`
    jobs_num=`ps -ef|grep "redis-server"|grep -v "grep"|awk '{print $2}'|wc -l`
    if [ $jobs_num -gt 0 ]
    then
        for job in $jobs
        do
            kill -9 $job
            echo "${tool} job ${job} killed"
        done
    else
        content="$tool not running!"
        echo -e $content
    fi

    tool=$CELERY # celery
    jobs=`ps -ef|grep "$tool"|grep -v "grep"|awk '{print $2}'`
    jobs_num=`ps -ef|grep "$tool"|grep -v "grep"|awk '{print $2}'|wc -l|head -n 1`

    if [ $jobs_num -gt 0 ]
    then
        for job in $jobs
        do
            kill -9 $job
            echo "${tool} job ${job} killed"
        done
    else
        content="$tool not running!"
        echo -e $content
    fi

    tool=$UWSGI #uwsgi
    jobs=`ps -ef|grep "$tool"|grep -v "grep"|awk '{print $2}'`
    jobs_num=`ps -ef|grep "$tool"|grep -v "grep"|awk '{print $2}'|wc -l|head -n 1`
    
    if [ $jobs_num -gt 0 ]
    then
        for job in $jobs
        do
            kill -9 $job
            echo "${tool} job ${job} killed"
        done
    else
        content="$tool not running!"
        echo -e $content
    fi
    exit
elif [ $1 = start ]
then
    ############################ running  ###############################
    uwsgi_jobs_num=`ps -ef|grep "$UWSGI"|grep -v "grep"|awk '{print $2}'|wc -l`
    celery_jobs_num=`ps -ef|grep "$CELERY"|grep -v "grep"|awk '{print $2}'|wc -l`
    redis_jobs_num=`ps -ef|grep $REDIS|grep -v "grep"|awk '{print $2}'|wc -l`
    # redis config
    # bind 121.192.180.202
    # protected-mode no
    # dbfilename dna_storage_desinger.redisdb
    # maxmemory-policy allkeys-lru
    # maxmemory 10gb

    if [[ $redis_jobs_num = 0 ]] && [[ $celery_jobs_num = 0 ]] && [[ $uwsgi_jobs_num = 0 ]]; then
        echo "Begin start redis..."
        rm -rf $REDIS_LOG
        nohup $REDIS $REDIS_CONFIG > $REDIS_LOG 2>&1 &
        echo "Now,redis is run!"
        echo "Begin start celery..."
        cd $CELERY_DIR
        nohup $CELERY -A celery_task worker -l info > $LOG_DIR/celery.log 2>&1 &
        cd $now_dir
        echo "Now,celery is run!"
        echo "Begin start uwsgi..."
        $UWSGI --ini $UWSGI_INIT
        echo "Now,uwsgi is run!"
        exit
    else
        content="### Please stop the celery or uwsgi, first!"
        echo $content
        exit
    fi
else
    content="Usage: bash run.sh [stop|start|pack]"
    echo  "#### $content ####"
    exit
fi