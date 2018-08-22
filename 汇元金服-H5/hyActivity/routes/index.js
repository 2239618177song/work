var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/setLoginState', function(req, res, next) {
	
	let LR_ACCESSTOKEN = req.query['LR_ACCESSTOKEN'];
	let LR_APIUID = req.query['LR_APIUID'];
	//let LR_USER = req.query['LR_USER'];
	console.log('LR_ACCESSTOKEN'+LR_ACCESSTOKEN);
	console.log('LR_APIUID'+LR_APIUID);
	// console.log('LR_USER'+LR_USER);
	res.cookie('LR_ACCESSTOKEN', LR_ACCESSTOKEN ,{
	  maxAge:365*24*60*60*1000,path:'/'
	});
	res.cookie('LR_APIUID', LR_APIUID ,{
	  maxAge:365*24*60*60*1000,path:'/'
	});
	// res.cookie('LR_USER', LR_USER ,{
	//   maxAge:30*60*1000
	// });

	res.json({state:'success'});  //res.json([body])发送一个json的响应这个方法和将一个对象或者一个数组作为参数传递给res.send()方法的效果相同
});


router.get('/',(req,res,next)=>{
	res.render('index',{a:'fffff'});
});

/**
 * 跳转页
 */
router.get('/forward',(req,res,next)=>{
	res.render('forward',{});
});

/**
 * 跳转结果页
 */
router.get('/result',(req,res,next)=>{
	res.render('forward/result',{});
});

/**
 * 第三方支付回调页
 */
router.get('/payBack',(req,res,next)=>{
	res.render('pay/payBack',{});
});

/**
 * 第三方支付跳转页
 */
router.get('/payJump',(req,res,next)=>{
	res.render('pay/payJump',{});
});

/**
 * 邀请好友活动
 */
router.get('/inviteFriends',(req,res,next)=>{
	res.render('inviteFriends/index',{});
});

/**
 * 新手好礼
 */
router.get('/newRegister',(req,res,next)=>{
	res.render('newRegister/index',{});
});

/**
 * 注册协议
 */
router.get('/protocol',(req,res,next)=>{
	res.render('user_protocol',{});
});

/**
 * 渠道注册
 */
router.get('/cpsRegister/:channel',(req,res,next)=>{
	res.render('cpsRegister',{channel:req.params.channel});
});

/**
 * 邀请活动
 */
router.get('/inviteActivity',(req,res,next)=>{
	res.render('inviteActivity',{});
});

/**
 * 上线活动
 */
router.get('/publish',(req,res,next)=>{
	res.render('publish',{});
});

/**
 * 首尾标
 */
router.get('/headTail',(req,res,next)=>{
 	res.render('headTail',{});
});

/**
 * 七夕活动2017
 */
router.get('/magpie2017',(req,res,next)=>{
	res.render('magpieFestival',{});
});

/**
 * 双十一活动2017
 */
router.get('/doubleEle',(req,res,next)=>{
	res.render('doubleEle/index',{});
});


/**
 * 渠道注册-车主无忧
 */
router.get('/cpsRegister2',(req,res,next)=>{
    res.render('cpsRegister/index2',{});
});

/**
 * 渠道注册-车主无忧新版
 */
router.get('/cpsRegister3',(req,res,next)=>{
    res.render('cpsRegister/index3',{});
});

/**
 * 渠道注册-开吧
 */
router.get('/cpsRegister4',(req,res,next)=>{
    res.render('cpsRegister/index4',{});
});

/**
 * 渠道注册-开吧新版
 */
router.get('/cpsRegister5',(req,res,next)=>{
    res.render('cpsRegister/index5',{});
});

/**
 * 平台破千万活动
 */
router.get('/actBreak',(req,res,next)=>{
    res.render('actBreak',{});
});


/**
 * 平台活动页公用路由，适合静态且脚本不复杂页面使用
 */
router.get('/actCommon/:name',(req,res,next)=> {
    let page = req.params.name;
console.log(page);
res.render('actCommon/' + page, {name: req.params.name});
});
/**
 * 渠道注册-HYXE
 */
router.get('/cpsRegister6',(req,res,next)=>{
    res.render('cpsRegister/index6',{});
});
/**
 * 国庆活动2017
 */
router.get('/nationalDay2017',(req,res,next)=>{
    res.render('nationalDay2017',{});
});
/**
 * 渠道注册-公用路由
 */
router.get('/cpsCommon/:name',(req,res,next)=>{
	let page = req.params.name;
    res.render('cpsRegister/' + page,{name:req.params.name});
});

/**
 * 2017双旦活动
 */
router.get('/christmas2017',(req,res,next)=>{
    res.render('christmas2017',{});
});

/**
 * 2017元旦活动
 */
router.get('/newYearsDay2017',(req,res,next)=>{
    res.render('newYearsDay2017',{});
});

/**
 * 2018-3月活动
 */
router.get('/actMarch2018',(req,res,next)=>{
    res.render('actMarch2018',{});
});
/**
 * 2018邀请活动  by hcq
 */
router.get('/inviteAct2018',(req,res,next)=>{
    res.render('inviteAct2018',{});
});


module.exports = router;
