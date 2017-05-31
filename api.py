#!/usr/local/python
# -*- coding: utf-8 -*-




'''
网易云音乐 Api
'''
__author__ = "Louie.v (Check.vv@gmail.com)"
import re
import os
import json
import requests
import hashlib
import base64
import random
from bs4 import BeautifulSoup

from Crypto.Cipher import AES
import  rsa
import binascii
top_list_all={
    0:['云音乐新歌榜','/discover/toplist?id=3779629'],
    1:['云音乐热歌榜','/discover/toplist?id=3778678'],
    2:['网易原创歌曲榜','/discover/toplist?id=2884035'],
    3:['云音乐飙升榜','/discover/toplist?id=19723756'],
    4:['云音乐电音榜','/discover/toplist?id=10520166'],
    5:['UK排行榜周榜','/discover/toplist?id=180106'],
    6:['美国Billboard周榜','/discover/toplist?id=60198'],
    7:['KTV嗨榜','/discover/toplist?id=21845217'],
    8:['iTunes榜','/discover/toplist?id=11641012'],
    9:['Hit FM Top榜','/discover/toplist?id=120001'],
    10:['日本Oricon周榜','/discover/toplist?id=60131'],
    11:['韩国Melon排行榜周榜','/discover/toplist?id=3733003'],
    12:['韩国Mnet排行榜周榜','/discover/toplist?id=60255'],
    13:['韩国Melon原声周榜','/discover/toplist?id=46772709'],
    14:['中国TOP排行榜(港台榜)','/discover/toplist?id=112504'],
    15:['中国TOP排行榜(内地榜)','/discover/toplist?id=64016'],
    16:['香港电台中文歌曲龙虎榜','/discover/toplist?id=10169002'],
    17:['华语金曲榜','/discover/toplist?id=4395559'],
    18:['中国嘻哈榜','/discover/toplist?id=1899724'],
    19:['法国 NRJ EuroHot 30周榜','/discover/toplist?id=27135204'],
    20:['台湾Hito排行榜','/discover/toplist?id=112463'],
    21:['Beatport全球电子舞曲榜','/discover/toplist?id=3812895']
    }

# list去重
def uniq(arr):
    arr2 = list(set(arr))
    arr2.sort(key=arr.index)
    return arr2
#
# # 歌曲加密算法, 基于https://github.com/yanunon/NeteaseCloudMusic脚本实现
#
# def encrypted_id(id):
#     magic = bytearray('3go8&$8*3*3h0k(2)2', 'u8')
#     song_id = bytearray(id, 'u8')
#     magic_len = len(magic)
#     for i, sid in enumerate(song_id):
#         song_id[i] = sid ^ magic[i % magic_len]
#     m = hashlib.md5(song_id)
#     result = m.digest()
#     result = base64.b64encode(result)
#     result = result.replace(b'/', b'_')
#     result = result.replace(b'+', b'-')
#     return result.decode('u8')
#
# # 获取高音质mp3 url
# def geturl(song):
#     if song['hMusic']:
#         music = song['hMusic']
#         quality = 'HD'
#     elif song['mMusic']:
#         music = song['mMusic']
#         quality = 'MD'
#     elif song['lMusic']:
#         music = song['lMusic']
#         quality = 'LD'
#     else:
#         return song['mp3Url'], ''
#
#     quality = quality + ' {0}k'.format(music['bitrate'] // 1000)
#     print music
#     dfsId = str(music['dfsId'])
#     enc_id = encrypted_id(dfsId)
#     url = 'http://m%s.music.126.net/%s/%s.mp3' % (random.randrange(1, 3),enc_id, dfsId)
#     return url, quality


default_timeout = 10

