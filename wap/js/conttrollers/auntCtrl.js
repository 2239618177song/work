/* 
* @Author: si
* @Date:   2016-07-18
*/

'use strict';

define([
    'webappControllers'
    ,'ngdialog'
    ]
    ,function(controllers,ngdialog){

    controllers.controller('auntCtrl'
        ,['$scope','$rootScope'
        ,function($scope,$rootScope){

            $rootScope.title='100%领取SK-II面膜/小米手环';

            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg);  //匹配目标参数
                if (r != null) return unescape(r[2]); return null; //返回参数值
            }
            var toFrom = getUrlParam('toFrom');
            $scope.toFrom = toFrom;
            $scope.showMask = true;
        }
    ])
})