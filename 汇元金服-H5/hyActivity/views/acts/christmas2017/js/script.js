/**
 * 投资按钮
 */
var goInvest = function(){
    var $goInvest = $('#invest_btn');

    $goInvest.click(function(){
        if(window.navigator.userAgent.indexOf('LRAPP') != -1){//在app中
            lrNative.toAppJumpTo({
                type:'investList',
                pram:'0'
            })
        }else{//app外部
            window.location.href = _config.mainIP+'/invest/list';
        }
    });
};
		/**
 * 获取用户排行榜
 */
var renderUserinfo = function($el){

    //获取数据
    var getData = function(){
        TL.Ajax({
            url:'merryChristmas',
            data: {
            	
            }
        }).done(function(data){
            renderLuckyUser(data);/*渲染三天内的幸运用户*/
            renderTodayMax(data);/*渲染单挑投资额最高用户*/
           	renderNinety(data);/*渲染投整点90天标的用户*/
           	renderSixty(data);/*渲染投整点60天标的用户*/
           	renderThirty(data);/*渲染投整点30天标的用户*/
           	renderHundredEighty(data);/*渲染投整点180天标的用户*/
           	if(data.receive == '1'){
           		return
           	}else{
           		tip_Package();/*用户参与与否*/
           	}
        });
    }

    //渲染幸运用户
    var renderLuckyUser = function(data){
    		var countList = data.countLists;
        var tpl = [];
        tpl.push('<li>');
						tpl.push('<span>日期</span>');
						tpl.push('<span>幸运用户</span>');
						tpl.push('<span>手机号</span>');
						tpl.push('</li>');
        		if(countList[0].realName){
        			tpl.push('<li>');
										tpl.push('<span>'+countList[0].time+'</span>');
										tpl.push('<span>'+countList[0].realName+'</span>');
										tpl.push('<span>'+countList[0].userName+'</span>');
										tpl.push('</li>')
        		}else{
        			tpl.push('<li><span>敬请期待</span><span>敬请期待</span><span>敬请期待</span></li>')
        		}
        		
        		if(countList[1].realName){
        			tpl.push('<li>');
										tpl.push('<span>'+countList[1].time+'</span>');
										tpl.push('<span>'+countList[1].realName+'</span>');
										tpl.push('<span>'+countList[1].userName+'</span>');
										tpl.push('</li>')
        		}else{
        			tpl.push('<li><span>敬请期待</span><span>敬请期待</span><span>敬请期待</span></li>')
        		}
            
            if(countList[2].realName){
        			tpl.push('<li>');
										tpl.push('<span>'+countList[2].time+'</span>');
										tpl.push('<span>'+countList[2].realName+'</span>');
										tpl.push('<span>'+countList[2].userName+'</span>');
										tpl.push('</li>')
        		}else{
        			tpl.push('<li><span>敬请期待</span><span>敬请期待</span><span>敬请期待</span></li>')
        		}
        		
      $('.lucky_list').empty().append(tpl.join(''));
    }
    //渲染单天最高投资人
    var renderTodayMax = function(data){
    	var highestList = data.highestList;
					var tpl = [];
					tpl.push('<li>');
					tpl.push('<span>名次</span>');
					tpl.push('<span>手机号</span>');
					tpl.push('<span>投资额</span>');
					tpl.push('</li>');
					highestList.map(function(v,i){
						tpl.push('<li>');
						tpl.push('<span>'+(i+1)+'</span>');
						tpl.push('<span>'+v.name+'</span>');
						tpl.push('<span>'+v.value+'</span>');
						tpl.push('</li>');
					})
					$('.money_max').empty().append(tpl.join(''));
    }
    
    //渲染各个用户投资的标信息
    var renderNinety = function(data){
    	var tpl = [];
    	tpl.push('<li>');
					tpl.push('<span>手机号</span>');
					tpl.push('<span>时间段</span>');
					tpl.push('</li>');
        	var ninety = data.ninety;
        	for(var key in ninety){ 
        		if(ninety == ''){
        			tpl.push('<li>');
								tpl.push('<span>暂无~</span>');
								tpl.push('<span>暂无~</span>');
								tpl.push('</li>');
        		}else{
        			tpl.push('<li>');
								tpl.push('<span>'+ninety[key]+'</span>');
								tpl.push('<span>'+key+'</span>');
								tpl.push('</li>');
        		}
						}
    	$('.act_90').empty().append(tpl.join(''));
    }
    
    var renderSixty = function(data){
    	var tpl = [];
    	tpl.push('<li>');
					tpl.push('<span>手机号</span>');
					tpl.push('<span>时间段</span>');
					tpl.push('</li>');
    	var sixty = data.sixty;
        	for(var key in sixty){
        		if(sixty == ''){
        			tpl.push('<li>');
								tpl.push('<span>暂无~</span>');
								tpl.push('<span>暂无~</span>');
								tpl.push('</li>');
        		}else{
        			tpl.push('<li>');
								tpl.push('<span>'+sixty[key]+'</span>');
								tpl.push('<span>'+key+'</span>');
								tpl.push('</li>');
        		}
						}
    	$('.act_60').empty().append(tpl.join(''));
    }
    
    var renderThirty = function(data){
    	var tpl = [];
    	tpl.push('<li>');
					tpl.push('<span>手机号</span>');
					tpl.push('<span>时间段</span>');
					tpl.push('</li>');
    	var thirty = data.thirty;
        	for(var key in thirty){ 
        		if(thirty == ''){
        			tpl.push('<li>');
								tpl.push('<span>暂无~</span>');
								tpl.push('<span>暂无~</span>');
								tpl.push('</li>');
        		}else{
        			tpl.push('<li>');
								tpl.push('<span>'+thirty[key]+'</span>');
								tpl.push('<span>'+key+'</span>');
								tpl.push('</li>');
        		}
						}
    	$('.act_30').empty().append(tpl.join(''));
    }
    
    var renderHundredEighty = function(data){
    		var tpl = [];
            tpl.push('<li>');
						tpl.push('<span>手机号</span>');
						tpl.push('<span>时间段</span>');
						tpl.push('</li>');
            var hundredEighty = data.hundredEighty;
        	for(var key in hundredEighty){
        		if(hundredEighty == ''){
        			tpl.push('<li>');
								tpl.push('<span>暂无~</span>');
								tpl.push('<span>暂无~</span>');
								tpl.push('</li>');
        		}else{
        			tpl.push('<li>');
								tpl.push('<span>'+hundredEighty[key]+'</span>');
								tpl.push('<span>'+key+'</span>');
								tpl.push('</li>');
        		}
            		
				}
    	$('.act_180').empty().append(tpl.join(''));
    }
    
    getData();
}

	
	/**
 * 渲染用户某个时间段得到的红包
 */