class NetEase:
    def __init__(self):
        self.header = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip,deflate,sdch',
            'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'music.163.com',
            'Referer': 'http://music.163.com/search/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
        }
        self.cookies = {
            'appver': '1.5.2',
            '__csrf': '',
            '_ntes_nuid': '',
            '_ntes_nnid' :'',
            'NETEASE_WDA_UID': '',
            'NTES_PASSPORT': '',
        }
        self.playlist_class_dict = {}

    def httpRequest(self, method, action, query=None, urlencoded=None, callback=None, timeout=None, cookies=None ):
        connection = json.loads(self.rawHttpRequest(method, action, query, urlencoded, callback, timeout, cookies))
        return connection

    def rawHttpRequest(self, method, action, query=None, urlencoded=None, callback=None, timeout=None, cookies=None):
        if (method == 'GET'):
            url = action if (query == None) else (action + '?' + query)
            connection = requests.get(url, headers=self.header, timeout=default_timeout, cookies=cookies)

        elif (method == 'POST'):
            connection = requests.post(
                action,
                data=query,
                headers=self.header,
                timeout=default_timeout,
                cookies=self.cookies,
            )
        self.saveCookie(connection)
        connection.encoding = "UTF-8"
        return connection.text

    #保存cookie
    def saveCookie(self, conn):
        try :
            type ( conn.cookies['__csrf'] )
        except :
            pass
        else:
            self.cookies['__csrf'] = conn.cookies['__csrf']

        try :
            type ( conn.cookies['NETEASE_WDA_UID'] )
        except :
            pass
        else:
            self.cookies['NETEASE_WDA_UID'] = conn.cookies['NETEASE_WDA_UID']

    # 登录
    def login(self, username, password):
        pattern = re.compile(r'^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$')
        if (pattern.match(username)):
            return self.phone_login(username, password)
        action = 'https://music.163.com/api/login/'
        data = {
            'username': username,
            'password': hashlib.md5(password).hexdigest(),
            'rememberLogin': 'true'
        }
        try:
            return self.httpRequest('POST', action, data)
        except:
            return {'code': 501}

    # 手机登录
    def phone_login(self, username, password):
        action = 'https://music.163.com/api/login/cellphone'
        data = {
            'phone': username,
            'password': hashlib.md5(password).hexdigest(),
            'rememberLogin': 'true'
        }
        try:
            return self.httpRequest('POST', action, data)
        except:
            return {'code': 501}

    # 刷新csrf_token
    def refresh(self):
        action = 'http://music.163.com/api/login/token/refresh?csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('POST',action)
            return self.cookie['__csrf']
        except:
            return []

    # 用户歌单
    def user_playlist(self, uid, offset=0, limit=100):
        action = 'http://music.163.com/api/user/playlist/?offset=' + str(offset) + '&limit=' + str(limit) + '&uid=' + str(uid)+'&csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('GET', action)
            return data['playlist']
        except:
            return []

    # 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002) *(type)*
    def search(self, s, stype=1, offset=0, total='true', limit=60):
        action = 'http://music.163.com/api/search/get/web'
        print self.cookies
        data = {
            's': s,
            'type': stype,
            'offset': offset,
            'total': total,
            'limit': limit,
            '__csrf': self.cookies['__csrf'],
        }
        return self.httpRequest('POST', action, data)

    # 新碟上架 http://music.163.com/#/discover/album/
    def new_albums(self, offset=0, limit=10):
        print '==>self.cookie', self.cookies['__csrf']
        action = 'http://music.163.com/api/album/new?area=ALL&offset=' + str(offset) + '&total=true&limit=' + str(limit)+'&csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('GET', action)
            return data['albums']
        except:
            return []

    # 歌单（网友精选碟） hot||new http://music.163.com/#/discover/playlist/
    def top_playlists(self, category='全部', order='hot', offset=0, limit=50):
        action = 'http://music.163.com/api/playlist/list?cat=' + category + '&order=' + order + '&offset=' + str(offset) + '&total=' + ('true' if offset else 'false') + '&limit=' + str(limit)+'&csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('GET', action)
            return data['playlists']
        except:
            return []

    # 分类歌单
    def playlist_classes(self):
        #action = 'http://music.163.com/discover/playlist/'+'&csrf_token='+self.cookies['__csrf']
        action = 'http://music.163.com/discover/playlist'
        try:
            data = self.rawHttpRequest('GET', action)
            return data
        except:
            return []

    # 分类歌单中某一个分类的详情
    def playlist_class_detail(self):
        pass

    # 歌单详情
    def playlist_detail(self, playlist_id):
        action = 'http://music.163.com/api/playlist/detail?id=' + str(playlist_id)+'&csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('GET', action)
            return data['result']['tracks']
        except:
            return []

    # 热门歌手 http://music.163.com/#/discover/artist/
    def top_artists(self, offset=0, limit=100):
        action = 'http://music.163.com/api/artist/top?offset=' + str(offset) + '&total=false&limit=' + str(limit)+'&csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('GET', action)
            return data['artists']
        except:
            return []

    # # 热门单曲 http://music.163.com/#/discover/toplist 50
    # def top_songlist(self, offset=0, limit=20):
    #     __offset=int(offset)
    #     __limit=int(limit)
    #     action = 'http://music.163.com/discover/toplist?id=3778678&offsetlimit='+str(__limit)
    #
    #
    #     try:
    #         connection = requests.get(action, headers=self.header, timeout=default_timeout)
    #         connection.encoding = 'UTF-8'
    #         songids = re.findall(r'/song\?id=(\d+)', connection.text)
    #         if songids == []:
    #             return []
    #         # 去重
    #         songids = uniq(songids)
    #         if (len(songids)<__limit):
    #             return self.songs_detail(songids[__offset:(len(songids)+1)])
    #         else:
    #             return self.songs_detail(songids[__offset:(__limit+1)])
    #     except:
    #         return []

    # 热门单曲 http://music.163.com/discover/toplist?id=
    def top_songlist(self,idx=0, offset=0, limit=100):
        action = 'http://music.163.com' + top_list_all[idx][1]
        try:
            connection = requests.get(action, headers=self.header, timeout=default_timeout)
            connection.encoding = 'UTF-8'
            songids = re.findall(r'/song\?id=(\d+)', connection.text)
            if songids == []:
                return []
            # 去重
            songids = uniq(songids)
            return self.songs_detail(songids)
        except:
            return []

    # 歌手单曲
    def artists(self, artist_id):
        action = 'http://music.163.com/api/artist/' + str(artist_id)+'?csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('GET', action)
            return data['hotSongs']
        except:
            return []

    # album id --> song id set
    def album(self, album_id):
        action = 'http://music.163.com/api/album/' + str(album_id)
        try:
            data = self.httpRequest('GET', action)
            return data['album']['songs']
        except:
            return []

    # song ids --> song urls ( details )
    def songs_detail(self, ids):
        # tmpids = ids[offset:limit]
        # tmpids = tmpids[0:30]
        """

        :rtype :
        """
        tmpids = map(str, ids)
        action = 'http://music.163.com/api/song/detail?ids=[' + (',').join(tmpids) + ']'+'&csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('GET', action)
            return data['songs']
        except:
            return []

    # song id --> song url ( details )
    def song_detail(self, music_id):
        action = "http://music.163.com/api/song/detail/?id=" + str(music_id) + "&ids=[" + str(music_id) + "]"+'&csrf_token='+self.cookies['__csrf']
        try:
            data = self.httpRequest('GET', action)
            return data['songs']
        except:
            return []


    # 今日最热（0）, 本周最热（10），历史最热（20），最新节目（30）
    def djchannels(self, stype=0, offset=0, limit=50):
        action = 'http://music.163.com/discover/djchannel?type=' + str(stype) + '&offset=' + str(offset) + '&limit=' + str(limit)+'&csrf_token='+self.cookies['__csrf']
        try:
            connection = requests.get(action, headers=self.header, timeout=default_timeout)
            connection.encoding = 'UTF-8'
            channelids = re.findall(r'/dj\?id=(\d+)', connection.text)
            channelids = uniq(channelids)
            return self.channel_detail(channelids)
        except:
            return []

    # DJchannel ( id, channel_name ) ids --> song urls ( details )
    # 将 channels 整理为 songs 类型
    def channel_detail(self, channelids, offset=0):
        channels = []
        for i in range(0, len(channelids)):
            action = 'http://music.163.com/api/dj/program/detail?id=' + str(channelids[i])+'&csrf_token='+self.cookies['__csrf']
            try:
                data = self.httpRequest('GET', action)
                channel = self.dig_info(data['program']['mainSong'], 'channels')
                channels.append(channel)
            except:
                continue

        return channels

    def dig_info(self, data, dig_type):
        temp = []
        if dig_type == 'songs':
            for i in range(0, len(data)):
                song_info = {
                    'song_id': data[i]['id'],
                    'artist': [],
                    'song_name': data[i]['name'],
                    'album_name': data[i]['album']['name'],
                    'mp3_url': '',
                    'album_picurl': data[i]['album']['blurPicUrl'],
                    'quality': ''
                }

                if 'artist' in data[i]:
                    song_info['artist'] = data[i]['artist']
                elif 'artists' in data[i]:
                    for j in range(0, len(data[i]['artists'])):
                        song_info['artist'].append(data[i]['artists'][j]['name'])
                    song_info['artist'] = ', '.join(song_info['artist'])
                else:
                    song_info['artist'] = '未知艺术家'

                temp.append(song_info)

        elif dig_type == 'artists':
            temp = []
            for i in range(0, len(data)):
                artists_info = {
                    'artist_id': data[i]['id'],
                    'artists_name': data[i]['name'],
                    'alias': ''.join(data[i]['alias'])
                }
                temp.append(artists_info)

            return temp

        elif dig_type == 'albums':
            for i in range(0, len(data)):
                albums_info = {
                    'album_id': data[i]['id'],
                    'albums_name': data[i]['name'],
                    'artists_name': data[i]['artist']['name']
                }
                temp.append(albums_info)

        elif dig_type == 'top_playlists':
            for i in range(0, len(data)):
                playlists_info = {
                    'playlist_id': data[i]['id'],
                    'playlists_name': data[i]['name'],
                    'creator_name': data[i]['creator']['nickname']
                }
                temp.append(playlists_info)


        elif dig_type == 'channels':
            channel_info = {
                'song_id': data['id'],
                'song_name': data['name'],
                'artist': data['artists'][0]['name'],
                'album_name': 'DJ节目',
                'mp3_url': data['mp3Url']
            }
            temp = channel_info

        elif dig_type == 'playlist_classes':
            soup = BeautifulSoup(data)
            dls = soup.select('dl.f-cb')
            for dl in dls:
                title = dl.dt.text
                sub = [item.text for item in dl.select('a')]
                temp.append(title)
                self.playlist_class_dict[title] = sub

        # elif dig_type == 'playlist_class_detail':
        #     log.debug(data)
        #     temp = self.playlist_class_dict[data]

        elif dig_type=='songs_search':
            for i in range(0, len(data)):
                song_info = {
                    'song_id': data[i]['id'],
                    'artist': [],
                    'song_name': data[i]['name'],
                    # 'album_name': data[i]['album']['name'],
                }
                if 'artist' in data[i]:
                    song_info['artist'] = data[i]['artist']
                elif 'artists' in data[i]:
                    for j in range(0, len(data[i]['artists'])):
                        song_info['artist'].append(data[i]['artists'][j]['name'])
                    song_info['artist'] = ', '.join(song_info['artist'])
                else:
                    song_info['artist'] = '未知艺术家'

                temp.append(song_info)

        return temp

