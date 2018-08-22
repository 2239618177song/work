/* 
* @Author: lee
* @Date:   2016-01-12 21:01:57
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-13 11:14:45
*/

'use strict';
define(['app'], function (app) {

    app
        /*app接口*/
        .filter('getUrl', function () {
            return function (name) {
                var base = '/'
                var urls = {
                    //啄米活动
                    '啄米返现活动': base + 'activity/activeAwardList.dos',
                    //啄米上线30天标接口
                    '30天标': base + 'product/ActiveProductId.dos',
                    // 首页
                    "shouYe": base + "index/index.dos",
                    "myacc": base + "accountIndex/info.dos",
                    "我的红包": base + "activity/index.dos",
                    "拆红包": base + "member/getOpenRed.dos",
                    /*注册接口*/
                    "getyzm": base + "register/sendRegMsg.dos",
                    "getPhone": base + "register/existMobilePhone.dos",
                    "zuce": base + "register/reg.dos",
                    "picCode": base + "login/validateCode.dos",
                    "信息认证": base + "memberSetting/sendBankMsg.dos",
                    "实名认证": base + "memberSetting/bankInfoVerify.dos",
                    "充值": base + "recharge/index.dos",
                    "创建订单": base + "recharge/createPayOrder.dos",
                    "充值验证码": base + "recharge/sendRechargeSms.dos",
                    "认证充值": base + "recharge/goPay.dos",
                    "goRecharge": base + "recharge/wapRechge.dos",

                    "提现": base + "withdrawals/index.dos",
                    "提现申请": base + "withdrawals/addWithdrawals.dos",
                    /*我的*/
                    "我的资产": base + "accountIndex/myFunds.dos",
                    "站内信": base + "messageCenter/getMessage.dos",

                    "我的投资": base + "investCenter/productList.dos",

                    "我的明细": base + "assetRecord/index.dos",
                    "我的信息": base + "memberSetting/index.dos",
                    "我的银行卡": base + "memberSetting/myBankInfo.dos",
                    "我的消息": base + "messageCenter/getMessage.dos",

                    /*登录*/
                    "login": base + "login/doLogin.dos",
                    "短信验证": base + "memberSetting/sendForgetTpwdCode.dos",
                    "完成设置交易密码提交": base + "memberSetting/updateTpwdBySms.dos",
                    "判断用户状态": base + "memberSetting/index.dos",

                    /*产品*/
                    "cplist": base + "product/list.dos",
                    "cpDetail": base + "product/detail.dos",
                    "cpPicAndInvest": base + "product/detail_info.dos",
                    "产品可用全部优惠券": base + "activity/usable.dos",
                    "产品可用优惠券": base + "activity/getUsableCoupon.dos",
                    "购买产品": base + "product/invest.dos",

                    "交易密码重置短信验证码": base + "memberSetting/sendForgetTpwdCode.dos",
                    "设置交易密码": base + "memberSetting/updateTpwdBySms.dos",

                    "登录密码重置短信验证码": base + "memberSetting/forgetPwdSmsCode.dos",
                    "设置登录密码": base + "memberSetting/updateLoginPassWord.dos",
                    "意见反馈": base + "system/feedback.dos",
                    "银行限额列表": base + "recharge/getBankQuotaList.dos",
                    '我的邀请列表': base + "activity/myInvitation.dos",

                    "好友互推": base + "recommend/myFriendInvest.dos",
                    'selectInvest': base + 'product/selectInvest.dos',
                    '回款记录': base + "investCenter/repayInfoDetail.dos",
                    'selectProductInfo': base + "product/selectProductInfoRecommend.dos",

                    '我的幸运码': base + "product/getMyLuckCodes.dos",
                    'getMyPrizeRecords': base + 'activity/getMyPrizeRecords.dos',
                    '活动标详情': base + "product/getNewActivityProduct.dos",
                    '活动开奖结果': base + "activity/getActivityPrizeResult.dos",
                    'getPrizeInfoByProductId': base + 'activity/getPrizeInfoByProductId.dos',
                    'zadan': base + 'activity/getRandomCouponByProductId.dos',
                    'signWeChat': base + 'product/signWeChat.dos',
                    index: base + "",
                    'getActivityFriendConfigAll': 'activity/getActivityFriendConfigAll.dos',
                    'getActivityFriendConfig': 'activity/getActivityFriendConfig.dos',
                    'getActivityFriendStatistics': 'activity/getActivityFriendStatistics.dos',
                    'getTheRewards': 'assetRecord/getTheRewards.dos',
                    'getPromoteRedelivery': 'member/getPromoteRedelivery.dos',
                    'getUse': 'member/getUse.dos',
                    'getReservation': 'product/getReservation.dos',
                    'myInvitation': 'activity/myInvitation.dos',
                    'getContinueReward': 'product/getContinueReward.dos',
                    'addContinueReward': 'product/addContinueReward.dos',
                    // 双蛋活动
                    '双旦活动': base + 'activity/doubleAggIndex.dos',
                    '拆双旦红包': base + 'activity/tearOpen.dos',
                    '双旦分享': base + 'activity/dobuleEggShare.dos',
                    // 年末豪礼投即送活动
                    'tjs活动页': base + 'activity/investSendPrizeIndex.dos',
                    'tjs产品奖品': base + 'activity/selectProductPrize.dos',
                    'tjs投资记录': base + 'activity/accountInvestLogs.dos',
                    'tjs修改地址': base + 'member/updateReceiptAddress.dos',
                    'tjs添加地址': base + 'member/insertReceiptAddress.dos',
                    'tjs获取地址': base + 'member/getReceiptAddress.dos',
                    'tjs添加预约': base + 'activity/insertPrizeInfo.dos',
                    'tjs许愿': base + 'activity/wishCommit.dos',
                    // 活动聚合页
                    '活动聚合': base + 'activity/getAllActivity.dos',
                    // 关于我们
                    '网站公告': base + 'aboutus/newsInformationList.dos',
                    '公告详情': base + 'aboutus/newsDetails.dos',
                    // 长城宽带落地页
                    'getGreatWallInfo': base + 'activity/getGreatWallInfo.dos',
                    // 邀请好友4-返现前5
                    '返现前5': base + 'activity/getTopFive.dos',
                    // 体验标
                    '体验标详情': base + 'product/experienceDetail.dos',
                    '体验标投资': base + 'product/experienceInvest.dos',
                    // 春节活动
                    '压岁钱分享页': base + 'jsActivityLuckMoney/getshaerUserName.dos',
                    '领压岁钱': base + 'jsActivityLuckMoney/getJsActivityLuckyMoney.dos',
                    // 元宵活动
                    '吃元宵': base + 'activity/eatGlutinous.dos',
                    '元宵领取记录': base + 'activity/getEatGlutinousLog.dos',
                    // 新手标推广页排行榜
                    '新手标推广页排行榜': base + 'activity/getNoviceListAndCount.dos',
                    // iPhone7推广页
                    'iPhoneSEM': base + 'activity/iPhoneSEM.dos',
                    // 新体验金推广页
                    'lastRegMember': base + 'activity/lastRegMember.dos',
                    // 活动聚合页开放日往期列表
                    'getOpenDayList': base + 'activity/getOpenDayList.dos',
                    // 开放日报名
                    '开放日报名': base + 'activity/SignUp.dos',
                    // 开放日活动内容
                    'getOpenDayDetail': base + 'activity/getOpenDayDetail.dos',
                    // 开放日活动详情页
                    'getOpenDayArticleDetail': base + 'activity/getOpenDayArticleDetail.dos',
                    // 邀请好友三重礼top10
                    '邀请好友三重礼top10': base + 'activity/getRankingList.dos',
                    // 我的邀请页面
                    '我的邀请': base + 'activity/firstInvestList.dos',
                    // 推广页获取个人信息
                    '推广页账户': base + 'activity/getMyAccount.dos',
                    // app2.0翻牌领取记录
                    'app2.0翻牌领取记录': base + 'activity/flopIndex.dos',
                    // app2.0翻牌
                    'app2.0翻牌': base + 'activity/flop.dos',
                    // 公益活动列表
                    '公益活动列表': base + 'activity/offlineActivityList.dos',
                    // 公益活动内容
                    '公益活动内容': base + 'activity/offlineActivityDetail.dos',
                    // 518理财节
                    '518理财节': base + 'activity/activityMay18d.dos',
                    // 518产品详情
                    '518产品详情': base + 'product/getPorductList.dos',
                    // 活动标列表banner
                    '活动标列表banner': base + 'product/activityPrizeBanner.dos',
                    // 富友支付接口
                    'fuyoupaytest': 'http://www-1.fuiou.com:18670/mobile_pay/h5pay/payAction.pay',
                    'fuyoupay': 'https://mpay.fuiou.com:16128/h5pay/payAction.pay',
                    'selectCity': base + 'recharge/getCityList.dos',
                    'raisedAndRepayedNum': base + 'product/raisedAndRepayedNum.dos',

                    'pastProductList': base + 'product/productList.dos',


                    'julyActiveAwardRank': base + 'activity/julyActiveAwardRank.dos',

                    'leapMonthActive': base + 'product/leapMonthActive.dos',
                    'leapMonthStatist': base + 'product/leapMonthStatist.dos',

                    'summerRedpaperSendActive': base + 'product/summerRedpaperSendActive.dos',
                    'summerRedpaperSendList': base + 'activity/summerRedpaperSendList.dos',
                    'summerRedpaperSend': base + 'activity/summerRedpaperSend.dos',


                    'moneySeasonRedSend': base + 'activity/moneySeasonRedSend.dos',
                    'getMyInvestStatistics': base + 'activity/getMyInvestStatistics.dos',
                    'moneySeasonRedSendActive': base + 'product/moneySeasonRedSendActive.dos',

                    'qixiActivityIndex': base + 'activity/qixiActivityIndex.dos',
                    'qixiActivityLottery': base + 'activity/qixiActivityLottery.dos',
                    'qixiActivityWinningMembers': base + 'activity/qixiActivityWinningMembers.dos',
                    'myQixiActivityGifts': base + 'activity/myQixiActivityGifts.dos',
                    'insertDeliveryAddress': base + 'member/insertDeliveryAddress.dos',

                    'financingInvestStatistics': base + 'activity/financingInvestStatistics.dos',
                    '双十二活动': base + 'statistics/decemberTwelve.dos',
                    // 元旦活动
                    "一键领取": base + 'holidaysActivity/newYearRedBag.dos',
                    "奖品兑换":base + 'holidaysActivity/newYearReward.dos',
                    "积分显示": base + 'holidaysActivity/getMemberPoint.dos',
                    //文章列表
                    "文章列表": base + 'article/getByCategory.dos',
                    //文章首页
                    "文章首页": base + 'article/index.dos',
                };
                return urls[name];
            }
        })
});