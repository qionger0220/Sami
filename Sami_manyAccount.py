# -*- coding: utf-8 -*
#author：Sami 2022-02-25
#目前只能同事登录两个账号
#如果点击其中一个账号退出，两个登录的账号会同时退出

'''
new Env('Sami 青龙面板多开');
'''
'''
10 7,8 * * * Sami_jd_lyhb.js
'''

import socket
import base64
import json
import os
import sys
import logging
import time
import re

logging.basicConfig(level=logging.DEBUG, format='%(message)s')
logger = logging.getLogger(__name__)
logger.debug("\nSami青龙面板 多开账号!\n")

def sami_login():
    path = '/ql/config/auth.json'
    if os.path.isfile(path):
        with open(path, "r") as file:
            auth1 = file.read()
            file.close()
        auth = json.loads(auth1)
        username = auth["username"]
        password = auth["password"]
        lastlogon = auth["lastlogon"]
        retries = auth["retries"]
        lastip = auth["lastip"]
        lastaddr = auth["lastaddr"]
        platform = auth["platform"]
        isTwoFactorChecking = auth["isTwoFactorChecking"]
        token = auth["token"]
        tokens = auth["tokens"]["desktop"]
        if ("sami_token" in auth):
            sami_token = auth["sami_token"]
            if(sami_token == token):
                logger.info("程序已经执行过,程序退出\n")
                sys.exit(1)
            else:
                tokens = sami_token
                sami_token = token
                logger.info("程序执行成功,可以多开账户啦！")
        else:
            sami_token = token
            logger.info("程序执行成功,可以多开账户啦！")
        with open(path,"w") as file:   #”w"代表着每次运行都覆盖内容
            file.write(str('{"username":"'+ str(username)+'","password":"'+ str(password)+ '","token":"'+str(token)+'","tokens":{"desktop":"'+str(tokens)+'"},"lastlogon":'+str(lastlogon)+',"retries":'+str(retries)+',"lastip":"'+str(lastip)+'","lastaddr":"'+str(lastaddr)+'","sami_token":"'+str(sami_token)+'","platform":"'+str(platform)+'","isTwoFactorChecking":'+str(isTwoFactorChecking).lower()+'}'))

if __name__ == '__main__':
    logger.info("\n--------------------\n")
    sami_login()
