
var lotteryConfig = {
  remainCount:1
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
    '1':{ rotate:-40,pic: 'g_1.png',text: '88元红包',type:1 ,award: 'a_1.png'},
    '2':{ rotate:-217,pic: 'g_3.png',text: '108元红包',type:1 ,award: 'a_3.png'},
    '3':{ rotate:-310,pic: 'g_4.png',text: '128元红包',type:1 ,award: 'a_4.png'}
};

var lottery = function(){

  var config = {
      round:10,//旋转圈数
      duration:3000,//旋转时间
  };
  var $panel = $('.plate');

  $('.trigger').on('click',function(){
    var $this = $(this)
    if($this.hasClass('disabled') || lotteryConfig.remainCount == 0){
        tips.Alert({
            text:'您已经抽中了红包，点击立即领取'
        });
      // $.Alert('您的抽奖机会已经用完啦~')
        return;
    }
    var result = Math.ceil(Math.random()*3);

      $panel.rotate({
          animateTo:360*config.round+goodsList[result].rotate,
          duration:config.duration,
          callback:function(i){
              tips.Alert(result);

              lotteryConfig.remainCount--;
              if(lotteryConfig.remainCount == 0){
                  $this.addClass('disabled');
              }
              renderCount(lotteryConfig.remainCount)
          }
      })
  })


};

var tips = {
    init: function (obj) {

        var tpl = [];
        tpl.push('<div class="alert_model_mask">');
        tpl.push('<div class="alert_content scaleIn">');
        tpl.push('<div class="text">');
        tpl.push('<span class="closeBtn">X</span>');
        if(obj.text){
            tpl.push('<p>'+obj.text+'</p>');
        }else{
            tpl.push('<p>恭喜您获得：'+goodsList[obj].text+'！</p>');
        }
        tpl.push('</div>');
        tpl.push('</div>');
        tpl.push('<a href="/cpsCommon/index380130?from=WY" class="close_btn"></a>');
        tpl.push('</div>');
        this.initEvent();
        return tpl.join('\n');
    },
    initEvent:function(){
        $('.alert_modal_wrap').on('click','.closeBtn',function(){
            tips.hide();
        });
    },
    Alert:function(obj){
        var tpl = tips.init(obj);
        $('#alertModal').html(tpl);
    },
    hide:function(){
        $('#alertModal').empty();
    }

};



var bindEvent = function(){


};


$(function(){
    lottery()
    renderCount(lotteryConfig.remainCount)
    // tips.Alert()
})

