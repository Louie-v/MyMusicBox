/**
 * __author__ = 'Louie.v (louie.vv@gmail.com)'
 */

$("windows").ready(function windowsReady () {
	$(".pausebtn").attr({
			onclick: 'ajaxPauseMusic()'
		});
	$(".playbtn").attr({
			onclick: 'ajaxPlayMusic()'
		});

	// 设置翻页按钮行为
	$("#hotsongpre").attr({
		onclick: '',
	});
	$("#hotsongnext").attr({
		onclick: 'HotSongNext(2)',
	});
	// 设置上、下一曲按钮行为
	$(".nextbtn").attr('onclick', 'ajaxNextSong()');
	$(".prevbtn").attr('onclick', 'ajaxPrevSong()');

	ajaxGetHistory()
})

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
		.done(function() {
			ajaxGetSong(musicSid);
			$(".playbtn").html("正在播放");
			$(".pausebtn").html("暂停");
			$(".pausebtn").attr({
				onclick: 'ajaxPauseMusic()',
			});
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
			$(".playbtn").html("正在播放");
			$(".pausebtn").html("暂停");
			$(".pausebtn").attr({
				onclick: 'ajaxPauseMusic()',
			});
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
 * [歌曲排行榜]
 * @param  {int} offset [起始序号]
 * @param  {int} limit  [范围]
 * @return {无}        [无]
 */
function ajaxHotSong (offset,limit) {
	showLoader();
	$.ajax({
		url: '/ajaxHotSong',
		type: 'POST',
		dataType: 'JSON',
		data: {'offset': offset, 'limit':limit },
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
			html+='<li class="li'+i+'"><a href="#songspage" onclick="ajaxArtistsSongList(\''+result[i]['artist_id']+'\')">'+result[i]["artists_name"]+'  |  '+result[i]['alias']+'</a></li>'
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
			html+='<li class="li'+i+'"><a href="#album" onclick="ajaxGetAlbum(\''+result[i]['album_id']+'\')">'+result[i]["albums_name"]+'  |  '+result[i]['artists_name']+'</a></li>'
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
		$(".playbtn").attr({
			onclick: 'ajaxUnPauseMusic()'
		});
		$(".playbtn").html("继续播放");
		// 设置暂停按钮行为
		$(".pausebtn").html("已暂停");
		$(".pausebtn").attr({
			onclick: ''
		});
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
		$(".playbtn").html("正在播放");
		$(".playbtn").attr({
			onclick: ''
		});
		// 还原暂停按钮功能
		$(".pausebtn").html("暂停");
		$(".pausebtn").attr({
			onclick: 'ajaxPauseMusic()'
		});
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
		$("#album_picurl").attr('src', req[0]['album_picurl']);
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
		alert("请填写搜索内容");
	}

	
}

/**
 * [热门歌曲下一页]
 * @param  {int} page [页码]
 * @return {无}      [无]
 */
function HotSongNext (page) {
	if (page && page >1) {
		ajaxHotSong((page-1)*20,page*20-1);
		// 设置翻页按钮行为
		prevpage=page-1;
	$("#hotsongpre").attr({
			onclick: 'HotSongPre('+prevpage+')',
		});
		nextpage=page+1;
		$("#hotsongnext").attr({
			onclick: 'HotSongNext('+nextpage+')',
		});
	};
}

/**
 * [热门歌曲上一页]
 * @param  {[int]} page [页码]
 * @return {无}      [无]
 */
function HotSongPre (page) {
	if (page && page >0) {
		ajaxHotSong((page-1)*20,page*20-1);
		if (page==1) {
			$("#hotsongpre").attr({
				onclick: '',
			});
		}else{
			prevpage=page-1;
			$("#hotsongpre").attr({
				onclick: 'HotSongPre('+prevpage+')',
			});
		};
		nextpage=page+1;
		$("#hotsongnext").attr({
			onclick: 'HotSongNext('+nextpage+')',
		});
	};
}

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
			console.log("success");
			if(req['result']==true)
			{
				alert("添加成功！");
				releasePlayList(sid);
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

		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	}

	
}

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