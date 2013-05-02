import sqlite3, os, threading
filename = '/var/www/addon_files/main.db'

def db_init():
    head, tail = os.path.split(filename)
    if tail not in os.listdir(head) or len(open(filename).read()) <= 1:
      c = sqlite3.connect(filename)
      for table in ('candidate_remove','candidate_add'):
        c.execute('''CREATE TABLE %s
           (url text)''' % table)

      c.commit()
      open('/var/www/1','w').write(head+"  3  "+tail)
    else:
      open('/var/www/1','w').write(head+"  0  "+tail)

def db_add(table,value):
    c = sqlite3.connect(filename)
    c.execute('INSERT INTO %s VALUES (?)' % table,(value,))
    c.commit() #threading.Thread(target=lambda:c.commit()).start() 

def application(environ, start_response):
    db_init()
    start_response('200 OK', [('Content-Type', 'text/plain')])
    q = ""
    if environ.get('REQUEST_METHOD','GET') == 'GET':
        q = environ.get('QUERY_STRING','')
    else:
        q = environ['wsgi.input'].read()
    open('/var/www/1','w').write(q)
    queries = {a:b for a,b in [x.split('=') for x in q.split('&')]}
    r,s = queries.get('remove',''), queries.get('add','')
    if r:
        db_add('candidate_remove',r)
    if s:
        db_add('candidate_add',s)
 
    return "Thank you!"
