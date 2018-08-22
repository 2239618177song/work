// TL.checkFrontEnd('https://www.huiyuanjinfu.com/aboutus/foword?url=/sem/semAct/qixi2017');

var NId = '1';


/**
 * 大转盘弹窗
 */
var LuckTips = function(result){
  var getTpl = function(){
    var tpl = [];
    tpl.push('<div class="mask" ></div>');
    tpl.push('<div class="tips">');
      tpl.push('<div class="text">');
        if(result.type == 1){
          tpl.push('<p>恭喜您获得:<br>'+result.text+'</p>');
        }else if(result.type == 2){
            tpl.push('<p>恭喜您获得以下礼品:<br>');
            var len = globalConfig.lottery_result.list.length;
            var _list = globalConfig.lottery_result.list;
            for(var i=0;i<len;i++){
              // console.log(result.list.length)
              if(_list[i].id != '-1'){
                  tpl.push(''+_list[i].name+',');
              }

            }
            tpl.push('</p>')
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
    globalConfig.remainCount = remainCount;
};

/**
 * 奖品列表
 */
var goodsList = {
  '-2':{ rotate:-249,pic:'g_10.png',text:'谢谢参与',type:2 },
  '-1':{ rotate:-249,pic:'g_10.png',text:'谢谢参与',type:0 },
  '58':{ rotate:-294,pic: 'g_1.png',text: '1%加息券',type:1 ,award: 'a_1.png'},
  '59':{ rotate:-339,pic: 'g_2.png',text: '2%加息券',type:1 ,award: 'a_2.png'},
  '60':{ rotate:-24,pic: 'g_3.png',text: '18元红包',type:1 ,award: 'a_3.png'},
  '61':{ rotate:-69,pic: 'g_4.png',text: '28元红包',type:1 ,award: 'a_4.png'},
  '62':{ rotate:-114,pic: 'g_5.png',text: '九阳榨汁机',type:1 ,award: 'a_5.png'},
  '63':{ rotate:-159,pic: 'g_6.png',text: '200元现金',type:1 ,award: 'a_6.png'},
  '64':{ rotate:-204,pic: 'g_7.png',text: 'JBL GO音乐金砖无线蓝牙音箱',type:1 ,award: 'a_7.png'}
}

var globalConfig = {}

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
      var $type = $(this).data('type');
      config.$type = $(this).data('type');
      if(loading )return;
      if(remainCount <= 0){//次数不足
        $.Alert('次数不足哦~');
        return;
      }
      if($type == 2 && globalConfig.remainCount <10){
          $.Alert('剩余次数不足10次哦~');
          return;
      }

      var $panel = config.$el;

      loading = true;

      $panel.rotate({
        angle:0
      });

      var _getResult = config.isDebug ? debuggerConfig.getResult : getResult;//是否测试判断

      _getResult(function(id){
        // console.log('开始抽奖...');
        var result = goodsList[id];
        $panel.rotate({
          animateTo:360*config.round+result.rotate,
          duration:config.duration,
          callback:function(i){
            loading = false;
            // console.log('完成！,抽到了'+result.text);
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
      data:{
        type:config.$type
        },
      load:true
    }).done(function(result){
      fn && fn(result.id);
        globalConfig.lottery_result = result;
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
             tpl.push('<span class="icon icon-close" onclick="$(this).closest(\'.award_mask\').remove()">X</span>');
           tpl.push('</div>');
           tpl.push('<div class="body">');
           if(!data.logList.length){
             tpl.push('<div class="no_result">您没有获得任何奖品哦~</div>')
           }else{
             data.logList.map(function(item,i){
               tpl.push('<div class="item">');
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
         url:'view/ma',
         load:true
       }).done(render);
     });
   }

   bindEvent();
 };

/**
 * 次数渲染
 */
var renderChance = function(){
    TL.Ajax({
        url:'view/ma'
    }).done(function (data) {
        $('#remainCount').text(data.surplus);
        globalConfig.remainCount = data.surplus;
    });
};


/**
 * 投资按钮
 */
 var goInvest = function(){
   var $goInvest = $('.invest_btn');
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
  var marchInit = function(){
    //初始化
    LuckWheel.init({
      $btn:$('.lottery_btn'),
      $el:$('.plate'),
      callback:function(data){
        renderCount(data.surplus);
      },
      resultCallback:function(remainCount,result){
        // renderCount(remainCount);
          renderChance();
        LuckTips(result);
      },
      round:30,//旋转圈数
      duration:3000,//旋转时间
      initUrl:'view/ma',//初始化接口
      resultUrl:'doLottery/ma',//抽奖接口
      isDebug:false
    });


    //初始化打开我的奖品
    setMyAward();

    //投资按钮
    goInvest();
  }

  TL.judePlatform(function(){
          marchInit();
    },
    {
      native:function(){
        window.nativeInit = function () {//必须使用这样的方式
            marchInit();
        };

        lrNative.toAppGetArgs();//获取鉴权参数
      },
      wechat:function(){
          marchInit();
      }
  });
});
