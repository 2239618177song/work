TL.checkFrontEnd('https://www.huiyuanjinfu.com/aboutus/foword?url=/sem/semAct/qixi2017');

var NId = '1';
/**
 * 奖品图基础路径
 */
var baseUrl = '/acts/magpieFestival/images/goods/';


/**
 * 大转盘弹窗
 */
var LuckTips = function(result){
  var getTpl = function(){
    var tpl = [];
    tpl.push('<div class="mask" ></div>');
    tpl.push('<div class="tips">');
      tpl.push('<img src="'+baseUrl+result.pic+'" alt="">');
      tpl.push('<div class="text">');
        if(result.type == 1){
          tpl.push('<p>恭喜您<br/>获得'+result.text+'</p>');
        }else{
          tpl.push('<p>很遗憾<br/>您没有中奖~</p>')
        }

      tpl.push('</div>');
    tpl.push('</div>');
    return tpl.join('');
  }

  var renderTips = function(){
    $('body').append(getTpl());
  }

  var bindEvent = function(){
    $('.mask').click(function(){
      $('.mask').fadeOut();
      $('.tips').fadeOut();
    })
  }

  var init = function(){
    renderTips();
    bindEvent();
  }

  init();

}


/**
 * 显示次数
 */
var renderCount = function(remainCount){
  $('#remainCount').text(remainCount);
};

/**
 * 奖品列表
 */
var goodsList = {
  '-1':{ rotate:-144,pic:'g_10.png',text:'很遗憾,没有中奖哦~',type:0 },
  '1':{ rotate:0,pic: 'g_1.png',text: 'Ipad air',type:1 ,award: 'a_1.png'},
  '2':{ rotate:-74,pic: 'g_2.png',text: '纪念U盘',type:1 ,award: 'a_2.png'},
  '3':{ rotate:-306,pic: 'g_3.png',text: '情侣水杯一对',type:1 ,award: 'a_3.png'},
  '4':{ rotate:-179,pic: 'g_4.png',text: '28元红包',type:1 ,award: 'a_4.png'},
  '5':{ rotate:-42,pic: 'g_5.png',text: '8元红包',type:1 ,award: 'a_5.png'},
  '6':{ rotate:-212,pic: 'g_6.png',text: '1%加息券',type:1 ,award: 'a_6.png'},
  '7':{ rotate:-110,pic: 'g_7.png',text: '0.5%加息券',type:1 ,award: 'a_7.png'},
  '8':{ rotate:-241,pic: 'g_8.png',text: '0.3加息券',type:1 ,award: 'a_8.png'},
  '9':{ rotate:-266,pic: 'g_9.png',text: '18元红包',type:1 ,award: 'a_9.png'}
}

/**
 * 大转盘对象
 */
var LuckWheel = (function(){
  //配置参数
  var config = {};

  //是否加载中
  var loading = false;

  //可用次数
  var remainCount = 0;

  //本地测试对象
  var debuggerConfig = {
    //抽奖函数
    getResult : function(fn){
      var result = Math.ceil(Math.random()*9);
      fn && fn(result);
    },
    //初始化数据
    initResult : function(fn){
      var result = 0;

      fn && fn(result);
    }
  }

  //绑定事件
  var bindEvent = function(){
    //开始抽奖
    config.$btn.bind('click',function(){
      //debugger;
      var $this = config.$btn;
      if(loading )return;
      if(remainCount <= 0){//次数不足
        $.Alert('次数不足哦~');
        return;
      }

      var $panel = config.$el;

      loading = true;

      $panel.rotate({
        angle:0
      });

      var _getResult = config.isDebug ? debuggerConfig.getResult : getResult;//是否测试判断

      _getResult(function(id){
        console.log('开始抽奖...');
        var result = goodsList[id];
        $panel.rotate({
          animateTo:360*config.round+result.rotate,
          duration:config.duration,
          callback:function(i){
            loading = false;
            console.log('完成！,抽到了'+result.text);
            remainCount--;

            if(remainCount == 0){//如果次数用完了
              $this.addClass('disabled');
            }
            config.resultCallback(remainCount , result);
          }
        })
      });
    });


  }

  //获取抽奖结果
  var getResult = function(fn){
    TL.Ajax({
      url:config.resultUrl,
      load:true
    }).done(function(result){
      fn && fn(result.id);
    });
  }

  //获取初始化数据
  var getInitialData = function(fn){
    TL.Ajax({
      url:config.initUrl,
      load:true
    }).done(function(result){
      fn && fn(result);
    })
  }

  /**
   * 初始化入口
   */
  var initialize = function(cfg){
    var d_config = {
      $btn:$('.trigger'),
      $el:$('#id'),
      round:10,//旋转圈数
      duration:3000,//旋转时间

      goodslistMapper:{},//奖品对象
      isDebug:true,//调试模式
      callback:function(data){
      },
      resultCallback:function(data){
      }
    };

    config = $.extend({},d_config,cfg);

  }

  return {
    init:function(cfg){
      initialize(cfg);
      var _getInitialData = config.isDebug ? debuggerConfig.initResult : getInitialData;
      _getInitialData(function(data){
        bindEvent();
        config.callback(data);
        remainCount = data;
        if(remainCount == 0){//如果次数用完了
          config.$btn.addClass('disabled');
        }
      });
    }
  }
})();


