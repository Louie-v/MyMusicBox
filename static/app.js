/**
 * __author__ = 'Louie.v (Check.vv@gmail.com)'
 */

$("windows").ready(function windowsReady () {
	//初始化按钮
	$(".pausebtn").each(function() {
		$(this).attr({
			onclick: 'ajaxPauseMusic()'
		});
	});

	$(".playbtn").each(function() {
		$(this).attr({
			onclick: 'ajaxPlayMusic()'
		});
	});
	// $(".pausebtn").attr({
	// 		onclick: 'ajaxPauseMusic()'
	// 	});
	// $(".playbtn").attr({
	// 		onclick: 'ajaxPlayMusic()'
	// 	});
	//设置两个输入框焦点
	$("#searchinput").focus();
	$("#pwd").focus();
	//搜索绑定回车
	$("#searchinput").keydown(function(event) {
		if(event.keyCode===13){
			ajaxSearch();
		}
	});

	//密码绑定回车
	$("#pwd").keydown(function(event) {
		if(event.keyCode===13){
			ajaxLoginConfrim();
		}
	});

	// 设置上、下一曲按钮行为
	$(".nextbtn").each(function() {
		$(this).attr({
			onclick: 'ajaxNextSong()'
		});
	});

	$(".prevbtn").each(function() {
		$(this).attr({
			onclick: 'ajaxPrevSong()'
		});
	});
	// $(".nextbtn").attr('onclick', 'ajaxNextSong()');
	// $(".prevbtn").attr('onclick', 'ajaxPrevSong()');
	
	//初始化播放列表
	ajaxGetHistory();


	//定时获取播放状态
	var playInfo = self.setInterval("getPlayInfo()",1000);
})

//定时获取播放状态函数功能实现
//---todo--------------------------
function getPlayInfo(){
	console.log("test");
}

//显示加载器  
function showLoader() {  
    //显示加载器.for jQuery Mobile 1.2.0  
    $.mobile.loading('show', {  
        text: '加载中...', //加载器中显示的文字  
        textVisible: true, //是否显示文字  
        theme: 'b',        //加载器主题样式a-e  
        textonly: false,   //是否只显示文字  
        html: ""           //要显示的html内容，如图片等  
    });  
}  
  
//隐藏加载器.for jQuery Mobile 1.2.0  
function hideLoader()  
{  
    //隐藏加载器  
    $.mobile.loading('hide');  
}  

/**
 * [播放音乐]
 * @param  {int} musicSid [音乐Sid]
 * @return {无}          [无]
 */
function ajaxPlayMusic (musicSid) {
	if(musicSid){
		showLoader();
		$.ajax({
			url: '/ajaxPlayMusic',
			type: 'POST',
			dataType: 'JSON',
			data: {sid: musicSid,},
		})
		.done(function(res) {
			if (res['result'] == true){
				ajaxGetSong(musicSid);
				$(".playbtn").each(function() {
					$(this).html("正在播放");
				});

				$(".pausebtn").each(function() {
					$(this).html("暂停");
					$(this).attr({
						onclick: "ajaxPauseMusic()"
					});
				});
			}
			else{
				alert('播放失败');
			}
			
			// $(".playbtn").html("正在播放");
			// $(".pausebtn").html("暂停");
			// $(".pausebtn").attr({
			// 	onclick: 'ajaxPauseMusic()',
			// });
			// 增加插入列表，解决下载后才更新数据库，导致数据不同步
			releasePlayList(musicSid);

		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			hideLoader();
		});
	}else{
		alert("MusicSid is NULL");
	}
	
}

/**
 * [历史记录播放]
 * @param  {[int]]} musicSid [音乐ID]
 * @return {无}          [无]
 */
function listPlayMusic (musicSid) {
	if(musicSid){
		showLoader();
		$.ajax({
			url: '/ajaxPlayMusic',
			type: 'POST',
			dataType: 'JSON',
			data: {sid: musicSid,},
		})
		.done(function() {
			ajaxGetSong(musicSid);
			$(".playbtn").each(function() {
				$(this).html("正在播放");
			});

			$(".pausebtn").each(function() {
				$(this).html("暂停");
				$(this).attr({
					onclick: 'ajaxPauseMusic()'
				});
			});
			// $(".playbtn").html("正在播放");
			// $(".pausebtn").html("暂停");
			// $(".pausebtn").attr({
			// 	onclick: 'ajaxPauseMusic()',
			// });
			hideLoader();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			hideLoader();
		});
	}else{
		alert("MusicSid is NULL");
	}
	
}

