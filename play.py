#!/usr/local/Cellar/python
# -*- coding: utf-8 -*-

__author__ = 'Louie.v (Check.vv@gmail.com)'

import threading
import time
import os
import subprocess

import wget

import api
from dbsqlite import DbSqlite

#db初始化
db = DbSqlite()

threads = []

class MusicData(object):
    def set_music_info(self, infoDic):
        '''
        添加播放歌曲
        '''
        return db.insert_db(infoDic)
    
    def get_music_info(self, sid):
        '''
        获取数据库歌曲信息
        '''
        res = db.select_db(sid)
        if res:
            return str(res[0][0])
        else:
            return False

class Play(MusicData):
    '''
    播放音乐
    使用subprprocess和mpg123进行音乐的后台播放
    '''
    def __init__(self):
        self.music_info = {
            'sid': '',
            'name': '',
            'md5': '',
            'mp3Url': '',
            'path': '',
        }
        self.abs_path = os.path.abspath('./')
        self.musicCount = 0
        self.playList = []
        self.playNum = 0
        self.playFlag = False
        self.shutdownFlag = False
        self.shutdownTime = 0
        self.popenHandler = None
        self.volume = 100
        self.pause_flag = False

        # 初始化播放列表
        self.relPlayListAndCount()
        #启动定时器
        self.sdTimerThread()


    def sdTimerThread(self):
        pTimer = threading.Thread(target=self.sdTimer, name="sdTimer")
        threads.append(pTimer)
        pTimer.start()
    #定时器进程函数
    def sdTimer(self):
        while 1:
            # 循环播放
            # 判断条件还需要再调整
            if self.playFlag == False and self.popenHandler:
                time.sleep(1)
                self.nextMusic()
                time.sleep(2)
            # 定时关机
            if self.shutdownFlag == True:
                sdTime = self.shutdownTime - time.time()
                print "system will shutdown in ", int(sdTime / 60), ":", int(sdTime % 60)
                if self.shutdownTime <= time.time():
                    os.system("shutdown -h now")
                    self.shutdownFlag = False
            time.sleep(1)

    def play_music(self, sid):
        '''
        播放
        '''
        if self.playFlag == True:
                self.musicStop()
        # 判断歌曲是否已下载
        musicSid = MusicData.get_music_info(self, sid)
        if not musicSid:
            musicSid = self.search_music_info(sid)

        print 'current play music sid: ', sid
        item = threading.Thread(target=self.playPopen, args=(sid,), name="player")
        threads.append(item)
        item.start()

    # 播放音乐子进程
    def playPopen(self,mSid):
        self.popenHandler = subprocess.Popen(["mpg123", "-R"],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        self.popenHandler.stdin.write(b'V ' + str(self.volume).encode('u8') + b'\n')
        if mSid:
            songPath = self.abs_path + "/music/" + str(mSid) + '.mp3'
            print("Music file {} loaded!".format(songPath))
            self.popenHandler.stdin.write(b'L ' + songPath.encode('u8') + b'\n')
            self.playFlag = True
            while True:
                strout = self.popenHandler.stdout.readline().decode('u8')
                # 播放结束
                if strout == '@P 0\n':
                    self.playFlag = False
                    break
        else:
            pass
        return

    # 获取歌曲信息并下载
    def search_music_info(self, sid, mode=0):
        NetEase = api.NetEase()
        music_info = NetEase.dig_info(NetEase.song_detail(sid), "songs")
        music_info = music_info[0]
        down_res = self.download_music(music_info['mp3_url'], sid)
        if down_res:
            MusicData.set_music_info(self, music_info)
            self.relPlayListAndCount()
            # 跳过添加歌曲时更新播放序号
            if mode == 0:
                self.playNum = self.playList.index(int(sid))
            return str(music_info['song_id'])
        else:
            return

    # download
    def download_music(self, url, sid):
        file_path = self.abs_path + '/music/'
        music_path = file_path + str(sid) + ".mp3"
        if not os.path.exists(file_path):
            try:
                os.makedirs(file_path)
            except:
                print '权限不足，无法创建目录...'
        else:
            pass
        # 下载
        try:
            music = wget.download(url, music_path)
            print music
            return music
        except:
            print '下载出错...'

    def setVolume(self, value):
        value = float(value) * 100
        if value > 100:
            value = 100
        if value < 0:
            value = 0
        # try:
        if self.playFlag == True:
            self.popenHandler.stdin.write(b'V ' + str(value).encode('u8') + b'\n')
            self.popenHandler.stdin.flush()
        self.volume = value
        return value

    def pause_music(self):
        '''
        暂停音乐
        '''
        try:
            self.pause_flag = True
            self.popenHandler.stdin.write(b'P\n')
            self.popenHandler.stdin.flush()
        except:
            return False
        pass

    def unPauseMusic(self):
        '''
        恢复播放
        '''
        try:
            self.pause_flag = False
            self.popenHandler.stdin.write(b'P\n')
            self.popenHandler.stdin.flush()
            return True
        except:
            return False

    def mCount(self):
        '''
        统计数据库总歌曲数
        '''
        try:
            mCount = db.count_db()
            return mCount
        except:
            return False

    def getPlaylist(self):
        '''
        获取数据库播放列表
        '''
        templist = []
        try:
            list = db.select_all()
            for i in range(0, len(list)):
                templist.append(list[i][0])
            return templist
        except:
            return False

    def nextMusic(self):
        '''
        播放下一曲
        '''
        self.musicStop()
        if self.musicCount > 0:
            if self.playNum < self.musicCount - 1:
                self.playNum = self.playNum + 1
            else:
                self.playNum = 0
            sid = self.playList[self.playNum]
            musicSid = MusicData.get_music_info(self, sid)
            if not musicSid:
                musicSid = self.search_music_info(sid)

            self.play_music(sid)
            return self.playList[self.playNum]
        else:
            self.musicStop()
            return -1

    def prevMusic(self):
        '''
        播放上一曲
        '''
        self.musicStop()
        if self.musicCount > 0:
            if self.playNum > 0:
                self.playNum = self.playNum - 1
            else:
                self.playNum = self.musicCount - 1

            sid = self.playList[self.playNum]
            musicSid = MusicData.get_music_info(self, sid)
            if not musicSid:
                musicSid = self.search_music_info(sid)

            self.play_music(sid)
            return self.playList[self.playNum]
        else:
            self.musicStop()
            return -1

    def relPlayListAndCount(self):
        musicCount = self.mCount()
        if musicCount:
            self.musicCount = musicCount[0][0]
            self.playList = self.getPlaylist()

    def musicStop(self):
        '''
        停止播放进程
        '''
        self.playFlag = False
        self.popenHandler.stdin.write(b'Q\n')
        self.popenHandler.stdin.flush()
        try:
            self.popenHandler.kill()
        except OSError as e:
            print e
            return -1

if __name__ == "__main__":
    play = Play()
    play.playPopen('32619804')