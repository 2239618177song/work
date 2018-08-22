define(['webappControllers', 'jweixin', ['$scope', '$filter', '$rootScope',"$state",'$location','ngDialog','$localStorage', '$stateParams', 'resourceService']], function (controllers, jweixin) {
    controllers.controller('yuandanCtrl', function ($scope, $filter,$rootScope,$state,$location,ngDialog,$localStorage,$stateParams, resourceService, isWeixin) {
        $rootScope.title = '年底加"薪"计划正式启动';
        $scope.selectDay = '30';
        $scope.days = [{
            id: '1',
            name: '30'
        }, {
            id: '2',
            name: '60'
        }, {
            id: '3',
            name: '90'
        }, {
            id: '4',
            name: '180'
        }];
        $scope.investScore = 0;
        // $scope.userOBJ = $filter('isRegister')(); 
        $scope.isShow = false;//兑奖记录弹出框默认隐藏
        $scope.isShowChange = false;
        $scope.app = $stateParams.app;
        $scope.isLogin =true; 
        // $scope.userOBJ = $filter('isRegister')();
        // $scope.user = $scope.userOBJ.user.member;          //判断是否登录  
        // var userObj = {};      
        if($scope.changeScore == ''|| $scope.changeScore == undefined){
            $scope.money = 0;
        }
        //判断登录状态
        if(!$scope.app&&$localStorage.user){
          //H5
            $scope.uid = $localStorage.user.member.uid; //获取uid
            resourceService.queryPost($scope, $filter('getUrl')('积分显示'), {
                uid:$scope.uid,
                token:$stateParams.token,
            },'积分显示');
        }else if($scope.app&&$stateParams.uid && $stateParams.token){
            //App
            $scope.uid = $stateParams.uid; //获取uid
            resourceService.queryPost($scope, $filter('getUrl')('积分显示'), {
                uid:$scope.uid,
                token:$stateParams.token,
            },'积分显示');
        }else{
            $scope.isLogin =false;
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                 case "积分显示":
                    $scope.point = data.map.point; 
                 break;
            }
        })
        // 一键领取
        
        $scope.getAll = function(){
            if($scope.isLogin){
                resourceService.queryPost($scope, $filter('getUrl')('一键领取'), {
                    uid:$scope.uid,//传参
                    token:$stateParams.token,
                },'一键领取');  
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                    switch (type) {
                         case "一键领取":
                            $scope.isGetAll = data.flag;
                            if ($scope.isGetAll) {
                                ngDialog.open({
                                    template: '<p class="error-msg">您已经领取过了！</p>',
                                    showClose: false,
                                    closeByDocument: true,
                                    plain: true
                                });
                            } else if (!$scope.isGetAll || $scope.isGetAll==undefined) {
                                ngDialog.open({
                                    template: '<p class="error-msg">福利已到账，请到"我的"查看！</p>',
                                    showClose: false,
                                    closeByDocument: true,
                                    plain: true
                                });
                            }
                         break;
                    }
                })
            }else{
                if($scope.app){
                    window.location.href = "jsmp://page=3";
                }else{
                    $state.go('dl',{
                      returnurl:'yuandanCtrl'  
                    });
                }
            }
        }
       $scope.autoScore = function(){
        if ($scope.investMoney < 1000) {
            $scope.investScore = 0;
            // ngDialog.open({
            //     template: '<p class="error-msg">投资金额要大于1000！</p>',
            //     showClose: false,
            //     closeByDocument: true,
            //     plain: true
            // });
            // setTimeout(function () {
            //     ngDialog.closeAll();
            // }, 500);
        }else {
            $scope.selectDay = $('#select').val();
            switch ($scope.selectDay) {
                case '30':
                    $scope.investScore = $scope.investMoney * 1.2
                    break;
                case '60':
                    $scope.investScore = $scope.investMoney * 3
                    break;
                case '90':
                    $scope.investScore = $scope.investMoney * 4
                    break;
                case '180':
                    $scope.investScore = $scope.investMoney * 5
                    break;
            };
        }
       }
        // 计算可得积分
        $scope.getScore = function(){
            if ($scope.investMoney < 1000) {
                $scope.investScore = 0;
                ngDialog.open({
                    template: '<p class="error-msg">投资金额要大于1000！</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 500);
            }else {
                // $scope.selectDay = $('#select').val();
                switch ($scope.selectDay) {
                    case '30':
                        $scope.investScore = $scope.investMoney * 1.2
                        break;
                    case '60':
                        $scope.investScore = $scope.investMoney * 3
                        break;
                    case '90':
                        $scope.investScore = $scope.investMoney * 4
                        break;
                    case '180':
                        $scope.investScore = $scope.investMoney * 5
                        break;
                };
            }
        }
        // 积分兑换奖品
        $scope.showGiftPanel = function(id,points){
            if($scope.isLogin){
                $scope.record = points;//奖品所需积分
                if($scope.point <points){
                    ngDialog.open({
                        template: '<p class="error-msg">剩余积分不足</p>',
                        showClose: false,
                        closeByDocument: true,
                        plain: true
                    });
                }else{
                    $scope.isShowChange = true;
                    $scope.id = id;
                }
            }else{
                ngDialog.open({
                    template: '<p class="error-msg">请先登录！</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1000); 
            }
        }
        // 积分兑换现金
        $scope.changeMoney = function(){
            if($scope.isLogin){
                if (!$scope.changeScore) {
                    ngDialog.open({
                        template: '<p class="error-msg">请输入要兑换的积分！</p>',
                        showClose: false,
                        closeByDocument: true,
                        plain: true
                    });
                    setTimeout(function () {
                        ngDialog.closeAll();
                    }, 1000); 
                } else {
                    if($scope.changeScore<120) {
                        ngDialog.open({
                            template: '<p class="error-msg">兑换积分数值不得少于120积分！</p>',
                            showClose: false,
                            closeByDocument: true,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                        }, 1000); 
                    }else if($scope.changeScore > $scope.point){
                        ngDialog.open({
                            template: '<p class="error-msg">剩余积分不足！</p>',  
                            showClose: false,
                            closeByDocument: true,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                        }, 1000); 
                    }
                    else{
                        $scope.isShowChange = true;
                        $scope.id = '26';
                        $scope.points = $scope.changeScore;
                    }
                }
            }else{
                ngDialog.open({
                    template: '<p class="error-msg">请先登录！</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1000);
            }
        }
        // 确认兑换
        $scope.changeGift = function(id,points){
            id = $scope.id;
            if(id == 26){
                points =  $scope.points;
                resourceService.queryPost($scope, $filter('getUrl')('奖品兑换'), { 
                    uid:$scope.uid,
                    token:$stateParams.token,
                    goodId:id,
                    point:points
                }, '奖品兑换');
            }else{
                points = $scope.record;
                resourceService.queryPost($scope, $filter('getUrl')('奖品兑换'), { 
                    uid:$scope.uid,
                    token:$stateParams.token,
                    goodId:id,
                }, '奖品兑换');
            }
            $scope.isShowChange = false;
            ngDialog.open({
                template: '<p class="error-msg">恭喜您，兑换成功！</p>',
                showClose: false,
                closeByDocument: true,
                plain: true
            });
            setTimeout(function () {
                ngDialog.closeAll();
                window.location.reload();
            }, 2000);
        }
        // 登录可见
        $scope.onClick = function(){
            if($scope.app){
                window.location.href = "jsmp://page=3";
            }else{
                $state.go('dl',{
                    returnurl:'yuandanCtrl'  
                  });
            }
           
        }
        // 兑换记录
        $scope.myRecord = function(){
            if($scope.isLogin){
                if($scope.isShow){
                    $scope.isShow = false;
                }else{
                    $scope.isShow = true;
                }
                resourceService.queryPost($scope, $filter('getUrl')('积分显示'), {
                    uid:$scope.uid,
                    token:$stateParams.token,
                },'积分显示');
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) { 
                    switch (type) {
                         case "积分显示":
                            $scope.rescordList = data.map.ExchangeList;
                         break;
                    }
                })
            }else{
                ngDialog.open({
                    template: '<p class="error-msg">请先登录！</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            }
        }
        // 关闭弹窗
        $scope.close = function(){
            $scope.isShow = false;
            $scope.isShowChange = false;
        }
        // $scope.ishide = true;
        $scope.is120 = function(){
            if ($scope.changeScore % 120 == 0) {
                $scope.ishide = true;
            } else {
                $scope.ishide = false;
            }
        }
    })
})