var tip_Package = function(){
	
    //获取数据
    var getData = function(){
        TL.Ajax({
            url:'receiveRedEnvelope',
            load:true,
            data: {
            	
            }
        }).done(function(data){
        	$.Alert('恭喜您获得180天标专属理财红包')
        },function(data){
        	
        });
    }
    getData();
}
	


	var bindEvent = function(){
		$('.my_awads').on('click',function(){
			TL.Ajax({
        url:'merryChristmas',
    }).done(function(data){
        renderMyAward(data);/*渲染我的奖品*/
    });
		})
		
		var renderMyAward = function(data){
			var logList = data.logList;
	var tpl = [];
	$('._tips').fadeIn();
	if(logList.length == ''){
     	tpl.push('<p class="get_gift">您还没有获得任何奖品哦~</p>');
     	tpl.push('<div class="gift_cha" onclick="$(this).closest(\'._tips\').fadeOut()"></div>');
  }else{
    		tpl.push('<p class="get_gift">您已获得');
    		logList.map(function(v,i){
				tpl.push('<strong>'+v.prizeName+' </strong>');
    		});
    		tpl.push('<br /><span>可在个人中心-我的福利中查看</span></p>');
    		tpl.push('<div class="gift_cha" onclick="$(this).closest(\'._tips\').fadeOut()"></div>');
    }
	$('.tips_list').empty().append(tpl.join(''));
}
	}

/*初始化页面*/
var initPage = function(){
	TL.checkLogin(function (){
		TL.toLogin();
  },function () {
    	renderUserinfo();/*渲染用户投资列表*/
    });
		goInvest();
		bindEvent();
	}

$(function(){

    TL.judePlatform(function(){
            initPage();
        },
        {
            native:function(){
                window.nativeInit = function () {//必须使用这样的方式
                initPage();
            };
            lrNative.toAppGetArgs();//获取鉴权参数
            },
            wechat:function(){
                initPage();
            }
        });

});