/**
 * 获取投资排行榜
 */
 var getRank = function($el){

   //获取数据
   var getData = function(){
     TL.Ajax({
       url:'getRanking',
       data: {
         beginDate:'2017-08-25',
         endDate:'2017-08-31'
       }
     }).done(function(data){
       render(data);
     });
   }

   //渲染页面
   var render = function(data){
     var tpl = [];
     if(data.length == 0){
       tpl.push('<li class="no_result">暂无数据~</li>')
     }else{
       data.map(function(v,i){
         tpl.push('<li><span>'+(i+1)+'</span><span>'+v.name+'</span><span>'+v.value+'</span></li>');
       });
     }

     $('#list').append(tpl.join(''));
   }

   getData();
 }

/**
 * 获取我的奖品
 */
 var setMyAward = function(){

   // 渲染弹窗
   var render = function(data){
     $('body').append(function(){
       var tpl = [];
       tpl.push('<div class="award_mask scaleIn">');
         tpl.push('<div class="content">');
           tpl.push('<div class="title">');
             tpl.push('<span class="icon icon-close" onclick="$(this).closest(\'.award_mask\').remove()"></span>');
           tpl.push('</div>');
           tpl.push('<div class="body">');
           if(!data.logList.length){
             tpl.push('<div class="no_result">您没有获得任何奖品哦~</div>')
           }else{
             data.logList.map(function(item,i){
               tpl.push('<div class="item">');
                 tpl.push('<img src="/acts/magpieFestival/images/awards/'+goodsList[item.prizeId].award+'" alt="">');
                 tpl.push('<p>'+goodsList[item.prizeId].text+'</p>');
               tpl.push('</div>');
             });
           }
           tpl.push('</div>');
         tpl.push('</div>');
       tpl.push('</div>');

       return tpl.join('');
     });
   }

   //绑定事件
   var bindEvent = function(){
     $('#myAward').bind('click',function(){
       TL.Ajax({
         url:'list/qx',
         load:true
       }).done(render);
     });
   }

   bindEvent();
 };

/**
 * 投资按钮
 */
 var goInvest = function(){
   var $goInvest = $('#fakeBtn');
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
 }

$(function(){
  var qixiInit = function(){
    //初始化
    LuckWheel.init({
      $btn:$('.trigger'),
      $el:$('.plate'),
      callback:function(data){
        renderCount(data);
      },
      resultCallback:function(remainCount,result){
        renderCount(remainCount);
        LuckTips(result);
      },
      round:30,//旋转圈数
      duration:3000,//旋转时间
      initUrl:'view/qx',//初始化接口
      resultUrl:'doLottery/qx',//抽奖接口
      isDebug:false
    });

    //初始化排行榜
    getRank();

    //初始化打开我的奖品
    setMyAward();

    //投资按钮
    goInvest();
  }

  TL.judePlatform(function(){
      qixiInit();
    },
    {
      native:function(){
        window.nativeInit = function () {//必须使用这样的方式
          qixiInit();
        };

        lrNative.toAppGetArgs();//获取鉴权参数
      },
      wechat:function(){
        qixiInit();
      }
  });
});
