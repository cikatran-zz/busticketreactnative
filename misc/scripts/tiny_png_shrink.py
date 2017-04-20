import os
import tinify
import sys

import json

COMPRESSED_FILES_LOG = sys.argv[2]
if os.path.exists(COMPRESSED_FILES_LOG):
    with open(COMPRESSED_FILES_LOG, 'r') as f:
        COMPRESSED_FILES = json.loads(f.readline())['compressed_files']
else:
    COMPRESSED_FILES = []

def walk(path):
    if os.path.islink(path):
        pass
    elif os.path.isdir(path):
        for p in os.listdir(path):
            walk(os.path.join(path, p))
    elif os.path.isfile(path) and path[-3:] in ['png', 'jpg'] and path not in COMPRESSED_FILES:
        compress(path)

def get_save_path(path):
    new_dir = os.path.join('test', os.path.dirname(path))
    if not os.path.exists(new_dir):
        os.makedirs(new_dir)
    return os.path.join(new_dir, os.path.split(path)[-1])

def compress(path):
    global count
    count += 1

    print 'start on: ' + path
    try:
        source = tinify.from_file(path)
        source.to_file(get_save_path(path))
        COMPRESSED_FILES.append(path)
    except tinify.AccountError, e:
        print 'encountered error: %s' % e.message
        global key_index
        key_index += 1
        if key_index > len(key_list):
            print 'running out of valid keys :('
            return
        else:
            tinify.key = key_list[key_index]
            compress(path)
    except Exception, e:
        # Something else went wrong, unrelated to the Tinify API.
        pass

def start(path):
    tinify.key = key_list[key_index]
    walk(path)
    with open(COMPRESSED_FILES_LOG, 'w') as f:
        f.write(json.dumps({'compressed_files': COMPRESSED_FILES}))

key_list = ['8q6HE4IR1KgMCNt7jV2_LBlTz9DCpv0Z', 
            '6uTvoHtyP7Vfazxvsf6WALGz-jRzJwgH',
            'git80ttCyaCS4njagiWoVkvy5lItSEoz',
            'U9oj_398uVthxtzS9u6_YCtaeAfVW5gX',
            'ihfG6hcygjxxzki24HYMsDZUN7MQ19ji', 
            'CFZVb2AkGqNKWBI_ZQ7G1pkKhv7z4DNW',
            'ENdxN8NZuOFYBQx5BbDDUuHQkma3dff4',
            'Zf744441qkGIhVth2Ay_itN9JDWA2SUK',
            'mpODJTEUdMuZLYuJkBrKZLz0l1Nclfog',
            'LIkwh6RWePXmj1u1PIo-DWIlfVXXvtu7',
            'tZ0zveFdEEHZHi2bsDdYiLYz1Fg9kuxY',
            'tVe32ZVq3CU6I7qK9sQ4_0d0p8WMBpDM']
count = 0
key_index = 0
start(sys.argv[1])
print count