/**
 * [排行榜标题处理]
 * @param  {int} idx [排行榜类型索引]
 * @return {无}     [无]
 */
function hotSongTitleSwitch (idx) {
	switch(idx){
		case 0:
			$("#topsongtitle").val("云音乐新歌榜");
			break;
		case 1:
			$("#topsongtitle").html("云音乐热歌榜");
			break;
		case 2:
			$("#topsongtitle").html("网易原创歌曲榜");
			break;
		case 3:
			$("#topsongtitle").html("云音乐飙升榜");
			break;
		case 4:
			$("#topsongtitle").html("云音乐电音榜");
			break;
		case 5:
			$("#topsongtitle").html("UK排行榜周榜");
			break;
		case 6:
			$("#topsongtitle").html("美国Billboard周榜");
			break;
		case 7:
			$("#topsongtitle").html("KTV嗨榜");
			break;
		case 8:
			$("#topsongtitle").html("iTunes榜");
			break;
		case 9:
			$("#topsongtitle").html("Hit FM Top榜");
			break;
		case 10:
			$("#topsongtitle").html("日本Oricon周榜");
			break;
		case 11:
			$("#topsongtitle").html("韩国Melon排行榜周榜");
			break;
		case 12:
			$("#topsongtitle").html("韩国Mnet排行榜周榜");
			break;
		case 13:
			$("#topsongtitle").html("韩国Melon原声周榜");
			break;
		case 14:
			$("#topsongtitle").html("中国TOP排行榜(港台榜)");
			break;
		case 15:
			$("#topsongtitle").html("中国TOP排行榜(内地榜)");
			break;
		case 16:
			$("#topsongtitle").html("香港电台中文歌曲龙虎榜");
			break;
		case 17:
			$("#topsongtitle").html("华语金曲榜");
			break;
		case 18:
			$("#topsongtitle").html("中国嘻哈榜");
			break;
		case 19:
			$("#topsongtitle").html("法国 NRJ EuroHot 30周榜");
			break;
		case 20:
			$("#topsongtitle").html("台湾Hito排行榜");
			break;
		case 21:
			$("#topsongtitle").html("Beatport全球电子舞曲榜");
			break;
		default:
			$("#topsongtitle").html("排行榜");
	}
}

/**
 * [歌曲排行榜]
 * @param  {int} offset [起始序号]
 * @param  {int} limit  [范围]
 * @return {无}        [无]
 */
