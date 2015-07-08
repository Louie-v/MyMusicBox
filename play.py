#!/usr/local/Cellar/python
# -*- coding: utf-8 -*-

__author__ = 'Louie.v (louie.vv@gmail.com)'

import pygame
import wget,threading,time,os,api
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
    abs_path = os.path.abspath('./')
    musicCount = 0
    playList = []
    playNum = 0
    playFlag = True
    shutdownFlag=False
    shutdownTime=0
    def __init__ (self):
        self.is_playing = False
        self.music_option = {
            'frequence' : 44100,
            'bitsize' : -16,
            'channels' : 1,
            'buffer' : 2048,
        }
        self.music_info={
            'sid' : '',
            'name' : '',
            'md5' : '',
            'mp3Url' : '',
            'path' :'',
        }
        # 初始化播放列表
        self.relPlayListAndCount()


        print self.playList
        print self.musicCount

        self.playTimerThread()
        # setting pygame
        pygame.mixer.init( self.music_option['frequence'], self.music_option['bitsize'], self.music_option['channels'], self.music_option['buffer'])
        pygame.mixer.music.set_volume(1)

    def playTimerThread(self):
        pTimer=threading.Thread(target=self.playTimer,name="playTimer")
        threads.append(pTimer)
        pTimer.start()

    def playTimer(self):
        while 1:
            if self.playFlag == False:
                time.sleep(1)
                self.nextMusic()
                time.sleep(2)
            if self.shutdownFlag==True:
                print "system will shutdown in ",int((self.shutdownTime-time.time())/60),"min.",int((self.shutdownTime-time.time())%60)
                if self.shutdownTime <= time.time():
                    os.system("shutdown -h now")
                    self.shutdownFlag=False

            time.sleep(1)
    # play music
    def play_music(self, sid):
        print 'current play music sid: ',sid
        item = threading.Thread( target=self.play_music_thread, args=( sid,), name="player" )
        threads.append( item )
        item.start()

    # play threading
    def play_music_thread(self,sid):
        musicSid = MusicData.get_music_info(self, sid)
        if not musicSid:
            musicSid = self.search_music_info(sid)
        else:
            # 更新当前播放的歌曲号
            self.playNum=self.playList.index(int(sid))

        # play now
    	clock = pygame.time.Clock()
        music_path=self.abs_path+"/music/"+musicSid+'.mp3'

        try:
            pygame.mixer.music.load(music_path)
            print("Music file {} loaded!".format(music_path))
            self.playFlag=True
        except pygame.error:
            print("File {} error! {}".format(music_path, pygame.get_error()))
            return
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            clock.tick(30)
        self.playFlag=False
    # search by api and get info
    def search_music_info(self, sid):
        NetEase = api.NetEase()
        music_info = NetEase.dig_info(NetEase.song_detail(sid),"songs")
        music_info=music_info[0]
        down_res = self.download_music(music_info['mp3_url'],sid)
        if down_res:
            MusicData.set_music_info( self, music_info )
            self.relPlayListAndCount()

            self.playNum=self.playList.index(int(sid))
            return str(music_info['song_id'])
        else:
            return
    # download and move
    def download_music(self, url,sid):

        file_path = self.abs_path + '/music/'
        music_path = file_path+str(sid)+".mp3"
        if not os.path.exists( file_path ):
            try:
                os.makedirs( file_path )
            except:
                print '权限不足，无法创建目录...'
        else:
            pass
        # 下载并移动
        try:
            music = wget.download(url,music_path)
            print music
            return music
        except:
            print '下载出错...'


    def setVolume(self, value):
        try:
            pygame.mixer.music.set_volume( float(value) )
            return value
        except:
            return False
        pass
    def pause_music(self):
        try:
            pygame.mixer.music.pause()
            return True
        except:
            return False
        pass
    def unPauseMusic(self):
        try:
            pygame.mixer.music.unpause()
            return True
        except:
            return False

    def mCount(self):
        '''
        统计数据库总歌曲数
        '''
        try:
            mCount=db.count_db()
            return mCount
        except:
            return False

    def getPlaylist(self):
        '''
        获取数据库播放列表
        '''
        templist=[]
        try:
            list=db.select_all()
            for i in range(0,len(list)):
                templist.append(list[i][0])
            return templist
        except:
          return False

    def nextMusic(self):
        '''
        播放下一曲
        '''
        if self.musicCount > 0:
            if self.playNum < self.musicCount-1:
                self.playNum = self.playNum+1
            else:
                self.playNum = 0

            self.play_music(self.playList[self.playNum])
            return  self.playList[self.playNum]
        else:
            return 110

    def prevMusic(self):
        '''
        播放上一曲
        '''
        # 播放列表为空 不响应
        if self.musicCount > 0:
            if self.playNum > 0:
                self.playNum = self.playNum-1
            else:
                self.playNum = self.musicCount-1

            self.play_music(self.playList[self.playNum])
            return  self.playList[self.playNum]
        else:
            return 110


    def relPlayListAndCount(self):
        musicCount=self.mCount()
        if musicCount:
            self.musicCount=musicCount[0][0]
            self.playList=self.getPlaylist()


if __name__ == "__main__":
    play = Play()
    play.play_music(32548853)





