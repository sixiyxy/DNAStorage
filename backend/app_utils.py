from flask_session import Session
import time

inmemory_session_pool = []
session_survive_time = 60*60

def remove_outdated_session():
    global inmemory_session_pool
    cur_time = time.time()
    inmemory_session_pool = list(filter(lambda x:(cur_time-x['active_time'])<=session_survive_time,inmemory_session_pool))

def set_session(key,value):
    global inmemory_session_pool
    remove_outdated_session()
    found = False
    for session_item in inmemory_session_pool:
        if session_item['key'] == key:
            session_item['active_time'] = time.time()
            session_item['value'] = value
            found = True
            break
    if not found:
        inmemory_session_pool.append({
            'key':key,
            'active_time':time.time(),
            'value':value
        })

def get_session(key):
    global inmemory_session_pool
    for session_item in inmemory_session_pool:
        if session_item['key'] == key:
            session_item['active_time'] = time.time()
            return session_item['value']
    return None
