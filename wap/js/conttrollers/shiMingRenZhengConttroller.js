/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

'use strict';
define([
    'webappControllers'
    ,'jquery'
    ,'ngdialog'
    ]
    ,function(controllers,$,ngdialog){

    controllers.controller('SMRZcontroller'
        ,['$scope'
        ,'resourceService'
        ,'$filter'
		,'$http'
        ,'$state'
        ,'$rootScope'
        ,'$localStorage'
        ,'ngDialog'
        ,'$stateParams'
        ,function($scope,resourceService,$filter,$http,$state,$rootScope,$localStorage,ngDialog,$stateParams){
            $scope.submitBool=true;
            $rootScope.title="实名认证";
            $scope.nowTimer="发送验证码";
            var user = $filter('isRegister')().user;
            $scope.smrFrom ={};
            $scope.banklist =[];        
            $scope.isSubMin=true;

            $scope.showCityList = false;
            $scope.cityList = [];
            $scope.showBankName = false;

            resourceService.queryPost($scope, $filter('getUrl')('银行限额列表'), {}, 'bankList');
            

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type){
                    case '信息认证': 
                        if(data.success){
                                $rootScope.errorText= '验证码发送成功';
                                $filter('实名短信错误信息')('ok',$scope,'y');
                                $filter('60秒倒计时')($scope,60);
                                setTimeout(function() {
                                    ngDialog.closeAll();
                                }, 1000);
                        }else{
                            $filter('实名短信错误信息')(data.errorCode,$scope,'y');
                        }
                    break;
                    case '实名认证': 
                        if(data.success){
                            $filter('isRegister')(data.map);
                            // $state.go('main.myaccountHome');
                            // _hmt.push(['_trackPageview', 'www.hongyajinrong.com/maidian/smrz']);
                            // if(data.tyj){
                            ngDialog.open({
                                template: '<p class="error-msg">认证成功！</p>',
                                showClose: false,
                                closeByDocument: true,
                                plain: true
                            });
                            setTimeout(function() {
                                ngDialog.closeAll();
                                $filter('跳回上一页')();
                            }, 2000);
                            // $scope.tyj = true;
                            // $scope.isCps = data.map.isCps;
                            // }
                            // else{
                            //     if($stateParams.from=='changcheng2'){
                            //         $state.go('recharge',{from:'changcheng2'});
                            //     }
                            //     else{
                            //         $state.go('main.myaccountHome');
                            //     }
                            // }
                            
                        }else{
                            $filter('实名认证错误信息')(data.errorCode,$scope,'y');
                        }
                    break;
                    case 'bankList':
                        if(data.success){
                            $scope.banklist = data.map.bankQuotaList;
                            $scope.smrFrom.bank= "请选择";
                        }
                    break;
                    case 'selectCity':
                        $scope.sysCityList = data.map.cityList;
                        $scope.showCityList = true;
                        $scope.smrFrom.cityId = null;
                    break;


                };
            });
            $scope.toWhere = function(state){
                $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                $state.go(state);
            }
            $scope.close = function(){
                $scope.tyj = false;
                $('body,html').css({ width:'auto', height: 'auto', overflow: 'initial' });
                if($stateParams.from=='changcheng2'){
                    $state.go('recharge',{from:'changcheng2'});
                }
                else{
                    $state.go('main.myaccountHome');
                }
            }

            $scope.toback=function () {
                $filter('跳回上一页')();
            };
            $scope.onClick=function () {
                ngDialog.closeAll();
            };
            
            $scope.toSub=function (name) {
                switch(name){
                    case '信息认证': 
                        if($scope.isSubMin){
                            resourceService.queryPost($scope, $filter('getUrl')(name), {
                                uid:user.member.uid,
                                mobilePhone:$scope.smrFrom.phone,
                                bankNum:$filter('limitTo')($scope.smrFrom.bankNum1,-4),
                                type:1,
                                token:user.token
                            }, name);
                        };
                    break; 
                    case '实名认证': 
                        $scope.smrFrom.uid=user.member.uid;
                        $scope.smrFrom.channel=3;
                        $scope.smrFrom.token= user.token;
                        $scope.smrFrom.bankNum = $scope.smrFrom.bankNum1;
                        $scope.smrFrom.cityId = $scope.smrFrom.cityId;
                        $scope.smrFrom.branchName = $scope.smrFrom.bankName;
                        if($scope.submitBool){
                            resourceService.queryPost($scope, $filter('getUrl')(name), $scope.smrFrom, name);
                        };
                    break;
                };
            }

            $scope.selectCity = function(n) {
                resourceService.queryPost($scope, $filter('getUrl')('selectCity'),{pinyin: $scope.smrFrom.bankCity},'selectCity');
            };

            $scope.clickCity = function (id,name){
                $scope.smrFrom.cityId = id;
                $scope.smrFrom.bankCity = name;
                $scope.showCityList = false;
            };

            $scope.handleBankChange = function (){
                // 中行， 建行， 广发 必填
                if($scope.smrFrom.bank == 29 || $scope.smrFrom.bank == 23 || $scope.smrFrom.bank == 34){
                    $scope.showBankName = true;
                } else {
                    $scope.showBankName = false;
                }

            };

        }
    ]);
})
