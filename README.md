# 关于  MyMusicBox 
---
#效果图
1. 登录验证![](http://7xkdyj.com1.z0.glb.clouddn.com/1.jpg)
2. 导航![](http://7xkdyj.com1.z0.glb.clouddn.com/2.jpg)
3. 歌手列表![](http://7xkdyj.com1.z0.glb.clouddn.com/3.jpg)
4. 歌曲列表![](http://7xkdyj.com1.z0.glb.clouddn.com/4.jpg)
5. 歌曲信息![](http://7xkdyj.com1.z0.glb.clouddn.com/5.jpg)
6. 播放列表![](http://7xkdyj.com1.z0.glb.clouddn.com/6.jpg)
7. 设置![](http://7xkdyj.com1.z0.glb.clouddn.com/8.jpg)


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



# License

GPL