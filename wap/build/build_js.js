({
    baseUrl: '../js',
    paths:{
        //一些库文件
        'jquery': '../framework/jquery-1.9.1',
        'angular': '../framework/angular-1.3.0.14/angular.min',
        'angularRoute': '../framework/angular-ui-router',
        'domReady': '../framework/domReady',
        'ngStorage': "../framework/ngStorage.min",
        'angularResource': "../framework/angular-resource.min",
        'md5js': "../framework/md-5",
        'SHR256': "../framework/SHR256",
        'ngInfiniteScroll': "../framework/ngInfiniteScroll",
        'gagaka': "../framework/lucky-card.min",
        // 'weixin': "../framework/weixin_1",
        //js文件
        'bootstrap': "bootstrap",
        'app': "app",
        'webappControllers': "module",
        'filter': "./filters/filter",
        'urlFilters': "./filters/urlFilters",
        'ngdialog': "./ng/dialog/ngDialog",
        'router': "router",
        'ngScrollTop':"./ng/ngScrollTop",
        'ngDraw':"./ng/ngDraw",
        'jweixin':'../framework/jweixin-1.0.0',
        'qrcode':'../framework/qrcode',
        'angularQrcode':'../framework/angular-qrcode',
        'swiper':'../framework/swiper.min',
        'ngscrollbar':'../framework/ngscrollbar',
        'xue':'../framework/xue',
        'ngTouch':'./ng/ngTouch',
        'radialIndicator':'../framework/radialIndicator',
        'linearIndicator':'../framework/linearIndicator',

        'clipboard':'../framework/copy-to-clipboard',
        'slider':'../framework/slider',
        'asPieProgress':'../framework/jquery-asPieProgress',
        'rainbow':'../framework/rainbow.min',
        'appControllers': "module",

        'sign3rd': "../framework/sign3rd",

    },
    shim:{
        'angular':{
            exports:'angular'
        },
        'angularRoute':{
            deps:['angular','ngStorage','ngdialog','ngScrollTop','ngDraw','angularQrcode','ngTouch'],
            exports: 'angularRoute'
        },
        'angularResource':{
            deps:['angular'],
            exports: 'angularResource'
        },
        'angularQrcode':{
            deps:['angular']
        },
        'app':{
            deps:['ngscrollbar']
        },
        'ngscrollbar':{
            deps:['angular']
        },
        'ngTouch':{
            deps:['app']
        },
        'jqmeter':{
            deps:['jquery'],
            exports: 'jqmeter'
        }
    },
    name: 'main',// 模块入口
    deps:['bootstrap','jweixin','qrcode','swiper','domReady'],
    optimize: 'none',//是否压缩 默认是压缩的，去掉不要就是压缩
    out: "../dist/main-built.js",// 输出压缩后的文件位置  //
    // out: "../dist/main-built-"+(new Date()).getTime()+".js",// 输出压缩后的文件位置  //

})