function ajaxHotSong (idx) {
	showLoader();
	$.ajax({
		url: '/ajaxHotSong',
		type: 'POST',
		dataType: 'JSON',
		data: {'idx': idx},
	})
	.done(function(res) {
		console.log("success");
		var result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#songDialog" data-rel="dialog" data-transition="none" onclick="ajaxSongDialogGetSong(\''+result[i]['song_id']+'\')">'+result[i]["song_name"]+'  |  '+result[i]['artist']+'</a><a href="#" data-theme="b" onclick="ajaxPlayMusic(\''+result[i]['song_id']+'\')"></a></li>'
		};
		$("#hotsonglist").html(html);
		$("#hotsonglist").listview("refresh");
		hotSongTitleSwitch(idx);
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [歌手排行]
 * @param  {int} offset [起始序号]
 * @param  {int} limit  [范围]
 * @return {无}        [无]
 */
function ajaxHotArtists (offset,limit) {
	showLoader();
	$.ajax({
		url: '/ajaxHotArtists',
		type: 'POST',
		dataType: 'JSON',
		data: {'offset': 0, 'limit':100 },
	})
	.done(function(res) {
		console.log("success");
		var result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#songspage" data-transition="slide" onclick="ajaxArtistsSongList(\''+result[i]['artist_id']+'\')">'+result[i]["artists_name"]+'  |  '+result[i]['alias']+'</a></li>'
		};
		$("#artistslist").html(html);
		$("#artistslist").listview("refresh");
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [最新歌单]
 * @param  {int} offset [起始序号]
 * @param  {[int]} limit  [范围]
 * @return {[无]}        [无]
 */
function ajaxNewAlbums () {
	showLoader();
	$.ajax({
		url: '/ajaxNewAlbums',
		type: 'POST',
		dataType: 'JSON',
		data: {'offset': 0, 'limit':20 },
	})
	.done(function(res) {
		console.log("success");
		result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#album" data-transition="slide" onclick="ajaxGetAlbum(\''+result[i]['album_id']+'\')">'+result[i]["albums_name"]+'  |  '+result[i]['artists_name']+'</a></li>'
		};
		$("#albumslist").html(html);
		$("#albumslist").listview("refresh");
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [DJ榜单]
 * @param  {int} offset [起始序号]
 * @param  {int} limit  [范围]
 * @return {无}        [无]
 */
function ajaxDjChannels (offset,limit) {
	showLoader();
	$.ajax({
		url: '/ajaxDjChannels',
		type: 'POST',
		dataType: 'JSON',
		data: {'stype': 0, 'offset': 0, 'limit':10 },
	})
	.done(function(res) {
		console.log("success");
		var result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#songDialog" data-rel="dialog" data-transition="none" onclick="ajaxSongDialogGetSong(\''+result[i]['song_id']+'\')">'+result[i]["song_name"]+'  |  '+result[i]['artist']+'</a><a href="#" data-theme="b" onclick="ajaxPlayMusic(\''+result[i]['song_id']+'\')"></a></li>'
		};
		$("#djlist").html(html);
		$("#djlist").listview("refresh");
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [设置音量]
 * @return {无} [无]
 */
function ajaxSetVolume () {
	$.ajax({
		url: '/ajaxSetVolume',
		type: 'POST',
		dataType: 'JSON',
		data: {'value': $("input[id='points']").val()/100,},//pygame的音量为0~1.0的float
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

}

/**
 * [暂停音乐]
 * @return {无} [无]
 */
function ajaxPauseMusic () {
	$.ajax({
		url: '/ajaxPauseMusic',
		type: 'POST',
		dataType: 'JSON',
		data: {},
	})
	.done(function() {
		// 设置播放按钮行为
		// 
		$(".playbtn").each(function() {
			$(this).attr({
				onclick: 'ajaxUnPauseMusic()'
			});
		});

		$(".playbtn").each(function() {
			$(this).html('继续播放');
		});

		$(".pausebtn").each(function() {
			$(this).html("已暂停");
		});

		$(".pausebtn").each(function() {
			$(this).attr({
				onclick: ''
			});
		});
		// $(".playbtn").attr({
		// 	onclick: 'ajaxUnPauseMusic()'
		// });
		// $(".playbtn").html("继续播放");
		// // 设置暂停按钮行为
		// $(".pausebtn").html("已暂停");
		// $(".pausebtn").attr({
		// 	onclick: ''
		// });
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

/**
 * [继续播放]
 * @return {无} [无]
 */
function ajaxUnPauseMusic () {
	$.ajax({
		url: '/ajaxUnPauseMusic',
		type: 'POST',
		dataType: 'JSON',
		data: {},
	})
	.done(function() {
		console.log("success");
		$(".playbtn").each(function() {
			$(this).html("正在播放");
		});

		$(".playbtn").each(function() {
			$(this).attr({
				onclick: ''
			});
		});

		//还原暂停按钮功能
		$(".pausebtn").each(function() {
			$(this).html("暂停");
		});

		$(".pausebtn").each(function() {
			$(this).attr({
				onclick: 'ajaxPauseMusic()'
			});
		});
		// $(".playbtn").html("正在播放");
		// $(".playbtn").attr({
		// 	onclick: ''
		// });
		// // 还原暂停按钮功能
		// $(".pausebtn").html("暂停");
		// $(".pausebtn").attr({
		// 	onclick: 'ajaxPauseMusic()'
		// });
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

/**
 * [获取歌曲信息]
 * @param  {int} sid [歌曲sid]
 * @return {无}     [无]
 */
function ajaxGetSong (sid) {
	$.ajax({
		url: '/ajaxGetSong',
		type: 'GET',
		dataType: 'JSON',
		data: {'sid': sid},
	})
	.done(function(req) {
		console.log(req);
		$("#album_picurl").attr('src', req[0]['album_picurl']+'?param=240y240');
		$("#artist").html(req[0]['artist']);
		$("#song_name").html(req[0]['song_name']);
		$("#album_picurl").attr('onclick', 'ajaxPlayMusic(\''+req[0]['song_id']+'\')');
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

/**
 * [播放器-获取歌曲信息]
 * @param  {int} sid [歌曲sid]
 * @return {无}     [无]
 */
function ajaxDialogGetSong (sid) {
	showLoader();
	$.ajax({
		url: '/ajaxGetSong',
		type: 'GET',
		dataType: 'JSON',
		data: {'sid': sid},
	})
	.done(function(req) {
		console.log(req);
		$("#dialog_album_picurl").attr('src', req[0]['album_picurl']);
		$("#dialog_artist").html(req[0]['artist']);
		$("#dialog_song_name").html(req[0]['song_name']);
		$("#dialog_album").html(req[0]['album_name']);
		$("#dialog_playbtn").attr('onclick', 'ajaxPlayMusic(\''+req[0]['song_id']+'\')');
		$("#dialog_delbtn").attr('onclick', 'ajaxDelSong(\''+req[0]['song_id']+'\')');
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [列表-获取歌曲信息]
 * @param  {int} sid [歌曲sid]
 * @return {无}     [无]
 */
function ajaxSongDialogGetSong (sid) {
	showLoader();
	$.ajax({
		url: '/ajaxGetSong',
		type: 'GET',
		dataType: 'JSON',
		data: {'sid': sid},
	})
	.done(function(req) {
		console.log(req);
		$("#songDialog_album_picurl").attr('src', req[0]['album_picurl']);
		$("#songDialog_artist").html(req[0]['artist']);
		$("#songDialog_song_name").html(req[0]['song_name']);
		$("#songDialog_album").html(req[0]['album_name']);
		$("#songDialog_playbtn").attr('onclick', 'ajaxPlayMusic(\''+req[0]['song_id']+'\')');
		$("#songDialog_addbtn").attr('onclick', 'ajaxreleasePlayListDb(\''+req[0]['song_id']+'\')');
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [搜索歌曲]
 * @return {无} [无]
 */
function ajaxSearch () {
	key=$("#searchinput").val();
	if(key){
		showLoader();
		$.ajax({
			url: '/ajaxSearch',
			type: 'POST',
			dataType: 'JSON',
			data: {'key': key,},
		})
		.done(function(res) {
			console.log("success");
			$.mobile.changePage("#songspage",{ transition: "slide" });
			var result=res;
			var html='';
			for (var i =0; i <result.length; i++) {
				html+='<li class="li'+i+'"><a href="#songDialog" data-rel="dialog" data-transition="none" onclick="ajaxSongDialogGetSong(\''+result[i]['song_id']+'\')">'+result[i]["song_name"]+'  |  '+result[i]['artist']+'</a><a href="#" data-theme="b" onclick="ajaxPlayMusic(\''+result[i]['song_id']+'\')"></a></li>'
			};
			$("#songslist").html(html);
			$("#songslist").listview("refresh");
			hideLoader();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			hideLoader();
		});
	}else{
		alert("请填写搜索内容!");
	}

	
}

/**
 * [热门歌曲下一页]
 * @param  {int} page [页码]
 * @return {无}      [无]
 */
// function HotSongNext (page) {
// 	if (page && page >1) {
// 		ajaxHotSong((page-1)*20,page*20-1);
// 		// 设置翻页按钮行为
// 		prevpage=page-1;
// 	$("#hotsongpre").attr({
// 			onclick: 'HotSongPre('+prevpage+')',
// 		});
// 		nextpage=page+1;
// 		$("#hotsongnext").attr({
// 			onclick: 'HotSongNext('+nextpage+')',
// 		});
// 	};
// }

/**
 * [热门歌曲上一页]
 * @param  {[int]} page [页码]
 * @return {无}      [无]
 */
// function HotSongPre (page) {
// 	if (page && page >0) {
// 		ajaxHotSong((page-1)*20,page*20-1);
// 		if (page==1) {
// 			$("#hotsongpre").attr({
// 				onclick: '',
// 			});
// 		}else{
// 			prevpage=page-1;
// 			$("#hotsongpre").attr({
// 				onclick: 'HotSongPre('+prevpage+')',
// 			});
// 		};
// 		nextpage=page+1;
// 		$("#hotsongnext").attr({
// 			onclick: 'HotSongNext('+nextpage+')',
// 		});
// 	};
// }

/**
 * [获取专辑信息]
 * @param  {[int]} aid [专辑ID]
 * @return {无}     [无]
 */
function ajaxGetAlbum (aid) {
	showLoader();
	$.ajax({
		url: '/ajaxGetAlbum',
		type: 'GET',
		dataType: 'JSON',
		data: {'aid': aid},
	})
	.done(function(res) {
		console.log("success");
		var result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#songDialog" data-rel="dialog" data-transition="none" onclick="ajaxSongDialogGetSong(\''+result[i]['song_id']+'\')">'+result[i]["song_name"]+'  |  '+result[i]['artist']+'</a><a href="#" data-theme="b" onclick="ajaxPlayMusic(\''+result[i]['song_id']+'\')"></a></li>'
		};

		$("#album_artist").html(result[0]['artist']);
		$("#album_name").html(result[0]['album_name']);
		$("#albumpicurl").attr('src', result[0]['album_picurl']);

		$("#albumsongs").html(html);
		$("#albumsongs").listview("refresh");
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [歌手歌曲列表]
 * @param  {[int]} artists_id [歌手ID]
 * @return {[无]}            [无]
 */
function ajaxArtistsSongList (artists_id) {
	showLoader();
	$.ajax({
		url: '/ajaxArtists',
		type: 'POST',
		dataType: 'JSON',
		data: {'artists_id': artists_id},
	})
	.done(function(res) {
		console.log("success");
		var result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#songDialog" data-rel="dialog" data-transition="none" onclick="ajaxSongDialogGetSong(\''+result[i]['song_id']+'\')">'+result[i]["song_name"]+'  |  '+result[i]['artist']+'</a><a href="#" data-theme="b" onclick="ajaxPlayMusic(\''+result[i]['song_id']+'\')"></a></li>'
		};
		$("#songslist").html(html);
		$("#songslist").listview("refresh");
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [获取播放列表]
 * @return {无} [无]
 */
function ajaxGetHistory () {
	$.ajax({
		url: '/ajaxGetHistory',
		type: 'GET',
		dataType: 'JSON',
	})
	.done(function(res) {
		console.log("success");
		var result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#dialog" data-rel="dialog" data-transition="none" onclick="ajaxDialogGetSong(\''+result[i]['song_id']+'\')">'+result[i]["song_name"]+'  |  '+result[i]['artist']+'</a><a href="#" data-theme="b" onclick="listPlayMusic(\''+result[i]['song_id']+'\')"></a></li>'
		};
		$("#playlist").html(html);
		$("#playlist").listview("refresh");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

/**
 * [前端更新播放列表]
 * @param  {int} sid [歌曲ID]
 * @return {无}     [无]
 */
function releasePlayList (sid) {
	$.ajax({
		url: '/ajaxGetSong',
		type: 'GET',
		dataType: 'JSON',
		data: {'sid': sid},
	})
	.done(function(res) {
		console.log(res);
		result=res
		html=$("#playlist").html();
		// 重复插入判断
		if(html.indexOf(sid.toString())<0){

		html+='<li class="li'+999+'"><a href="#dialog" data-rel="dialog" data-transition="none" onclick="ajaxDialogGetSong(\''+result[0]['song_id']+'\')">'+result[0]["song_name"]+'  |  '+result[0]['artist']+'</a><a href="#" data-theme="b" onclick="listPlayMusic(\''+result[0]['song_id']+'\')"></a></li>';
		$("#playlist").html(html);
		$("#playlist").listview("refresh");
	}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

/**
 * [更新播放列表]
 * @param  {int} sid [歌曲ID]  
 * @return {无} [无]
 */
function ajaxreleasePlayListDb (sid) {
	showLoader();
	if (sid){
		$.ajax({
			url: '/ajaxAddSong',
			type: 'POST',
			dataType: 'JSON',
			data: {'sid': sid},
		})
		.done(function(req) {
			if(req['result'] == 1)
			{
				alert("添加成功！");
				releasePlayList(sid);
				console.log("success");
			}
			if(req['result'] == -1){
				alert('添加失败');
			}
			if(req['result'] == 2){
				alert("歌曲已存在");
			}
			hideLoader();
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			hideLoader();
		});
	}else{
		alert("MusicSid is NULL");
	}
	
}

/**
 * [删除播放列表当前歌曲]
 * @param  {int} sid [歌曲ID]
 * @return {无}     [无]
 */
function ajaxDelSong (sid) {
	showLoader();
	$.ajax({
		url: '/ajaxDelSong',
		type: 'POST',
		dataType: 'JSON',
		data: {'sid': sid},
	})
	.done(function(req) {
		hideLoader();
		console.log('success');
		if (req['result']==true){
			alert("删除成功！");
			$(".playbtn").each(function() {
				$(this).html("请选择歌曲");
				$(this).attr({
					onclick: ''
				});
			});

			$(".pausebtn").each(function() {
				$(this).html("暂停");
				$(this).attr({
					onclick: ''
				});
			});
			// $(".playbtn").html("请选择歌曲");
			// $(".playbtn").attr('onclick', '');
			// $(".pausebtn").html("暂停");
			// $(".pausebtn").attr('onclick', '');
			ajaxGetHistory();

		}else{
			alert("删除失败！")
		}

	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

/**
 * [删除全部歌曲]
 * @return {无} [无]
 */
function ajaxDelAllSong () {
	if(confirm("是否全部删除")){
		showLoader();
		$.ajax({
			url: '/ajaxDelAllSong',
			type: 'POST',
			dataType: 'JSON',
		})
		.done(function(req) {
			hideLoader();
			console.log("success");
			if (req['result']==true){
				alert("删除成功！");
				$("#album_picurl").attr('src', 'static/123.jpg');
				$("#artist").html('');
				$("#song_name").html('');
				$("#album_picurl").attr('onclick', '');

				$(".playbtn").each(function() {
					$(this).html("请选择歌曲");
					$(this).attr({
						onclick: ''
					});
				});

				$(".pausebtn").each(function() {
					$(this).html("暂停");
					$(this).attr({
						onclick: ''
					});
				});
				
				ajaxGetHistory();

			}else{
				alert("删除失败！")
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	}
}

/**
 * [下一曲]
 * @return {无} [无]
 */
function ajaxNextSong () {
	showLoader();
	$.ajax({
		url: '/ajaxNextSong',
		type: 'POST',
		dataType: 'JSON',
	})
	.done(function(res) {
		console.log("success");
		if(res['song_id'] != 110) {
			ajaxGetSong(res['song_id']);
			hideLoader();
		}
		else
			alert("播放列表为空！请添加歌曲");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [上一曲]
 * @return {无} [无]
 */
function ajaxPrevSong () {
	showLoader();
	$.ajax({
		url: '/ajaxPrevSong',
		type: 'POST',
		dataType: 'JSON',
	})
	.done(function(res) {
		console.log("success");
		if(res['song_id'] != 110){
			ajaxGetSong(res['song_id']);
			hideLoader();
		}
		else
			alert("播放列表为空！请添加歌曲");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [关机]
 * @return {无} [无]
 */
function ajaxShutdown () {
	if(confirm("确认关机")){
		var stime=0;
		stime=$("#shutdowntime").val();
		if(!stime){
			stime=0;
		}

		$.ajax({
			url: '/ajaxShutdown',
			type: 'POST',
			dataType: 'JSON',
			data: {'stime': stime},
		})
		.done(function() {
			console.log("success");
			$("#stbtn").html("取消关机");
			$("#stbtn").attr('onclick', 'ajaxCancelShutdown()');
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	}

	
}

/**
 * [登录确认]
 * @return {无} [无]
 */
function ajaxLoginConfrim () {
	var pwd=$("#pwd").val();
	if(pwd){
		showLoader();
		$.ajax({
			url: '/',
			type: 'POST',
			dataType: 'JSON',
			data: {'pwd': pwd},
		})
		.done(function(res) {
			console.log("success");
			if(res['result']==true){
				window.location='index';
			}
			else{
				alert("验证失败，请重试！");
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
			hideLoader();
		});
	}
	else{
		alert("请输入管理密码！");
	}
}

/**
 * [取消关机]
 * @return {无} [无]
 */
function ajaxCancelShutdown () {
	$.ajax({
		url: '/ajaxGetShutdownTime',
		type: 'POST',
		dataType: 'JSON',
	})
	.done(function(res) {
		console.log("success");
		result=res["result"];
		if(confirm("系统将在"+result+"后关闭，确认取消关机？")){
			$.ajax({
				url: '/ajaxCancelShutdown',
				type: 'POST',
				dataType: 'JSON',
			})
			.done(function(res1) {
				console.log("success");
				result1=res1["result"];
				if(result1==true){
					$("#stbtn").html("关机");
					$("#stbtn").attr('onclick', 'ajaxShutdown()');
					alert("取消成功");
				}
				
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
			
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}

/**
 * [修改密码确认]
 * @return {无} [无]
 */
function newPwdConfrimOnChange () {
	newpwd=$("#newpwd").val();
	newpwdconfrim=$("#newpwdconfrim").val();
	nowpwd=$("#nowpwd").val();
	if(nowpwd !="" || nowpwd ){
		if(newpwd !=newpwdconfrim || newpwd == "" || newpwdconfrim == ""){
			$("#changepwdbtn").html("新密码两次不一至或不能为空");
			$("#changepwdbtn").attr('onclick', '');
		}else{
			$("#changepwdbtn").html("确认修改");
			$("#changepwdbtn").attr('onclick', 'ajaxChangePwd()');
		};
	}else{
		$("#changepwdbtn").html("请输入原密码");
		$("#changepwdbtn").attr('onclick', '');
		$("#nowpwd").focus();
	};
}

/**
 * [修改密码]
 * @return {无} [无]
 */
function ajaxChangePwd () {
	nowpwd=$("#nowpwd").val();
	newpwd=$("#newpwd").val();

	if(newpwd != "" || newpwd || pwd == "" || pwd){
		$.ajax({
			url: '/ajaxChangePwd',
			type: 'POST',
			dataType: 'JSON',
			data: {'newpwd': newpwd, 'nowpwd': nowpwd},
		})
		.done(function(res) {
			console.log("success");
			result=res;
			if (result['result']==true) {
				alert("修改成功");
			}else{
				alert("修改失败");
			};
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	};
		
}
/**
 * [获取最新歌单列表]
 * @return {无} [无]
 */
function ajaxList(){
	showLoader();
	$.ajax({
		url: '/ajaxList',
		type: 'POST',
		dataType: 'JSON',
		
	})
	.done(function(res) {
		console.log("success");
		var result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#songspage" data-transition="none" onclick="ajaxClassesGetSongList(\''+result[i]['playlist_id']+'\')">'+result[i]["playlists_name"]+'  |  '+result[i]['creator_name']+'</a></li>'
		};
		$("#classeslist").html(html);
		$("#classeslist").listview("refresh");
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}

/**
 * [获取歌单列表]
 * @param  {int} playlist_id [歌单id]
 * @return {无}             [无]
 */
function ajaxClassesGetSongList (playlist_id) {
	showLoader();
	$.ajax({
		url: '/ajaxClassesGetSongList',
		type: 'POST',
		dataType: 'JSON',
		data: {'playlist_id': playlist_id},
	})
	.done(function(res) {
		console.log("success");
		var result=res;
		var html='';
		for (var i =0; i <result.length; i++) {
			html+='<li class="li'+i+'"><a href="#songDialog" data-rel="dialog" data-transition="none" onclick="ajaxSongDialogGetSong(\''+result[i]['song_id']+'\')">'+result[i]["song_name"]+'  |  '+result[i]['artist']+'</a><a href="#" data-theme="b" onclick="ajaxPlayMusic(\''+result[i]['song_id']+'\')"></a></li>'
		};
		$("#songslist").html(html);
		$("#songslist").listview("refresh");
		hideLoader();
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
		hideLoader();
	});
	
}