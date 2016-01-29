#!/usr/local/Cellar/python
# -*- coding: utf-8 -*-

__author__ = 'Louie.v (Check.vv@gmail.com)'

import tornado.auth
import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.httpserver
import tornado.web
import os
import time


import base64
import uuid  


from tornado.escape import json_encode
from tornado.options import define, options


import play
import api
from dbsqlite import DbSqlite

# 先初始化播放器
global player

player = play.Play()
db=DbSqlite()
define("port", default=80, help="run on the given port", type=int)

NetEase = api.NetEase()

class Application(tornado.web.Application):
    '''setting || main || router'''
    def __init__(self):
        handlers = [
            #for html
            (r"/", MainHandler),
            (r"/index", IndexHandler),
            (r"/shutdown", ShutdownHandler),
            # (r"/song.html", GetSongHandler),

            
            #for ajax
            # (r"/ajaxGetAlbum", AjaxGetAlbumHandler),
            (r"/ajaxSearch", AjaxSearchHandler),
            (r"/ajaxGetSong", AjaxGetSongHandler),
            (r"/ajaxGetAlbum", AjaxGetAlbumHandler),
            (r"/ajaxLogin", AjaxLoginHandler),
            (r"/ajaxPlayMusic", AjaxPlayMusicHandler),
            (r"/ajaxPauseMusic", AjaxPauseMusicHandler),
            (r"/ajaxUnPauseMusic", AjaxUnPauseMusicHandler),
            (r"/ajaxNewAlbums", AjaxNewAlbumsHandler),
            (r"/ajaxHotSong", AjaxHotSongHandler),
            (r"/ajaxSetVolume", AjaxSetVolumeHandler),
            (r"/ajaxHotArtists", AjaxHotArtistsHandler),
            (r"/ajaxDjChannels", AjaxDjChannelsHandler),
            (r"/ajaxArtists", AjaxArtistsHandler),
            (r"/ajaxGetHistory", AjaxGetHistoryHandler),
            (r"/ajaxDelSong", AjaxDelSongHandler),
            (r"/ajaxDelAllSong", AjaxDelAllSongHandler),
            (r"/ajaxAddSong", AjaxAddSongHandler),
            (r"/ajaxNextSong", AjaxNextSongHandler),
            (r"/ajaxPrevSong", AjaxPrevSongHandler),
            (r"/ajaxShutdown", AjaxShutdownHandler),
            (r"/ajaxGetShutdownTime", AjaxGetShutdownTimeHandler),
            (r"/ajaxCancelShutdown", AjaxCancelShutdownHandler),
            (r"/ajaxChangePwd", AjaxChangePwdHandler),
            (r"/ajaxList", AjaxListHandler),
            (r"/ajaxClassesGetSongList", AjaxClassesGetSongListHandler),

        ] 
        
        settings = dict(
            cookie_secret=base64.b64encode(uuid.uuid4().bytes + uuid.uuid4().bytes),
            base_path=os.path.join(os.path.dirname(__file__), ""),
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=False,
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


################################## html ############################################
#登录
class MainHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")

    def get(self):
        self.set_header("Accept-Charset", "utf-8")
        self.render("login.html")
    def post(self):
        try:
            req=self.get_argument('pwd')
            pwd=db.select_seting_db('pwd')
            if req == pwd[0][0]:
                self.set_secure_cookie('admin','admin',expires_days=None)
                self.write(tornado.escape.json_encode( {'result': True, 'info': '认证成功！' } ) )
            else:
                self.write(tornado.escape.json_encode( {'result':False, 'info': '认证失败！' } ) )
        except:
            self.write(tornado.escape.json_encode( {'result':False, 'info': '认证失败！' } ) )

#导航
class IndexHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")


    def get(self):
        self.set_header("Accept-Charset", "utf-8")
        if self.get_secure_cookie('admin') == 'admin':
            self.render("index.html")
        else:
            self.redirect('/')

    def post(self):
        self.redirect('/')

#关机
class ShutdownHandler(tornado.web.RequestHandler):
    def initialize(self):
        pass
    def get(self):
        self.set_header("Accept-Charset", "utf-8")
        #self.write( tornado.escape.json_encode(res) )
        cookie=self.get_secure_cookie('admin')
        if cookie  == 'admin':
            self.render("shutdown.html")
        else:
            self.redirect('/')

################################## ajax ############################################
#搜索信息
class AjaxSearchHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        NetEase.refresh()
        req = { 'key':self.get_argument("key")}
        res_temp = NetEase.search(  req['key'])
        res=NetEase.dig_info(res_temp['result']['songs'],'songs_search')
        self.write( tornado.escape.json_encode(res))
# 播放音乐
class AjaxPlayMusicHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        req = { 'sid':self.get_argument("sid"),}
        player.play_music( req['sid'] )
        self.write( tornado.escape.json_encode( {'result': True, 'info': 'play now...！！' } ) )
# 登录网易云
class AjaxLoginHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def post(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def get(self):
        self.set_header("Accept-Charset", "utf-8")
        NetEase.refresh()
        req = { 'user':self.get_argument("user"), 'pass':self.get_argument("pass") } 
        res = NetEase.login(  req['user'], req['pass'] )
        self.write( tornado.escape.json_encode(res['profile']) )
# 获取音乐信息
class AjaxGetSongHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def post(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def get(self):
        self.set_header("Accept-Charset", "utf-8")
        NetEase.refresh()
        req = { 'sid':self.get_argument("sid") } 
        res_temp = NetEase.song_detail( req['sid'] )
        res=NetEase.dig_info(res_temp,'songs')
        self.write( tornado.escape.json_encode(res) )

class AjaxGetAlbumHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def post(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def get(self):
        self.set_header("Accept-Charset", "utf-8")
        NetEase.refresh()
        req = { 'aid':self.get_argument("aid") } 
        res_temp = NetEase.album( req['aid'] )
        res = NetEase.dig_info(res_temp,'songs')
        self.write( tornado.escape.json_encode(res) )
# 调节音量
class AjaxSetVolumeHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        req = { 'value': self.get_argument("value") }
        res = player.setVolume( req['value'] )
        self.write( tornado.escape.json_encode( {'result': True, 'info': 'success！！','Volume':res } ) )
# 获取最新的专辑
class AjaxNewAlbumsHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        NetEase.refresh()
        req = { 'offset': self.get_argument("offset"), 'limit': self.get_argument("limit") }
        res_temp = NetEase.new_albums( req['offset'],req['limit'] )
        res=NetEase.dig_info(res_temp,'albums')
        self.write( tornado.escape.json_encode(res) )
# 获取最热歌单
class AjaxHotSongHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        NetEase.refresh()
        req = { 'idx': self.get_argument("idx"), }
        res_temp = NetEase.top_songlist( idx=int(req['idx']) )
        res=NetEase.dig_info(res_temp,'songs')
        self.write( tornado.escape.json_encode(res) )

# 获取最热歌手
class AjaxHotArtistsHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        NetEase.refresh()
        req = { 'offset': self.get_argument("offset"), 'limit': self.get_argument("limit") }
        res_temp = NetEase.top_artists( req['offset'],req['limit'] )
        res = NetEase.dig_info(res_temp,'artists')
        self.write( tornado.escape.json_encode(res) )

# 获取Dj
class AjaxDjChannelsHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        NetEase.refresh()
        req = { 'stype':self.get_argument("stype"),'offset': self.get_argument("offset"), 'limit': self.get_argument("limit") }
        res = NetEase.djchannels(req['stype'], req['offset'],req['limit'] )
        self.write( tornado.escape.json_encode(res) )

# 暂停
class AjaxPauseMusicHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        res = player.pause_music()
        self.write( tornado.escape.json_encode(res) )

# 继续播放
class AjaxUnPauseMusicHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        res = player.unPauseMusic()
        self.write( tornado.escape.json_encode(res) )

# 歌手歌曲列表
class AjaxArtistsHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        self.set_header("Accept-Charset", "utf-8")
        req={'artists_id':self.get_argument("artists_id"),}
        print req
        res_temp = NetEase.artists(req['artists_id'])
        res = NetEase.dig_info(res_temp,'songs')
        self.write( tornado.escape.json_encode(res) )
#获取播放历史
class AjaxGetHistoryHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def post(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def get(self):
        hList=db.select_all()
        res=[]
        for i in range(len(hList)):
            resDict={}
            resDict['song_id'] = hList[i][0]
            resDict['song_name'] =hList[i][1]
            resDict['artist'] =hList[i][2]
            res.append(resDict)
        self.write( tornado.escape.json_encode(res))

# 删除历史列表歌曲
class AjaxDelSongHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        req={'sid':self.get_argument("sid"),}
        res=db.delete_db(req['sid'])
        if res==True:
            player.pause_music()
            # 更新播放数据
            player.relPlayListAndCount()

            self.write( tornado.escape.json_encode({'result':True} ))
        else:
            self.write( tornado.escape.json_encode({'result':False}) )

# 删除整个历史列表
class AjaxDelAllSongHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        res=db.delete_all()
        if res==True:
            player.pause_music()

            # 更新播放数据
            player.relPlayListAndCount()
            player.playNum=0
            self.write( tornado.escape.json_encode({'result':True} ))
        else:
            self.write( tornado.escape.json_encode({'result':False}) )



# 添加歌曲到列表
class AjaxAddSongHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        req={'sid':self.get_argument("sid"),}
        res_temp=player.search_music_info(req['sid'], mode=1)
        if res_temp:
            res = True
            player.relPlayListAndCount()
        else:
            res=False
        self.write( tornado.escape.json_encode({'result':res} ))

# 下一曲
class AjaxNextSongHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        res=player.nextMusic()
        self.write( tornado.escape.json_encode({'song_id':res} ))

# 下一曲
class AjaxPrevSongHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        res=player.prevMusic()
        self.write( tornado.escape.json_encode({'song_id': res}))

# 关机
class AjaxShutdownHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        cookie=self.get_secure_cookie('admin')
        if cookie  == 'admin':
            sTime=self.get_argument("stime")
            player.shutdownFlag=True
            player.shutdownTime=time.time()+int(sTime)
            self.write( tornado.escape.json_encode({'result': True}))
        else:
            self.write( tornado.escape.json_encode({'result': False}))
#获取关机时间
class AjaxGetShutdownTimeHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        cookie=self.get_secure_cookie('admin')
        if cookie  == 'admin':
            sTime=player.shutdownTime-time.time()
            sTime=str(int(sTime/60))+":"+str(int(sTime%60))
            self.write( tornado.escape.json_encode({'result': sTime}))
        else:
            self.write( tornado.escape.json_encode({'result': False}))

#取消关机
class AjaxCancelShutdownHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        cookie=self.get_secure_cookie('admin')
        if cookie  == 'admin':
            player.shutdownFlag=False
            player.shutdownTime=0
            self.write( tornado.escape.json_encode({'result': True}))
        else:
            self.write( tornado.escape.json_encode({'result': False}))

#修改密码
class AjaxChangePwdHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        cookie=self.get_secure_cookie('admin') 
        if cookie  == 'admin':
            req={'nowpwd':self.get_argument("nowpwd"), 'newpwd': self.get_argument("newpwd")}
            res=db.change_pwd(req['nowpwd'],req['newpwd'])
            self.write( tornado.escape.json_encode({'result': res}))

        else:
            self.write( tornado.escape.json_encode({'result': False}))

# 获取最新歌单
class AjaxListHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        req_tmp=NetEase.top_playlists(limit=200)
        req=NetEase.dig_info(req_tmp,"top_playlists")
        self.write(tornado.escape.json_encode(req))

# 获取歌单歌曲列表
class AjaxClassesGetSongListHandler(tornado.web.RequestHandler):
    def initialize(self):
        '''database init'''
        self.sid = self.get_secure_cookie("sid")
        #self.data = session.get(self.sid)
        #self.set_secure_cookie("sid",self.data['_id'])
    def get(self):
        self.write( tornado.escape.json_encode( {'result': False, 'info': '拒绝GET请求！！' } ) )
    def post(self):
        req_tmp={'playlist_id':self.get_argument("playlist_id")}
        req=NetEase.dig_info(NetEase.playlist_detail(req_tmp['playlist_id']),"songs")
        self.write(tornado.escape.json_encode(req))

def base_url(path):
    return "http://127.0.0.1/"+path

def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main() 

