/* 
 * @Author: lee
 * @Date:   2016-01-10 23:28:00
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-01-13 10:57:44
 */

'use strict';
define([
	'conttrollers/controllerHome',
	'conttrollers/controllerSign',
	'conttrollers/controllerRegister',
	'conttrollers/controllerH5Register',
	'conttrollers/myaccountCtrl',
	'conttrollers/indexCtrl',
	'conttrollers/controllerNewhand',
	'conttrollers/controllerCpList',
	'conttrollers/shiMingRenZhengConttroller',
	'conttrollers/moreCtrl',

	'conttrollers/getCashCtrl',
	'conttrollers/minxiController',

	'conttrollers/investmentCtrl',
	'conttrollers/hbopenCtrl',
	'conttrollers/payPWFromController',
	'conttrollers/couponCtrl',
	'conttrollers/myCouponCtrl',
	'conttrollers/rechargeCtrl',
	'conttrollers/myassetsCtrl',
	'conttrollers/myInvestCtrl',
	'conttrollers/myInvestDetailCtrl',
	'conttrollers/myInvitationCtrl',
	'conttrollers/myInfoCtrl',
	'conttrollers/myBankCtrl',
	'conttrollers/myMessageCtrl',
	'conttrollers/znMessageCtrl',
	'conttrollers/tradepwdCtrl',
	'conttrollers/pwdCtrl',
	'conttrollers/app/CP080Ctrl',
	'conttrollers/spiderCtrl',
	'conttrollers/inviteCtrl',
	'conttrollers/activity/cp124Ctrl',
	'conttrollers/sendmaskCtrl',
	'conttrollers/auntCtrl',
	'conttrollers/aqbzCtrl',
	'conttrollers/newcomerCtrl',
	'conttrollers/NewRegisterController',
	'conttrollers/flwhzCtrl',
	'conttrollers/mycashedCtrl',
	'conttrollers/specialCtrl',
	'conttrollers/myActivityCtrl',
	'conttrollers/activityPersonCtrl',
	'conttrollers/activity/hlsbt',
	'conttrollers/activity/inviteFriend1',
	'conttrollers/activity/inviteFriend2',
	'conttrollers/activity/inviteFriend3',
	'conttrollers/activity/inviteFriend4',
	'conttrollers/activity/inviteFriend5',
	'conttrollers/activity/inviteFriend6',
	'conttrollers/activity/inviteFriendTri',
	'conttrollers/myMissionCtrl',
	// 新年活动
	'conttrollers/activity/newyearController',
	// 新年活动一
	'conttrollers/activity/newyearact1Controller',
	// 新年活动分享页
	'conttrollers/activity/newyearshareController',
	// 活动聚合页
	'conttrollers/actListController',
	'conttrollers/activity/friendReg',
	'conttrollers/appdownload',
	'conttrollers/app2download',
	'conttrollers/activity/yuebiao',
	'conttrollers/investSuccess',
	'conttrollers/continuedInvest',
	// 双蛋活动
	'conttrollers/shuangdanController',
	'conttrollers/shuangdanshareController',
	// 投即送活动
	'conttrollers/tjsController',
	'conttrollers/mytjsController',
	'conttrollers/tjswishController',
	'conttrollers/tjsaddressController',
	'conttrollers/tjsdetailController',
	'conttrollers/giftyyController',
	'conttrollers/prizedetailController',
	// 长城宽带
	'conttrollers/changcheng2Controller',
	// 体验金
	'conttrollers/tyjController',
	// 'conttrollers/tyjRegSuccessController',
	'conttrollers/newAccountSuccess',
	'conttrollers/myTyjController',
	'conttrollers/tyjdetailController',
	'conttrollers/tyjSuccessController',
	// 发布会专题页
	// 'conttrollers/conferenceController',
	// 媒体报道
	'conttrollers/reportController',
	// 元宵活动
	'conttrollers/activity/yuanxiaoController',
	// 新手标推广页
	// 'conttrollers/activity/newhandregController',
	// iPhone7推广页
	'conttrollers/activity/iPhoneadController',
	// 企业形象推广页
	'conttrollers/activity/promoteController',
	// 新体验金推广页
	'conttrollers/activity/newtyjController',
	// 垂直管理推广页
	// 'conttrollers/activity/czgladController',
	// 投即送推广页
	'conttrollers/activity/tjsadController',
	// 小米推广页
	'conttrollers/activity/xiaomiadController',
	// 开放日报名页
	'conttrollers/kfrEnrolController',
	// 邀请好友分享注册页
	'conttrollers/friendregController',
	// 优惠券温馨提示
	'conttrollers/reminderController',
	// iPhone活动页
	'conttrollers/activity/iPhoneController',
	// app2翻牌
	'conttrollers/activity/app2lotteryController',

	'conttrollers/activity/iphonelistCtrl',
	'conttrollers/activity/fanliCtrl',
	'conttrollers/activity/opendayController',
	'conttrollers/activity/publicWelfareController',
	'conttrollers/activity/newtyj2Controller',
	// 518理财节
	'conttrollers/activity/festival518Controller',
	// 企融计划列表页
	'conttrollers/normalcplistController',
	// 募集企融计划列表页
	'conttrollers/pastcplistController',
	// 活动标列表页
	'conttrollers/activitycplistController',
	'conttrollers/aqbzDetailCtrl',

	'conttrollers/hongyadownloadCtrl',
	'conttrollers/hongyaregCtrl',
	'conttrollers/hyInviteRegCtrl',
	'conttrollers/hongyainviteCtrl',
	'conttrollers/hongyaTouziyueCtrl',
	'conttrollers/hongyaJiaxiCtrl',
	'conttrollers/hongyaRunyueCtrl',
	'conttrollers/hongyaHongbaoyuCtrl',
	'conttrollers/hongyaAugustCtrl',
	'conttrollers/hongyaQixiCtrl',
	'conttrollers/hongyaFanACtrl',


	// 'conttrollers/hongyaOilregCtrl',	
	'conttrollers/hongyaChannelregCtrl',
	'conttrollers/hongyaXmydCtrl',
	'conttrollers/hongyaJrttCtrl',
	'conttrollers/inviteCenterController',
	//啄米活动
	'conttrollers/zmActive/zmInviteController',
	'conttrollers/zmChannel/chedao',
	'conttrollers/zmChannel/zmChannelregCtrl',
	//汇元 邀请好友
	'conttrollers/inviteFri',
	'conttrollers/inviteFriApp',
	//双十二活动
	'conttrollers/shuangCtrl',
	//圣诞活动
	'conttrollers/ChristmasCtrl',
	//元旦活动
	'conttrollers/yuandanCtrl',
    //云锐开发
	'conttrollers/yunruiCtrl',
	//360导航
	'conttrollers/nav360Ctrl',
	//典典养车
	'conttrollers/ddycCtrl',
	//汇元资讯
	'conttrollers/hyzxCtrl',
	//理财课堂
	'conttrollers/lcktCtrl',
	//信息披露
	'conttrollers/xxplCtrl',
	//信息披露
	'conttrollers/gywmCtrl',
	//常见问题
	'conttrollers/cjwtCtrl',
	//汇元事件
	// 'conttrollers/hysjCtrl',
], function () {
});


