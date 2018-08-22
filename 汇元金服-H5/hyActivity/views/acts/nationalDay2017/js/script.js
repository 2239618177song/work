

    /**
     * 奖品图基础路径
     */
    var baseUrl = '/acts/nationalDay2017/images/nationalDay2017_';

    /**
     * 奖品列表
     */
    var goodsList = {
        '-1':{ pic:'25.png',text:'很遗憾,没有中奖哦~',type:0,prize:6},
        '8':{ pic: '25.png',text: '周大福20g金砖！',type:1,prize:6},
        '9':{ pic: '25.png',text: 'iphone7',type:1,prize:6},
        '10':{ pic: '10.png',text: '588元现金！',type:1,prize:0},
        '11':{ pic: '11.png',text: '288元现金',type:1,prize:2},
        '12':{ pic: '12.png',text: '88元现金',type:1,prize:4},
        '13':{ pic: '13.png',text: '3%加息券',type:1,prize:3}
    }

  /*个人参数*/
    var userConfig = {
        remainCount:0, //抽奖次数
        resultId:"",
        countList:[]
    };

  /*抽奖配置*/
    var lottery={
        index:-1,   //当前转动到哪个位置，起点位置
        count:0,    //总共有多少个位置
        timer:0,    //setTimeout的ID，用clearTimeout清除
        speed:20,   //初始转动速度
        times:0,    //转动次数
        cycle:50,   //转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize:-1,   //中奖位置
        init:function(id){
            if ($("#"+id).find(".lottery-unit").length>0) {
                $lottery = $("#"+id);
                $units = $lottery.find(".lottery-unit");
                this.obj = $lottery;
                this.count = $units.length;//格子的个数
                $lottery.find(".lottery-unit-"+this.index).addClass("active");
            };
        },
        rolls:function(){
            var index = this.index;
            var count = this.count;
            var lottery = this.obj;
            $(lottery).find(".lottery-unit-"+index).removeClass("active");
            index += 1;
            if (index>count-1) {
                index = 0;
            };
            $(lottery).find(".lottery-unit-"+index).addClass("active");
            this.index=index;
            return false;
        },
        stop:function(index){
            this.prize=index;
            return false;
        }
    };

    /**
     * 中奖结果弹窗
     */
    var resultTips = function(result){
        var getTpl = function(){
            var tpl = [];
            tpl.push('<div class="mask" ></div>');
            tpl.push('<div class="tips">');
            tpl.push('<img src="'+baseUrl+goodsList[result].pic+'" alt="">');
            tpl.push('<div class="text">');
            if(result.type == 1){
                // tpl.push('<p>恭喜您<br/>获得'+goodsList[result].text+'</p>');
            }else{
                // tpl.push('<p>很遗憾<br/>您没有中奖~</p>')
            }

            tpl.push('</div>');
            tpl.push('</div>');
            return tpl.join('');
        }

        var renderTips = function(){
            $('body').append(getTpl());
            $('#lottery_btn').removeClass('disabled'); //操作成功后去除重复点击属性
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
     * 抽奖封装
     * @param prizeId
     * @returns {boolean}
     */
    var roll = function(prizeId){
        lottery.times += 1;
        lottery.rolls();

        var $lottery = $('#lottery');
        if (lottery.times > lottery.cycle+10 && lottery.prize==lottery.index) {
            click=false;

            clearTimeout(lottery.timer);
            setTimeout(function(){
                // console.log(userConfig.resultId)
                resultTips(userConfig.resultId) //中奖弹窗
            },500)//延迟半秒出现，以防失误
            lottery.prize=-1;
            lottery.times=0;

        }else{
            if (lottery.times<lottery.cycle) {
                lottery.speed -= 10;
            }else if(lottery.times==lottery.cycle) {

            }else{
                if (lottery.times > lottery.cycle+10 && ((lottery.prize==0 && lottery.index==7) || lottery.prize==lottery.index+1)) {
                    lottery.speed += 50;
                }else{
                    lottery.speed += 20;
                }
            }
            if (lottery.speed<40) {
                lottery.speed=40;
            };
            lottery.timer = setTimeout(roll,lottery.speed);
        }
        return false;
    }

    var click = false;


    /**
     * 中奖滚动
     * @param arr
     * @param $wrap
     */
    var slide = function(arr,$wrap){
        var height = $wrap.height(),
            count = 10,
            len = arr.length;
        console.log(height)

        if(len == 0 )return;//没东西可以滚动

        if(len == 10){
            count = 0;
        }
        var init = function(){
            var htmlStr = '';
            htmlStr+='<li style="top:'+height*1+'px;"><span>'+arr[0].userName+'</span><span>'+arr[0].prizeName+'</span></li>';
            if(len >= 2){
                // htmlStr+='<li style="top:'+height*1+'px;"><a href="javascript:void(0)">'+arr[1].userName+'获得了 '+arr[1].prizeName+'</a></li>';
                htmlStr+='<li style="top:'+height*1+'px;"><span>'+arr[1].userName+'</span><span>'+arr[1].prizeName+'</span></li>';
            }

            $wrap.append(htmlStr);
        }

        var start = function(){
            setInterval(function(){
                $wrap.children().eq(1).animate({top:'0px'},500);

                $wrap.children().eq(0).animate({top:-1*height+'px'},500,function(){
                    $wrap.children().eq(0).remove();
                    $wrap.append('<li style="top:'+height*1+'px;"><span>'+arr[count].userName+'</span><span>'+arr[count].prizeName+'</span></li>');

                    //console.log(count);
                    count++;
                    count = (count%(len));
                });
            },2000);
        }

        init();
        if(len <= 1)return;
        start();
    }

    /*
    * 跑马灯对象
    * */

    var nationalLottery = (function(){
        //获取抽奖结果
        var getResult = function(fn){
            TL.Ajax({
                url:config.resultUrl,
                load:true
            }).done(function(result){
                fn && fn(result.id);
                renderAwardList();//成功后刷新一下奖品列表
            });
        }

        //获取初始化数据
        var getInitialData = function(fn){
            TL.Ajax({
                url:config.initUrl,
                data:{
                    rd:+new Date()
                },
                load:true
            }).done(function(result){
                fn && fn(result);
            })
        }


        /*
         * 获取获奖记录以及抽奖次数
         * */
        var renderAwardList = function(fn){
            TL.Ajax({
                url:'list/gqzq',
                load:true
            }).done(function(result){
                renderCount(result.chanceCount); //获取抽奖次数
                showLuckyList(result.countList);
                showMyAwards(result);
                // slide(result.countList,$('#list'));
                userConfig.remainCount = result.chanceCount;
            })
        };

        /**
         * 显示我的奖品
         */
        var showMyAwards = function(_data){
            // 渲染弹窗
            var render = function(data){
                console.log(data);
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
                            tpl.push('<img src="/acts/nationalDay2017/images/nationalDay2017_'+goodsList[item.prizeId].pic+'" alt="">');
                            tpl.push('<p>'+item.prizeName+'</p>');
                            tpl.push('</div>');
                        });
                    }
                    tpl.push('</div>');
                    tpl.push('</div>');
                    tpl.push('</div>');

                    return tpl.join('');
                });
            }

            var bindEvent = function(){
                $('#myAward').bind('click',function(){
                    TL.checkLogin(function () {
                        TL.toLogin();
                    },function () {

                    });
                    render(_data)
                });
            }

            bindEvent();
        }

        /*显示活动中奖列表*/
        var showLuckyList = function(countList){
            var tpl = [];
            if(countList.length == 0){
                // tpl.push('<p>暂无人获奖~</p>');
                tpl.push('<li>暂无用户中奖~</li>');
            }else{
                for(var i = 0;i<countList.length;i++){
                    tpl.push('<li>恭喜用户：<span>'+countList[i].userName+'</span>抽中<span>'+countList[i].prizeName+'</span></li>');
                    // tpl.push('<li class="swiper-slide"><span>'+countList[i].userName+'</span><span>'+countList[i].prizeName+'</span></li>');
                }
            }

            $('#list').empty().append(tpl.join('\n'));
            //奖品无缝滚动
            jQuery(".lucky_list").slide({mainCell:".bd ul",autoPlay:true,effect:"topMarquee",vis:5,interTime:50});
        };

        /**
         * 显示次数
         */
        var renderCount = function(remainCount){
            $('#lottery_times').text(remainCount);

        };

        /*
         * 奖品列表弹窗
         * */
        var listTips = function(result){
            var getTpl = function(){
                var tpl = [];
                if(result.length == 0){
                    tpl.push('<p style="font-size: 18px;line-height: 5;">暂未获得奖品哦！</p>');
                }else{
                    for(var i=0;i<result.length;i++){
                        tpl.push('<li><img src="'+baseUrl2+result[i].prizeId+'.png" alt=""><span>'+result[i].prizeName+'</span></li>');
                    }
                }

                return tpl.join('');
            };
            $('.award_ul').html(getTpl());
        };


        /*抽奖结果参数处理*/

        var lotteryResult = function(data){
            lottery.prize = goodsList[data.id].prize; //noAwards
            lottery.init('lottery'); //初始化转盘
            userConfig.resultId = data.id; //将配置参数中的结果id更新
            userConfig.remainCount--; //抽奖次数处理
            renderCount(userConfig.remainCount);
            roll(userConfig.resultId); //将结果id带过去用来获奖弹窗
        };

        /*抽奖*/
        var doLottery = function($el){



            TL.Ajax({
                url:'doLottery/gqzq',
                load:true
            }).done(function(result){
                // $el.removeClass('disabled')
                // var result = {
                //     id:"8"
                // }
                if(result.id == "-1"){
                    lotteryResult(result);
                }else{
                    lotteryResult(result);
                }
                // renderAwardList();//成功后刷新一下奖品列表
            },function(){
                $el.removeClass('disabled')
            });

            // var prizeId = Math.floor(Math.random()*7);
            // console.log(prizeId);
            // lottery.prize = prizeId;
            // lottery.speed=50;
            // lottery.init('lottery'); //初始化转盘
            // roll(prizeId);
        }

        var bindEvent = function () {
            $('#lottery_btn').on('click',function(){
//                 TL.checkLogin(function () {
//                     TL.toLogin();
//                 },function () {
// //                        bindEvent(); //绑定事件
//                 });
                if(userConfig.remainCount <= 0){//次数不足
                    $.Alert('您的抽奖次数不足哦~');
                    return;
                }
                var $this = $(this);
                if($this.hasClass('disabled'))return;
                $this.addClass('disabled');

                doLottery($this)

            })
        }

        /**
         * 投资按钮
         */
        var goInvest = function(){
            var $goInvest = $('#investBtn');
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

        return{
            init:function(){
                renderAwardList();
                bindEvent();
                goInvest();
            }
        }
    })()



    $(function(){
        // nationalLottery.init();
        TL.judePlatform(function(){
                nationalLottery.init();
            },
            {
                native:function(){
                    window.nativeInit = function () {//必须使用这样的方式
                        nationalLottery.init();
                    };

                    lrNative.toAppGetArgs();//获取鉴权参数
                },
                wechat:function(){
                    nationalLottery.init();
                }
            });
        // lottery.init('lottery');
        // bindEvent();
        // renderAwardList();
    })

