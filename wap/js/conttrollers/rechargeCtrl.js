
/* 
* @Author: lee
* @Date:   2016-05-24 
*/


define([
    'webappControllers'
    ]
    ,function(controllers){
    controllers.controller('rechargeController'
        ,['$scope'
        ,'$filter'
        ,'$state'
        ,'$interval'
        ,'$rootScope'
        ,'resourceService'
        ,'ngDialog'
        ,'$stateParams'
        ,'$localStorage'
        ,function($scope,$filter,$state,$interval,$rootScope,resourceService,ngDialog,$stateParams,$localStorage){
            $rootScope.title="充值";
            $scope.userOBJ=$filter('isRegister')();
            $scope.code = {};
            $scope.code.getCodeText = '获取验证码';
            $scope.recharge = {};
            $scope.fuyouObj = {};
            $scope.height = {
                height: window.innerHeight + 'px'
            }
            ngDialog.closeAll();
            if($stateParams.from=='home' && $localStorage.cp){
                delete $localStorage.cp;
            }
            $scope.changcheng2 = false;
            if($stateParams.from == 'changcheng2'){
                $scope.changcheng2 = true;
            }
            resourceService.queryPost($scope, $filter('getUrl')('充值'), {
                    uid:$scope.userOBJ.user.member.uid,
                    token:$scope.userOBJ.user.token
            }, {name:'充值'});

            $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event,data,type) {
                switch(type.name){
                    case '充值': 
                        if(data.success){
                            $scope.recharge = data.map;
                            if(data.map.sysArticleList.length>0){
                                $scope.message = data.map.sysArticleList[0].summaryContents;
                            }
                        }else{
                            $filter('服务器信息')(data.errorCode,$scope,'y');
                        }
                    break;
                    case '创建订单': 
                        if(data.success){
                            $scope.recharge.payNum = data.map.payNum;
                            $filter('充值弹窗')($scope);
                        }else{
                            $filter('提现申请错误信息')(data.errorCode);
                        }
                    break;
                    case '充值验证码':
                        if (data.success) {
                            if (type.isvoice) {
                                $scope.isGetVoice = true;
                            } else {
                                $scope.isGetVoice = false;
                            }

                            // item.times = 59;
                            if (!type.isvoice || (type.isvoice && !type.item.isGetCode)) {
                                if (!type.isvoice) {
                                    type.item.isGetCode = true;
                                }
                                type.item.timer = $interval(function(){
                                    if (type.item.times == 0) {
                                        $interval.cancel(type.item.timer);
                                        type.item.getCodeText = '获取验证码';
                                        $scope.isGetVoice = false;
                                        type.item.isGetCode = false;
                                        type.item.times = 59;
                                        $('.getcode').removeClass('getcode-disabled');
                                        return;
                                    }
                                    type.item.getCodeText = type.item.times + 's重新获取';
                                    type.item.times --;
                                }, 1000);
                            }
                        } else {
                            $('.getcode').removeClass('getcode-disabled');
                            $filter('充值验证码error信息')(data.errorCode);
                        }
                    break;
                    case '认证充值': 
                        if(data.success){
                            $scope.successAmount = data.map.amount;
                            if (data.map.src != undefined) {
                                ngDialog.closeAll();
                                $scope.giftFlag = true;
                            } else {
                                $scope.giftFlag = false;
                                $filter('充值成功')($scope);
                            }
                        }
                        else{
                            if (data.errorCode == '1004') {
                                $filter('充值成功')($scope,'ing');
                            } else {
                                $scope.isSubmitDialog = false;
                                // if (data.errorCode == '1003') {
                                //     ngDialog.open({
                                //         template: '<p class="error-msg">验证码错误</p>',
                                //         showClose: false,
                                //         closeByDocument: true,
                                //         plain: true
                                //     });
                                // } else {
                                    $filter('认证充值错误信息')(data.errorCode);
                                // }
                            }
                        }
                    break;
                    case 'goRecharge':
                        $scope.fuyouObj = data.map;
                        document.getElementById('fuyouForm').action = data.map.submit_url;
                        setTimeout(function(){
                            document.getElementById('fuyouForm').submit();
                        }, 400)

                    break;
                };
            });
            $scope.closeGift = function() {
                $state.go('main.myaccountHome');
                $scope.giftFlag = false;
            }

            $scope.fuyouSubmit = function() {
                console.log('lll')
            }

            // onblur将金额保留两位小数
            $scope.setAmount = function(event) {
                if ($scope.rechargeForm.recharge.$error.pattern) {
                    $filter('充值错误信息')('pattern',$scope);
                } else if ($scope.rechargeForm.recharge.$error.more3) {
                    $filter('充值错误信息')('more3',$scope);
                } else if ($scope.rechargeForm.recharge.$error.rechargelimit) {
                    $filter('充值错误信息')('rechargelimit',$scope);
                } else if ($scope.rechargeForm.recharge.$error.required) {
                    $filter('充值错误信息')('required',$scope);
                }
                // $scope.recharge.amount = $filter('isNumber2')($scope.recharge.amount,undefined,1);
            };

            // 提交表单
            $scope.submitForm = function(valid) {
                if (!valid || $scope.isSubmit) {
                    return;
                }
                $scope.isSubmit = true;
                // resourceService.queryPost($scope, $filter('getUrl')('创建订单'),{
                //     amount: $scope.recharge.amount,
                //     uid:$scope.userOBJ.user.member.uid
                // },{name:'创建订单'});
                resourceService.queryPost($scope, $filter('getUrl')('goRecharge'),{
                    amount: $scope.recharge.amount,
                    uid:$scope.userOBJ.user.member.uid,
                    channel:3,
                    source:'h5',
                },{name:'goRecharge'});
            };

            $scope.submitDialogForm = function(valid) {
                if (!valid || $scope.isSubmitDialog) {
                    return;
                }
                $scope.isSubmitDialog = true;
                resourceService.queryPost($scope, $filter('getUrl')('认证充值'),{
                    payNum: $scope.recharge.payNum,
                    smsCode: $scope.recharge.phonecode,
                    uid:$scope.userOBJ.user.member.uid
                },{name:'认证充值'});
            };
            $scope.code.times = 59;
            $scope.getPhoneCode = function(entrance, event, item, isvoice) {
                var type = 1;
                
                if (!$filter('isRegister')().register) {
                    return;
                }
                var $this = $(event.currentTarget);
                if ($this.hasClass('getcode-disabled')) {
                    return;
                }
                $this.addClass('getcode-disabled');

                resourceService.queryPost($scope, $filter('getUrl')('充值验证码'),{
                    type: type,
                    payNum: $scope.recharge.payNum,
                    uid:$scope.userOBJ.user.member.uid
                },{name:'充值验证码',isvoice:isvoice,item:item});
            };
            $scope.toback=function () {
                        $filter('跳回上一页')();
                    };
        }
    ]);
})