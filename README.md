# 关于  MyMusicBox 
---
#效果图

![](http://7xkdyj.com1.z0.glb.clouddn.com/1.jpg)
![](http://7xkdyj.com1.z0.glb.clouddn.com/2.jpg)
![](http://7xkdyj.com1.z0.glb.clouddn.com/3.jpg)
![](http://7xkdyj.com1.z0.glb.clouddn.com/4.jpg)
![](http://7xkdyj.com1.z0.glb.clouddn.com/5.jpg)
![](http://7xkdyj.com1.z0.glb.clouddn.com/6.jpg)
![](http://7xkdyj.com1.z0.glb.clouddn.com/8.jpg)


#实现

1. 基于网易云音乐的API
2. 基于[夏日小草](http://homeway.me/)的py进行修改
3. 用jquery mobile重写前端
4. 改mongodb为sqlite
5. 增加播放列表循环播放 
6. 增加管理密码
7. 增加定时关机

#起因
1. 一直想有一个好用好控制的背景音乐播放器
2. 朋友送的树莓派闲置已久
3. 很喜欢网易云音乐
4. 从2014年学习了python基础后就没有实践过
5. 正好在学html、css以及js基础（还没有学完呢。。）
6. 恰好在weibo上看到夏日小草的《[基于网易云音乐API的无线音箱](http://segmentfault.com/a/1190000002597540)》 [[github]](https://github.com/grasses/NetEase-Wireless-MusicBox)
7. 测试并看了一下源码，觉得我还能驾驭
8. 测试过程中遇到一些问题，和一些新的功能需求
9. 于是从5月下旬开始动手

#过程
1. 由于一直在出差，只能晚上撸码
2. 第一次写前端，第一次写Python，第一次了解http等等，所有过程很长
3. 在学习js的过程中，接触了jquery，感觉很好用，又有一本jmobile的书，于是前端最后选择了jmobile
4. 先是在熟悉jmobile的过程中给前端定了一个最基本的界面
5. 然后用ajax实现每一个功能，反复测试
6. 再看了API功能，调整了一些功能
7. 最后改用了sqlite，增加了播放列表
8. 最后是自动播放一下曲，想了5天，看了多线程编程，最后才想出一个笨办法
9. 然后就没有然后了
10. 很多第一次啊

#更新

1. 2015-7-14：由于最近工作忙，还是坚持更新了一些东西，但是没有时间过多的测试了。反正现在基本的功能都有了，在使用的过程中发现问题再修改吧。
2. 2016-1-31：修复了一些我在使用中觉得有问题的地方
3. 2017-1-5: 更换pygame为mpg123来播放歌曲，解决由于歌曲码率不一样而出现的变调问题
4. 2017-6-2：修复了一些小问题，同时解决网易全新API不能获取歌曲地址问题，转眼快两年时间了，也没有太多变化
5. 2017-12-14：实在没有时间，看到部分功能又有问题，都出在API上，参考了[ NetEase-MusicBox](https://github.com/darknessomi/musicbox)项目修改后的代码，解决部分问题

#树莓派设置说明
1. 由于raspbian在安装后就没有用过图形界面，一直是用TTL或SSH,在使用过程中发现一个问题，树莓派默认是声音没有开到最大，直接使用就会出现声音很小的情况。调整代码`amixer set PCM 98%`
2. 另由于程序使用到了关机，所以要用root权限。而每次开机用SSH去启动又太麻烦。
3. 最后，把`amixer sset PCM 98%`和`python ~/mymusicbox/index.py`添加到/etc/init.d/rc.local 的最后


# License

GPL