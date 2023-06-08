# 打开redis 数据库
# redis 记录异步任务状态，因为我们处理比较大的文件的时候是异步请求，任务状态记录在redis数据库
cmd = /usr/local/bin/redis-server /home/dna/Software/redis-5.0.14/redis.conf

# 打开celery
# celery 负责任务调度，配合redis使用，celery将任务状态保存在redis数据库中
# celery对应redis的请求接口是：
backend = 'redis://121.192.180.202:6379/1'
broker = 'redis://121.192.180.202:6379/2'
cmd = '/home/dna/Software/anaconda3/bin/celery -A celery_task worker -l info'
# 如果想改成本地的redis接口，请在DNASTORAGE/backend/celery_task.py修改
backend = 'redis://127.0.0.1:6379/1'
broker ='redis://127.0.0.1:6379/2' 
# 使用你自己的celery
cmd = 'celery -A celery_task worker -l info'

# run backend 
dirname = '/home/dna/DNAStorage/backend'
cmd = 'python app.py'

# 前端访问后端端口
'https://dmci.xmu.edu.cn/dna-storage-designer-api'