class GetUrl:
    def __init__(self):
        self.header = {
            'Accept':'*/*',
            'Accept-Encoding':'gzip, deflate',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Cache-Control':'no-cache',
            'Connection':'keep-alive',
            'Content-Type':'application/x-www-form-urlencoded',
            'Host':'music.163.com',
            'Origin':'http://music.163.com',
            'Pragma':'no-cache',
            'Referer':'http://music.163.com/',
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
        self.keys={
            'songText' : {
                'ids':'',
                'br':128000,
                'csrf_token':''
            },
            'first_key': '0CoJUm6Qyw8W8jud',
            'second_key': self.get_secondkey(16), #random
            'rsa_modulus': '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7',
            'rsa_exp': '010001',
            'iv':'0102030405060708',
            'encSecKey': ''
        }
        self.url='http://music.163.com/weapi/song/enhance/player/url?csrf_token='

    def get_params(self, songid, bitrate=128000):
        text ='{' + '\"ids\":\"[' + str(songid) + ']\",\"br\":'+str(bitrate)+',\"csrf_token\":\"\"}'
        h_encText = self.AES_encrypt(text, self.keys['first_key'], self.keys['iv'])
        h_encText = self.AES_encrypt(h_encText, self.keys['second_key'], self.keys['iv'])
        return h_encText

    def AES_encrypt(self, text, key, iv):
        pad = 16 - len(text) % 16
        text = text + pad * chr(pad)
        encryptor = AES.new(key, AES.MODE_CBC, iv)
        encrypt_text = encryptor.encrypt(text)
        encrypt_text = base64.b64encode(encrypt_text)
        return encrypt_text

    def cal_url(self,url, params, encSecKey):
        data = {
            "params": params,
            "encSecKey": encSecKey
        }
        response = requests.post(url, headers=self.header, data=data)
        return response.content

    def getUrl(self,songid):
        a = self.cal_url(self.url,self.get_params(songid),self.get_encSecKey(self.keys['second_key']))
        if 0 != len(a):
            a = json.loads(a)
            return a['data'][0]['url']
        return -1

    def calcEncSecKey(self,text):
        text1 = text[::-1]
        rs = pow(int(binascii.hexlify(text1), 16), int(self.keys['rsa_exp'], 16), int(self.keys['rsa_modulus'], 16))
        return format(rs, 'x').zfill(256)

    def get_encSecKey(self,text):
        self.keys['encSecKey'] = self.calcEncSecKey(text)
        return self.keys['encSecKey']

    def get_secondkey(self,len):
        return binascii.hexlify(os.urandom(len))[:16]

if __name__ == "__main__":
    url = GetUrl()
    url.getUrl(479422013)
