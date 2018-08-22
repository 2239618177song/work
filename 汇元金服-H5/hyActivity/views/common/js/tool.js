/**
 * 运营活动公用工具脚本
 */
window._config = {
//	mainIP:'http://192.168.1.163:3000',
 	  mainIP:'https://m.huiyuanjinfu.com',
//   ip:'http://192.168.1.157:80',//宋凯
 	 ip:'https://api.huiyuanjinfu.com',
	// ip:'http://192.168.1.152',
	version:'1.0.0',//接口版本号
	//pageSize:10,//分页条数
	OS:'HTML'//平台类型
};

var TL = (function(){
	var Alert = function(text,btnText,callback){
		this.uniqueId = '__'+new Date().getTime();
		/*处理不同个数参数的情况*/
		this.text = text;
		this.btnText = typeof btnText === 'function' ? '确定' : btnText || '确定';
		this.callback = callback || btnText || $.noop;
		/*调用init*/
		Alert.prototype.init.call(this);
	};

	Alert.getTpl = function(uniqueId,text,btnText){
		var tpl = [];
		tpl.push('<div class="__tips_mask" id='+uniqueId+'>');
			tpl.push('<div class="__tips scaleIn">');
				tpl.push('<div class="__content">');
					tpl.push(''+text+'');
				tpl.push('</div>');
				tpl.push('<div class="__btm">');
					tpl.push('<a href="javascript:void(0)" class="doneBtn">'+btnText+'</a>');
				tpl.push('</div>');
			tpl.push('</div>');
		tpl.push('</div>');

		return tpl.join('\n');
	};


	Alert.prototype.init = function(){
		if($('.__tips_mask').length){
			$('.__tips_mask').remove();
		}
		var dom = Alert.getTpl(this.uniqueId,this.text,this.btnText),
			that = this;
		$('body').append(dom);

		$('#'+this.uniqueId+' '+'.doneBtn').bind('click',function(evt){
			that.hide();
			that.callback();
		});
		try{
			FastClick.attach($('#'+this.uniqueId)[0]);
		}catch(err){
			console.log('没有引入fastclick');
		}
		//FastClick && FastClick.attach($('#'+this.uniqueId)[0]);
		return this;
	};

	Alert.prototype.hide = function(){
		$('#'+this.uniqueId).remove();
	};



	var Confirm = function(text,obj){
		this.uniqueId = '__'+new Date().getTime();
		/*处理不同个数参数的情况*/
		this.text = text;
		this.obj = {};
		this.obj.btnDone = (obj && obj.doneText) || '确定';
		this.obj.cbDone = (obj && obj.doneCallback) || $.noop;

		this.obj.btnCancel = (obj && obj.cancelText) || '取消';
		this.obj.cbCancel = (obj && obj.cancelCallback) || $.noop;
		
		/*调用init*/
		Confirm.prototype.init.call(this);
	};

	Confirm.getTpl = function(uniqueId,text,obj){
		var tpl = [];
		tpl.push('<div class="__tips_mask" id='+uniqueId+'>');
			tpl.push('<div class="__tips scaleIn">');
				tpl.push('<div class="__content">');
					tpl.push(''+text+'');
				tpl.push('</div>');
				tpl.push('<div class="__btm">');
					tpl.push('<a href="javascript:void(0)" class="doneBtn half">'+obj.btnDone+'</a>');
					tpl.push('<a href="javascript:void(0)" class="doneCancel half">'+obj.btnCancel+'</a>');
				tpl.push('</div>');
			tpl.push('</div>');
		tpl.push('</div>');

		return tpl.join('\n');
	};

	Confirm.prototype.init = function(){
		var dom = Confirm.getTpl(this.uniqueId,this.text,this.obj),
			that = this;
		$('body').append(dom);

		$('#'+this.uniqueId+' '+'.doneBtn').bind('click',function(evt){
			that.hide();
			that.obj.cbDone();
		});

		$('#'+this.uniqueId+' '+'.doneCancel').bind('click',function(evt){
			that.hide();
			that.obj.cbCancel();
		});

		try{
			FastClick.attach($('#'+this.uniqueId)[0]);
		}catch(err){
			console.log('没有引入fastclick');
		}

		// FastClick && FastClick.attach($('#'+this.uniqueId)[0]);
		return this;
	};


	Confirm.prototype.hide = function(){
		$('#'+this.uniqueId).remove();
	};



	$.Alert = function(text,btnText,callback){
			return new Alert(text,btnText,callback);
	};

	$.Confirm = function(text,obj){
			return new Confirm(text,obj);
	};

	/*需要加密的字段*/
	var encryptMapper = [
		"mobile", "password", "realName", "identifyCard", "userName",
		"payPassword", "newPayPassword", "cardNo"
	];


	
	var layer = {/*随便写写*/ 
	        load:function(){
	            var tpl = [],
	                timestamp = new Date().getTime();
	            tpl.push('');
	            tpl.push('<div id="__layer_load">');
	            tpl.push('<div class="scaleInFast"><img src="/common/images/HY.png" alt="" width="50" height="50"></div>');
	            tpl.push('</div>');

	            $('body').append(tpl.join('\n'));
	        },
	        close:function(){
	            $('#__layer_load').remove();
	        }
	    };
	
	/**
	 * 判断平台
	 * @param  {Function} fn  [description]
	 * @param  {[type]}   opt [description]
	 * @return {[type]}       [description]
	 */
    var judePlatform = function(fn,opt){
    	var d_opt = {
    		native:function(){//原生

    		},
    		wechat:function(){//微信

    		}
    	};

    	opt = $.extend({},d_opt,opt);
		var ua = navigator.userAgent.toLowerCase();

    	if(ua.indexOf('lrapp') == -1){//外部浏览器打开的
			if(ua.match(/MicroMessenger/i)=="micromessenger"){//微信webview
				opt.wechat();
			}else{//其他浏览器
				fn && fn();
			}
		}else{//原生app中
			opt.native();
		}
    };


    var shareConfig = function(){

    };

	/**
	 * 判断是否在app里面
	 */
	var getNativeInfo = function(){
		var ua = navigator.userAgent;
		if(ua.indexOf('LRAPP') == -1){//外部浏览器打开的
			return null;
		}

		var infoArr = ua.slice(ua.indexOf('LRAPP'),ua.length).split('/');
		return {
			apiUid:getQueryField('apiUid'),
			accessToken:getQueryField('accessToken'),
			OS:infoArr[2],
			version:infoArr[1]
		}
	};

	/**
	 * 获取url参数
	 */
	var getQueryField = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return decodeURIComponent(r[2]);
		return null;
	};

	//var app = getNativeInfo();



	//ajax封装
	var Ajax = function(opt){
		var d_opt = {};
		var tmpFunc = opt.beforeSend;
		d_opt.beforeSend = function(jqXHR){
			if(opt.load){
				Ajax.uid = layer.load();
			}

			tmpFunc && tmpFunc();
		};

		d_opt.data = {
			accessToken:getCookie('LR_ACCESSTOKEN'),
			apiUid:getCookie('LR_APIUID'),
			OS:_config.OS,
			version:_config.version,
			clientType:'html',
			rd:new Date().getTime()
		};

		/*合并参数*/
		opt.load = opt.load || false;
		opt.success  = opt.success && d_opt.success;
		opt.error = opt.error  && d_opt.error;
		opt.beforeSend = d_opt.beforeSend;
		opt.data = $.extend({},d_opt.data,opt.data);



		var versionPath = opt.version || opt.data.version;

		opt.url = _config.ip+'/AppApi/v'+versionPath+'/'+opt.url;
		//大于等于1。2.0的时候才加密
		//if(versionPath.replace('.','')*1 >= 12){
			//加密一些敏感信息
			for(var i in opt.data){
				if(encryptMapper.indexOf(i) !== -1 && opt.data.hasOwnProperty(i)){
					opt.data[i] = genreate(opt.data[i]);
				}
			}
		//}

		//opt.url = _config.ip+'/AppApi/v1.0.0/'+opt.url;

		//debugger;
		var jqXHR = $.ajax(opt);
		return {
			done:function(callback,errCallback,needLoginCallback){
				jqXHR.done(function(data){
					if(opt.load) {
						layer.close(Ajax.uid);
					}
					data = typeof data === 'string' ? JSON.parse(data) : data;
					if(data.accessToken != ''){//如果过期了，那就重新设置
						//alert('你给他妈的过期了！');
						setCookie('LR_ACCESSTOKEN',data.accessToken);
					}
					if(data.code*1 === 0){//正常的code
						callback(data.result);
					}else if(data.code*1 === -100 || data.code*1 === -101 || data.code*1 === -102){//表示需要登录了
						needLoginCallback ? needLoginCallback(data.result) : $.noop();
						$.Alert('您还未登录，请先登录',function(){
							//clearUserInfo();//清掉所有的用户相关信息
							//var app = getNativeInfo();
							toLogin();
							/*if(app){
								nativeLogin();
							}else{
								toLogin();
								//window.location.href = _config.mainIP+'?redirectTo='+window.location.href+'&ifJump=true/#/user/login';
								//window.location.href="/views/static/login/login.html?redirectTo="+window.location.href;
							}*/

						});
					}else{//弹出后台返回的错误信息
						//$.Alert(data.errmsg);
						//errCallback ? errCallback(data.errmsg,data.code*1) : $.noop()
					   /* if(errCallback){
							errCallback(data.errmsg,data.code*1);
						}else{
							$.Alert(data.errmsg,function(){
								errCallback ? errCallback(data.errmsg,data.code*1) : $.noop()
							});
						}*/
						$.Alert(data.errmsg,function(){
							errCallback ? errCallback(data.errmsg,data.code*1) : $.noop()
						});
					}

				});
				return this;
			},
			fail:function(callback){
				jqXHR.fail(function(err){
					//alert(JSON.stringify(err));
					$.Alert('网络出错了~请重试~');
					if(opt.load) {
						layer.close(Ajax.uid);
					}
					callback ? callback(err) : $.noop();
				});
				return this;
			}
		}
	};

	var toLogin = function () {
		if(navigator.userAgent.indexOf('LRAPP') == -1){//外部浏览器或者微信
			window.location.href = _config.mainIP+'/user/login?redirectTo='+window.location.href+'&ifJump=true';
		}else{//原生app
			lrNative.toAppJumpTo({'type':'login','pram':''});
		}
	};

	//清除缓存参数
	var clearUserInfo = function(){
		// delCookie('_userCache');
		delCookie('LR_ACCESSTOKEN');
		delCookie('LR_APIUID');
	};



	/*判断是否微信*/
	function isWechat(){
		var ua = navigator.userAgent.toLowerCase();
		return (ua.match(/MicroMessenger/i)=="micromessenger");
	}


  //判断是否登录
	var checkLogin = function(callback,trueCallback){
		callback = callback || $.noop;
		Ajax({
			load:true,
			url:'checkLogin'
		}).done(function(data){
			if(data*1 === 0){//如果没登录的话，在执行完回调之后，跳转至登陆页
				callback();

			}else{//执行已经登录回调
				trueCallback && trueCallback();
			}
		}).fail(function(){});
	};

	//原生或者浏览器判断登录事件
	var nativeCheckLogin = function(callback,trueCallback){
		var ifApp = getNativeInfo();
		if(!ifApp){//外部打开
			return ;
		}

		Ajax({
			load:true,
			url:'checkLogin',
			data:{
				apiUid:ifApp.apiUid,
				accessToken:ifApp.accessToken,
				version:'1.0.0',
				OS:ifApp.OS
			}
		}).done(function(data){
			if(data*1 === 0){//如果没登录的话，在执行完回调之后，跳转至登陆页
				callback();

			}else{//执行已经登录回调
				trueCallback && trueCallback();
			}
		}).fail(function(){});
	};

	//跳转到登录页
	var nativeLogin = function(){
		window.location.href="lr_bridge?bridgeType=urlJump&urlTo=login&native=true&newView=true";
	}


	/*判断是pc端还是移动端*/
	var checkFrontEnd = function(url){
		var browser={
				versions:function(){
					   var u = navigator.userAgent, app = navigator.appVersion;
					   return {//移动终端浏览器版本信息
							trident: u.indexOf('Trident') > -1, //IE内核
							presto: u.indexOf('Presto') > -1, //opera内核
							webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
							gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
							mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
							ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
							android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
							iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
							iPad: u.indexOf('iPad') > -1, //是否iPad
							webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
						};
					 }(),
					 language:(navigator.browserLanguage || navigator.language).toLowerCase()
			};

		  if(!browser.versions.mobile && !browser.versions.ios && !browser.versions.android &&
			!browser.versions.iPhone && !browser.versions.iPad){
				window.location = url;
		  }
	};
	    
        
	//发送验证码函数（没有图形验证码版本）(PS:加了图形验证码，2016-7-19改)
    var sendVcode = function(opt){
        var d_opt = {
            $input:$('[name="mobile"]'),//手机号码
            $vcode:$('[name="imgVCode"]'),//图形验证码框
			$imgVcode:$('#imgVCode'),//图形验证码
            $btn:$('#sendBtn'),//发送按钮
            url:'',
            delay:60,
            keyName:'mobile',
            extraArgs:{},
            successCallback:$.noop,//操作成功以后的回调
            timeoutCallback:$.noop//超时未处理以后需要重新发送的回调
        };

        opt = $.extend({},d_opt,opt);
        
        opt.$input.bind('keyup',function(){//手机输入控制
        	var $this = $(this);
        	$this.val($this.val().slice(0,11));
        });

        opt.$btn.bind('click',function(){
            var $this = $(this);
            if(opt.$btn.hasClass('disabled')){
                return;
            }
            if(opt.$input.val() == ''){
                $.Alert('手机号码不能为空');return;
            }

            if(!/^1[3-8]\d{9}$/.test(opt.$input.val())){
                $.Alert('输入的手机号码格式有误');return;
            }
            /*alert(opt.$vcode.val());*/
            if(opt.$vcode.val() == ''){
                $.Alert('图形验证码不能为空');return;
            }

            var data = {},
                timer;
            data[opt.keyName] = opt.$input.val();//必须要的参数
            data['vCode'] = opt.$vcode.val();//图形验证码

            data = $.extend({},data,opt.extraArgs);
            
            opt.$btn.addClass('disabled');
             opt.$btn.text('发送中...');
            Ajax({
                url:opt.url,
                load:true,
                type:'post',
                data:data
            }).done(function(data){
                var countSeconds = opt.delay;
                    opt.$btn.text('已发送('+(countSeconds--)+')');
                    /*为btn加上已经获取过的标志*/
                    opt.$btn.data('sended','true');
                    timer = setInterval(function(){
                        if(countSeconds === -1){//如果时间结束
                            opt.$btn.removeClass('disabled').text('重新发送');
                            clearInterval(timer);
                            /*制空验证码输入框，并改变验证码*/
							opt.$imgVcode.trigger('click');
							opt.$vcode.val('');
                            opt.timeoutCallback();//超时回调
                            return;
                        }
                
                        opt.$btn.text('已发送('+(countSeconds--)+')');
                    
                },1000);
            },function(errmsg){
				opt.$btn.removeClass('disabled').text('发送验证码');
				/*制空验证码输入框，并改变验证码*/
				opt.$imgVcode.trigger('click');
				opt.$vcode.val('');
				clearInterval(timer);
            	/*$.Alert(errmsg,function(){
            		opt.$btn.removeClass('disabled').text('发送验证码');
                	/!*制空验证码输入框，并改变验证码*!/
    				opt.$imgVcode.trigger('click');
    				opt.$vcode.val('');
    				clearInterval(timer);
            	});*/
            	
            }).fail(function(){
                opt.$btn.removeClass('disabled').text('重新发送');
                clearInterval(timer);
            });


        });

    }
    
     //倒计时
    var countDown = function(time,callback,callbackEnd){
			var parseTime = function(time){
				var min = Math.floor(time/60),
					sec = time%60;
					return {min:min,sec:sec};
			}
			var timer = setInterval(function(){
				callback && callback(parseTime(time));
				if(time <= 0){
					clearInterval(timer);
					callbackEnd && callbackEnd();
				}
				time-=1;
			},1000);
			
		}
    
    
    /*获取一个随机串*/
    var getRandom = function(){
    	return ((Math.random()+'').slice(2)*1).toString(36).toUpperCase();
    }
    
    
    /*图形验证码*/
    var getVcode = function(opt){
		var d_opt = {
				elem:$('#imgVCode'),
				token:'',
				args:{
				},
				callback:$.noop
		};
		
		opt = $.extend({},d_opt,opt);
		opt.elem.bind('click',function(){
			Ajax({
				url:'getVerifyCode'
			}).done(function(data){
				if(opt.elem[0].tagName.toLowerCase() !== 'img'){
					opt.elem.find('img')[0].src  =  _config.ip+'/AppApi/v1.0.0/'+data.vcode+'?v='+(+new Date())+'&token='+opt.token;
				}else{
					opt.elem[0].src =  _config.ip+'/AppApi/v1.0.0/'+data.vcode+'?v='+(+new Date())+'&token='+opt.token;
				}
				opt.callback(opt.token);	
			}).fail(function(){
			});
		});
		
		opt.elem.trigger('click');
		
		return {
			change:function(){
				opt.elem.trigger('click');
			}
		}
	};


	/*rsa非对称加密*/
	var genreate = function(plainText){
		var public_key = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgNg+zMcVL5Slgc45EfrfmsiGVZMMj08nsDmoeIgV2e/+iYZu2IF6bAla5QElu+2ZEOKabyZCCavYBAVu4uWkG+WYrfjOYmjg8ePJ32vVHNld5c/9VDz4RetSw+23RVTYU+hkgRAjqgwdp/C44U7eZb30YlAvIHIe9+/ndunnD/wIDAQAB';
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey(public_key);
		return encrypt.encrypt(plainText);
	};


	/*注册协议*/
	var openRegisterProtocol = function (callback) {
		$.ajax({
			url:'/protocol?v='+Date.now()
		}).done(function(text){
			$('body').append(text);
			callback && callback();
		});
	};

	/**
	 * 渠道确认
	 * @param doneInvalidUrl 失效后确定注册跳转链接
	 * @param cancelInvalidUrl 失效后取消继续注册跳转链接(不传则跳转到首页)
     */
	var checkChannel = function(doneInvalidUrl,cancelInvalidUrl){
		/*for sem*/
		var semChannel = getQueryField('from');
		if(semChannel){
			sessionStorage.setItem('LR_FROM',semChannel);
			Ajax({
				url:'checkCpsFrom',
				data:{
					from:semChannel
				}
			}).done(function(data){
				if (data) {
					$.Confirm('渠道失效，是否继续注册？',{
						doneText:'确定',
						doneCallback:function(){
							sessionStorage.removeItem('LR_FROM');
							location.href = (doneInvalidUrl || "");
						},
						cancelText:'取消',
						cancelCallback:function(){
							sessionStorage.removeItem('LR_FROM');
							location.href = (cancelInvalidUrl || "/views/static/index.html");
						}
					});
				}
			}).fail();
		}
	};

    /**
     * 设置cookie
     * @param name 键名
     * @param value 键值
     * @param days 过期时间(天数)
     */
    var setCookie = function(name,value,days) {
        var exp = new Date();
        days = days || 365;
        exp.setTime(exp.getTime() + days*24*60*60*1000);
        document.cookie = name + "="+ decodeURIComponent (value) + ";expires=" + exp.toGMTString();
        return this;
    };

    /**
     * 读取cookie
     * @param name 键名
     * @returns {null}
     */
    var getCookie = function(name)
    {
        var arr,
            reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return null;
    };

    /**
     * 删除cookie
     * @param name 键名
     */
    var delCookie = function(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();

        return this;
    };
    
	    return{
	    	checkLogin:checkLogin,
	    	isWechat:isWechat,
	    	Ajax:Ajax,
	    	getQueryField:getQueryField,
	    	checkFrontEnd:checkFrontEnd,
	    	getNativeInfo:getNativeInfo,
	    	nativeCheckLogin:nativeCheckLogin,
	    	nativeLogin:nativeLogin,
            sendVcode:sendVcode,
            countDown:countDown,
            getRandom:getRandom,
            getVcode:getVcode,
			openRegisterProtocol:openRegisterProtocol,
			checkChannel:checkChannel,
			setCookie:setCookie,
	        getCookie:getCookie,
	        delCookie:delCookie,
	        judePlatform:judePlatform,
			toLogin:toLogin
            
	    }
})();

window.lrBridge = {
	getAuthArgs : function(accessToken,apiUid,apiVersion,version,OS){
		if(arguments.length == 1){
			var authData = JSON.parse(arguments[0]);
			TL.setCookie('LR_ACCESSTOKEN',authData.accessToken);//写入缓存
			TL.setCookie('LR_APIUID',authData.apiUid);//写入缓存
			_config.version = /*authData.apiVersion*/ '1.0.0';//为全局变量赋值
			_config.appVersion = authData.version;//为全局变量赋值
			_config.OS = authData.OS;//为全局变量赋值
		}else{
			TL.setCookie('LR_ACCESSTOKEN',accessToken);//写入缓存
			TL.setCookie('LR_APIUID',apiUid);//写入缓存
			_config.version = apiVersion;//为全局变量赋值
			_config.appVersion = version;//为全局变量赋值
			_config.OS = OS;//为全局变量赋值
		}


		nativeInit && nativeInit();
		//$.Alert(JSON.stringify(_config));
	},
	shareSuccess:function(){
		document.getElementById('state').innerHTML = JSON.stringify('分享成功aaa');
	},
	shareErr:function(){
		document.getElementById('state').innerHTML = JSON.stringify('分享失败');
	}
};