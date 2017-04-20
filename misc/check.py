#!/usr/bin/python
import argparse
import subprocess
import json
import datetime
import urllib2

ROOT_SRC = "/home/gardev/android/beeshop/release/proguard/"
ROOT_PROGUARD_TOOL = "/home/gardev/android/adt-bundle-linux/sdk/tools/proguard/bin/"


def main():
    parser = argparse.ArgumentParser(description='Process crash log json')
    parser.add_argument('--target',
                        dest='target',
                        action='store',
                        default='',
                        help='targe file path')

    parser.add_argument('--url',
                        dest='url',
                        action='store',
                        default='',
                        help='targe URL path')

    args = parser.parse_args()
    file_name = args.target
    url = args.url

    if file_name:
        f = open(file_name, 'r')
        content = f.read()
        f.close()
    elif url:
        response = urllib2.urlopen(url)
        content = response.read()
    else:
        print "invalid URL/File path"
        return

    log_info = json.loads(content)
    timestamp = log_info['timestamp']
    crash_log = log_info['crashInfo']
    device_info = log_info['deviceInfo']
    app_version = log_info['appVersion']
    user_id = log_info['userId']

    # follow app version to get the mapping

    # write the content into a file
    log_file = open("temp.txt", 'w')
    log_file.write(crash_log.encode('utf-8'))
    log_file.close()

    mapping_file_path = "{path}mapping_{version}.txt".format(path=ROOT_SRC,
                                                             version=app_version)
    proguard_bin = ROOT_PROGUARD_TOOL + 'retrace.sh'

    cmd = "{tool_file} -verbose {map_file} {trace_src}".format(tool_file=proguard_bin,
                                                               map_file=mapping_file_path,
                                                               trace_src='temp.txt')

    content = subprocess.check_output(cmd, shell=True)

    # generate crash report#
    print "-----------crash report-------------"
    print "app version: %d" % app_version
    print "crash time: %s" % datetime.datetime.utcfromtimestamp(timestamp)
    print "user id: %d" % user_id
    print "os version: %d" % device_info['os']
    print "model %s" % device_info['model']
    print "brand %s" % device_info['brand']
    print "manufacturer: %s" % device_info['manufacturer']
    print "-----------stack trace-------------"
    print content
    print "-----------end of crash report-------------"


if __name__ == "__main__":
    main()
