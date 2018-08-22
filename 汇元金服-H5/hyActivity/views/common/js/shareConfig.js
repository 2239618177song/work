/**
 * 微信分享代码
 */

/*define(['jquery','tool'],function($,T){*/
	var configWeixin = function(obj){
		var title = obj.title,
				link = obj.link,
				imgUrl = obj.imgUrl,
				desc = obj.desc,
				url = window.location.href,
				success = obj.success,
				cancel = obj.cancel;
				
			TL.Ajax({
				url:'wxSign',
				data:{
					url:url
				},
				type:'post'
			}).done(function(data){
				
				var ret = data;
				wx.config({
				    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: 'wx209ac5b8b42fd9fe', // 必填，公众号的唯一标识
				    timestamp: ret.timestamp, // 必填，生成签名的时间戳
				    nonceStr: ret.nonceStr, // 必填，生成签名的随机串
				    signature: ret.signature,// 必填，签名，见附录1
				    jsApiList: [
		                'onMenuShareTimeline',
						'onMenuShareAppMessage',
						'onMenuShareQQ',
						'onMenuShareQZone'
						] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				
				wx.ready(function(){
					//分享到朋友圈
					wx.onMenuShareTimeline({
					    title: title, // 分享标题
					    link: link, // 分享链接
					    imgUrl: imgUrl, // 分享图标
					    success: function () { 
					        // 用户确认分享后执行的回调函数
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
					});
					
					//分享给好友
					wx.onMenuShareAppMessage({
					    title: title, // 分享标题
					    desc: desc, // 分享描述
					    link: link, // 分享链接
					    imgUrl: imgUrl, // 分享图标
					    type: '', // 分享类型,music、video或link，不填默认为link
					    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					    success: function () {
                            document.getElementById('state').innerHTML = JSON.stringify('分享成功aaa');
					        // 用户确认分享后执行的回调函数
					    },
					    cancel: function () {
                            document.getElementById('state').innerHTML = JSON.stringify('分享成功aaa');
					        // 用户取消分享后执行的回调函数
					    }
					});
					
					//分享到qq
					wx.onMenuShareQQ({
					    title: title, // 分享标题
					    desc: desc, // 分享描述
					    link: link, // 分享链接
					    imgUrl: imgUrl, // 分享图标
					    success:success,
					    cancel: cancel
					});
					
					//分享到qq空间
					wx.onMenuShareQZone({
					    title: title, // 分享标题
					    desc: desc, // 分享描述
					    link: link, // 分享链接
					    imgUrl: imgUrl, // 分享图标
					    success: function () { 
					       // 用户确认分享后执行的回调函数
					    },
					    cancel: function () { 
					        // 用户取消分享后执行的回调函数
					    }
					});
				});
			}).fail(function(){});
 	}
 	
/* })*/

