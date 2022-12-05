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

class PrefixMiddleware(object):
    def __init__(self, app, prefix=''):
        self.app = app
        self.prefix = prefix
    def __call__(self, environ, start_response):
        if environ['PATH_INFO'].startswith(self.prefix):
            print(environ['PATH_INFO'])
            print(environ['PATH_INFO'][len(self.prefix):])
            environ['PATH_INFO'] = environ['PATH_INFO'][len(self.prefix):]
            environ['SCRIPT_NAME'] = self.prefix
            return self.app(environ, start_response)
        else:
            start_response('404', [('Content-Type', 'text/plain')])
            return ["This url does not belong to the app.".encode()]

class ReverseProxied(object):
    
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME', '')
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]

        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)


# app.wsgi_app = PrefixMiddleware(app.wsgi_app, prefix='/foo')
# app.wsgi_app = ReverseProxied(app.wsgi_app)