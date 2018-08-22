/* 
* @Author: anchen
* @Date:   2016-01-12 20:39:33
* @Last Modified by:   anchen
* @Last Modified time: 2016-01-12 21:50:31
*/

'use strict';
define(['app', 'jweixin', 'jquery'], function (app, wx, $) {

    app
        /*当前登录状态*/
        .filter('isRegister', function ($localStorage, $filter, $state) {
            return function (certification) {
                var obj = {};
                obj.register = false;
                obj.user = {};
                if ($localStorage.user != undefined) {
                    obj.register = true;
                    if (certification != undefined) { $localStorage.user.certification = certification; };
                    if ($localStorage.user.certification == undefined) {
                        $localStorage.user.userName = '亲爱的用户';
                    } else {
                        $localStorage.user.userName = $localStorage.user.realName;
                    }
                    obj.user = $localStorage.user;
                } else {
                    obj.register = false;
                    obj.user.userName = '亲爱的用户';
                }
                return obj;
            }
        })
        /*浏览记录*/
        .filter('isPath', function ($localStorage, $filter, $state) {
            return function (url) {
                $localStorage.pathUrl.push(url);
            }
        })
        /*跳回上一页*/
        .filter('跳回上一页', function ($localStorage, $state) {

            return function (number) {
                var num = 1;
                if (number != undefined) {
                    num = number;
                };
                if ($localStorage.pathUrl != undefined) {
                    if ($localStorage.pathUrl.length > 0) {
                        if ($localStorage.pathUrl[$localStorage.pathUrl.length - num] == undefined) {
                            delete $localStorage.userForm;
                            $state.go('main.home');
                        }
                        else if ($localStorage.cp != undefined) {
                            // else{
                            if ($localStorage.active != undefined) {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { pid: $localStorage.cp.info.id, wap: true, active: $localStorage.active });
                            }
                            else {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { pid: $localStorage.cp.info.id, wap: true });
                            }
                            // }
                        }
                        else {
                            if ($localStorage.active != undefined) {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { wap: true, active: $localStorage.active });
                            }
                            else {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { wap: true });
                            }
                            // $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num],{wap:true});
                        }
                        for (var i = 0; i < num; i++) {
                            $localStorage.pathUrl.pop();
                        }
                    } else {
                        delete $localStorage.userForm;
                        $state.go('main.home');
                    }
                } else {
                    delete $localStorage.userForm;
                    $state.go('main.home');
                    $localStorage.pathUrl = [];
                }
            }
        })
        /*清空缓存*/
        .filter('清空缓存', function ($localStorage) {
            return function () {
                $localStorage.pathUrl = [];
                delete $localStorage.user;
                if ($localStorage.showActivityDialog != undefined) {
                    delete $localStorage.showActivityDialog;
                }
                if ($localStorage.showActivityRedbagDialog != undefined) {
                    delete $localStorage.showActivityRedbagDialog;
                }
            }
        })
        /*显示密码*/
        .filter('isShowPw', function () {
            return function (bool) {
                var classPw = {};
                if (bool) { classPw.type = 'text'; } else { classPw.type = 'passWord'; };
                return classPw;
            }
        })
        /*性别*/
        .filter('sex', function () {
            return function (type) {
                var x = {};
                if (type == 1) { x = '先生'; } else { x = '女士'; };
                return x;
            }
        })
        /*倒计时*/
        .filter('60秒倒计时', function ($timeout) {
            return function (scope, timeNum) {
                scope.nowTimer = '获取验证码';
                var timer;
                var isError = false;
                var nowTimer = timeNum;
                if (scope.isSubMin) {
                    setTimerOut();
                }
                function setTimerOut() {
                    // scope.isSubMin=false;
                    timer = $timeout(
                        function () {
                            if (nowTimer <= 0) {
                                if (isError) {
                                    scope.nowTimer = '获取验证码';
                                } else {
                                    scope.nowTimer = '重发';
                                }
                                scope.disabledPhoneBtn = false;
                                scope.isSubMin = true;
                                // if (scope.changeIMG != undefined) {
                                //     scope.changeIMG();
                                // };

                            } else {
                                scope.isSubMin = false;
                                nowTimer -= 1;
                                scope.nowTimer = nowTimer + '秒 ';
                                setTimerOut();
                            }
                        },
                        1000
                    );
                };
                scope.stop = function () {
                    nowTimer = 0;
                    isError = true;
                };
            }
        })

        /*错误信息----------------------------------------------*/

        .filter('serverZuceError', function ($rootScope) {//手机
            return function (form, name) {
                var error = {
                    1001: "短信验证码为空",
                    1002: "短信验证码错误",
                    1003: "手机号错误",
                    1004: "图片验证码错误",
                    1005: "密码格式6-18位字母数字混合",
                    1006: "未勾选注册协议",
                    1007: "手机号已注册",
                    1008: "推荐人不存在"
                };
                $rootScope.errorText = error[name];
                $rootScope.maskError = true;
                return error[name];
            }
        })
        /*错误信息----------------------------------------------*/

        .filter('手机短信验证错误', function ($rootScope) {//手机
            return function (form, name) {
                var error = {
                    1001: "短信验证码为空",
                    1002: "系统错误",
                    1003: "短信发送失败",
                    8888: "频繁操作"
                };
                $rootScope.errorText = error[name];
                $rootScope.maskError = true;
                return error[name];
            }
        })
        /*登录密码验证*/
        .filter('denLuPassWordError', function () {
            return function (code, name) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误"
                };
                code.$valid = false;
                var text = '';
                if (code.$error["serverError"]) {
                    code.$valid = true;
                    delete code.$error.pattern;
                    delete code.$error.required;
                    if (error[name] != undefined) {
                        text = error[name];
                    } else {
                        code.$valid = false;
                    }
                }
                return text;
            }
        })
        /*登录用户名*/
        .filter('denLuUserNameError', function () {
            return function (code, name) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误"
                };
                code.$valid = false;
                var text = '';
                if (code.$error["required"]) {
                    if (code.$dirty) {
                        code.$valid = true;
                    };
                    delete code.$error.serverError;
                    text = '请输入您的手机号';
                } else
                    if (code.$error["pattern"]) {
                        code.$valid = true;
                        delete code.$error.serverError;
                        text = '此用户名无效';
                    } else
                        if (code.$error["minlength"]) {
                            code.$valid = true;
                            delete code.$error.serverError;
                            text = '用户名长度错误';
                        } else
                            if (code.$error["serverError"]) {
                                code.$valid = true;
                                delete code.$error.pattern;
                                delete code.$error.minlength;
                                delete code.$error.required;
                                if (error[name] != undefined) {
                                    text = error[name];
                                } else {
                                    code.$valid = false;
                                }
                            }
                return text;
            }
        })
        .filter('serverSmsError', function ($rootScope) {//短信
            return function (form, name) {
                var error = {
                    1001: "图片验证码不正确",
                    1002: "每个手机号当天只能发送5条",
                    1003: "短信发送失败"
                };
                $rootScope.errorText = error[name];
                $rootScope.maskError = true;
                return error[name];
            }
        })
        .filter('errorMsgDialog', function ($rootScope) {
            return function (name, dialog, replenish) {
                var error = {
                    noSelect: "请选需要操作的节点!",
                    noSelectRole: "请在角色列表中选中角色才能分配权限！",
                    delVerify: "确定要删除节点：",
                    loginErro: "登录失败：",
                    netErro: "网络异常：请检查你的网络！",
                    addOK: "新增成功!",
                    delOK: "删除成功!",
                    updateOK: "修改成功!",
                    czOK: "操作成功!",
                    none: ""
                };
                var errormessage;
                if (replenish !== undefined) {
                    errormessage = error[name] + replenish;
                } else {
                    errormessage = error[name];
                }
                return dialog;
            }
        })
        /*服务器-errorCode*/
        .filter('服务器信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    1001: "账号或密码为空",
                    1002: "验证码错误",
                    1003: "账号或密码错误",
                    9998: "请重新登录",
                    9999: "系统错误，请稍后刷新重试",
                    10001: "当日用户无分享记录",
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];

                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '通知：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('实名认证错误信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    1001: "真实姓名不能为空",
                    1002: "身份证号不能为空",
                    1003: "银行卡号不能为空",
                    1004: "手机号码不能为空",
                    1005: "短信验证码不能为空",
                    1006: "短信验证码错误",
                    1007: "银行卡类型不符，请更换银行卡后重试",
                    1008: "此卡未开通银联在线支付功能,实名认证失败，请联系发卡银行",
                    1009: "不支持此银行卡的验证",
                    1010: "免费验证次数已用完，请联系客服人员。",
                    1011: "认证失败",
                    1012: "该身份证号已认证",
                    1013: "渠道不能为空",
                    1014: "请核对个人信息",
                    1015: "请核对银行卡信息",
                    1016: "该银行卡bin不支持",
                    1017: "认证失败，系统异常请稍后再试",
                    9998: "您的登录已过期或已在其他设备登录，请重新登录",
                    9999: "系统错误",
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('投资错误信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    1001: "交易密码错误",
                    1002: "产品已募集完",
                    1003: "项目可投资金额不足",
                    1004: "小于起投金额",
                    1005: "非递增金额整数倍",
                    1006: "投资金额大于项目单笔投资限额",
                    1007: "账户可用余额不足",
                    1008: "已投资过产品，不能投资新手产品",
                    1009: "用户不存在",
                    1010: "优惠券不可用",
                    1011: "投资失败,请稍后再试",
                    2001: "交易密码已被锁定",
                    9998: "您的登录已过期或已在其他设备登录，请重新登录",
                    9999: "系统错误",
                    noInp: "请输入投资金额",
                    noPwd: "请输入交易密码",
                    ok: "投资成功",
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = null;
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('实名短信错误信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    1001: "手机号码有误",
                    1002: "系统错误",
                    1003: "短信发送失败",
                    1004: "银行卡尾号不能为空",
                    8888: "频繁操作",
                    ok: '短信发送成功',
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = null;
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('意见反馈信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    ok: '感谢您对我们的支持'
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = null;
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        /*根据用户状态提示跳转页面方向*/
        .filter('提示跳转', function (ngDialog) {
            return function (templateurl, scope) {
                ngDialog.open({
                    template: templateurl,
                    scope: scope,
                    closeByDocument: false,
                    plain: false
                });
                // setTimeout(function () {
                //     ngDialog.closeAll();
                //     $filter('跳回上一页')();
                // }, 1500);
                // return  dialog;
            };
        })
        /***********************换算*******************************************/
        .filter('isNumber2', function ($rootScope) {
            return function (num, type, flag) {
                if (num == undefined) {
                    if (flag == undefined) {
                        return 0;
                    }
                } else {
                    if (isNaN(num)) {
                        if (flag == undefined) {
                            return 0;
                        }
                    } else {
                        var num = new Number(num);
                        var num = num.toFixed(4);
                        if (type != undefined) {
                            num = num.substring(0, num.lastIndexOf('.') + 0) // 123456.78
                        } else {
                            num = num.substring(0, num.lastIndexOf('.') + 3) // 123456.78
                        }
                    }

                    $rootScope.shouyi = num;
                    return num;
                }
            };
        })
        .filter('mosaic', function () {
            return function (str) {
                if (!str) {
                    return str;
                }
                if (str.match(/^1[3|4|5|7|8][0-9]{9}$/)) {
                    return str.substr(0, 3) + '****' + str.substr(7, str.length - 7)
                } else {
                    if (str.length > 2) {
                        return str.substr(0, 1) + '********'.substring(0, str.length - 2) + str.substr(str.length - 1, 1)
                    } else {
                        return str.substr(0, 1) + '*';
                    }
                }
            };
        })
        /***********************换算*******************************************/
        .filter('setProgress', function () {
            return function (num) {
                if (num == undefined) {
                    return 0;
                } else {
                    if (isNaN(num)) {
                        return 0;
                    } else {
                        if (num > 0 && num <= 1) {
                            num = 1;
                        } else if (num >= 99 && num < 100) {
                            num = 99;
                        } else {
                            num = parseInt(num);
                        }
                    }
                    return num;
                }
            }
        })
        .filter('提现错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    'required': "请输入提现金额",
                    'pattern': "请输入正确的数值",
                    'morethan': "提现金额至少为1元",
                    'morethan3': "提现金额至少为3元",
                    'withdrawlimit': "提现金额最多为" + scope.cash.funds + "元",
                    'maxlimit': "提现金额最多为5,000,000元"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('提现申请错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    1001: "提现金额有误",
                    1002: "交易密码不能为空",
                    1003: "交易密码错误",
                    1004: "余额不足",
                    1005: "交易失败，请再次申请",
                    1006: "处理中",
                    1007: "该笔需要收取手续费",
                    1008: "该笔不需要收取手续费",
                    1009: "渠道不能为空",
                    2002: "返现或体验金收益需完成一次真实投资后才可提现"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '（' + msg + '）' + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })
        .filter('充值错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    'required': "请输入充值金额",
                    'pattern': "请输入正确的数值",
                    'more3': "充值金额至少为3元",
                    'rechargelimit': "充值金额最多为" + scope.recharge.singleQuota + "元"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('修改交易密码错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    'codeRequired': "请输入短信验证码",
                    'tpwdRequired': "请输入交易密码",
                    'tpwdPattern': "交易密码格式错误"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('修改登录密码错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    'codeRequired': "请输入短信验证码",
                    'pwdRequired': "请输入登录密码",
                    'pwdPattern': "登录密码格式错误"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                }, 1500);
            };
        })
        .filter('登录交易密码短信验证码错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    8888: "频繁操作",
                    1001: "手机号码有误",
                    // 1002: "当天短信发送超过限制",
                    1002: "短信发送失败",
                    1003: "短信发送失败"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })
        .filter('重置交易密码短信验证码错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    8888: "频繁操作",
                    1001: "发送失败"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })
        .filter('重置交易密码错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    9999: "系统错误",
                    1001: "验证码错误",
                    1002: "密码为空",
                    1003: "交易密码不合法"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                scope.isSubmit = false;
            };
        })
        .filter('重置登录密码错误信息', function (ngDialog, $filter) {
            return function (msg, scope) {
                var error = {
                    9999: "系统错误",
                    1001: "验证码错误",
                    1002: "密码为空",
                    1003: "登录密码不合法"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                scope.isSubmit = false;
            };
        })
        .filter('重置密码成功', function (ngDialog, $filter, $state) {
            return function (msg, scope) {
                ngDialog.open({
                    template: '<p class="success-msg">' + msg + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function () {
                    ngDialog.closeAll();
                    $filter('清空缓存')()
                    $state.go('dl');
                }, 1500);
            };
        })
        .filter('重置交易密码成功', function (ngDialog, $filter, $state) {
            return function (msg, scope) {
                ngDialog.open({
                    template: '<p class="success-msg">' + msg + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function () {
                    ngDialog.closeAll();
                    $filter('跳回上一页')();
                }, 1500);
            };
        })
        .filter('创建订单错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    1001: "金额有误",
                    1002: "系统错误，请稍后重试",
                    1003: "超过限额，请修改金额后重试"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })
        .filter('充值弹窗', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/recharge-dialog.html',
                    className: 'recharge-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: false,
                    showClose: false
                });
            };
        })
        .filter('投资交易密码错误信息', function (ngDialog, $state, $localStorage) {
            return function (scope) {
                scope.closeDialog = function () {
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '<div class="recharge-dialog forget"><div class="title">提示</div><p>连续输错三次，您的交易密码已被锁定！请一小时后再试，或点击忘记密码</p><div class="btns"><span ng-click="closeDialog()">稍后再试</span><span class="right" ng-click="closeDialog()" ui-sref="resetTradePwd({firstset:false})">忘记密码</span></div></div>',
                    className: 'recharge-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
            };
        })
        .filter('充值验证码error信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    9999: "系统错误",
                    8888: "频繁操作",
                    1002: "短信发送失败"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })
        .filter('登录错误信息', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误",
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })
        .filter('认证充值错误信息', function (ngDialog, $filter, $state) {
            return function (msg, scope) {
                var error = {
                    9999: "系统错误",
                    1001: "充值金额有误",
                    1002: "验证码不能为空",
                    1003: "验证码错误",
                    1004: "处理中",
                    1005: "系统错误，请稍后重试",
                    1006: "超出单卡号累计交易次数限制",
                    1007: "超出银行授信额度",
                    1008: "超过用户在银行设置的限额",
                    1009: "持卡人身份证验证失败",
                    1010: "对不起，您累计交易支付金额超出单笔限额",
                    1011: "对不起，您累计交易支付金额超出当日限额",
                    1012: "对不起，您累计交易支付金额超出当月限额",
                    1013: "非法用户号",
                    1014: "该卡暂不支持支付，请更换其他银行卡重试",
                    1015: "该卡暂不支持支付，请稍后再试",
                    1016: "交易超时",
                    1017: "交易金额不能大于最大限额",
                    1018: "交易金额不能低于最小限额",
                    1019: "交易金额超过渠道当月限额",
                    1020: "交易金额为空",
                    1021: "交易金额有误错误",
                    1022: "交易失败，风险受限",
                    1023: "交易失败，详情请咨询您的发卡行",
                    1024: "金额格式有误",
                    1025: "仅支持个人银行卡支付",
                    1026: "您的银行卡不支持该业务，请与发卡行联系",
                    1027: "请核对个人身份证信息",
                    1028: "请核对您的订单号",
                    1029: "请核对您的个人信息",
                    1030: "请核对您的银行卡信息",
                    1031: "请核对您的银行信息",
                    1032: "请核对您的银行预留手机号",
                    1033: "未开通无卡支付或交易超过限额，详情请咨询您的发卡行",
                    1034: "信息错误，请核对",
                    1035: "银行户名不能为空",
                    1036: "银行卡未开通银联在线支付，请向银行咨询",
                    1037: "银行名称无效",
                    1038: "银行系统繁忙，交易失败，请稍后再提交",
                    1039: "银行账号不能为空",
                    1040: "余额不足",
                    1041: "证件号错误，请核实",
                    1042: "证件号码不能为空",
                    1043: "证件类型与卡号不符",
                    1044: "银行账户余额不足"
                };
                // ngDialog.closeAll();
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '（' + msg + '）' + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
                // setTimeout(function () {
                //     ngDialog.closeAll();
                //     $state.go('recharge', null, {
                //         reload: true
                //     });
                // }, 1500);
            };
        })
        .filter('充值成功', function (ngDialog, $filter, $state, $localStorage) {
            return function (scope, type) {
                ngDialog.closeAll();
                var msg = '';
                if (type == 'ing') {
                    msg = '<p class="success-msg">充值处理中，请稍后查询处理结果</p>';
                } else {
                    msg = '<h3 class="success-msg">充值成功</h3><main>您已成功充值' + $filter('currency')(scope.successAmount, '') + '元<br>预计将在10分钟内到账，请耐心等待。</main>';
                }
                ngDialog.open({
                    template: msg,
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function () {
                    ngDialog.closeAll();
                    if (scope.changcheng2 == true) {
                        $state.go('changcheng2');
                    }
                    else if ($localStorage.cp != undefined) {
                        if ($localStorage.cp.prize != undefined) {
                            $state.go('tjsinvestment', { wap: true, pid: $localStorage.cp.info.id });
                        }
                        else {
                            $state.go('investment');
                        }
                    } else {
                        $state.go('main.myaccountHome');
                    }

                }, 1500);
            };
        })
        .filter('isCPtradeType', function () {
            return function (tradeType) {
                var t = {
                    1: "充值",
                    2: "提现",
                    3: "投资",
                    4: "活动",
                    5: "提现手续费",
                    6: "回款",
                    7: "体验金"
                };
                return t[tradeType];
            };
        })
        .filter('isBankType', function () {
            return function (tradeType) {
                var t = {
                    1: "中国工商银行",
                    2: "中国农业银行",
                    3: "中国建设银行",
                    4: "中国银行",
                    5: "中国邮政储蓄银行",
                    6: "招商银行",
                    7: "兴业银行",
                    8: "中国光大银行",
                    9: "广发银行",
                    10: "平安银行",
                    11: "中国民生银行",
                    12: "浦发银行",
                    13: "中信银行",
                    14: "上海银行",
                    15: "北京银行",
                    16: "交通银行",
                    17: "兰州银行",
                    18: "华夏银行"
                };
                return t[tradeType];
            };
        })
        .filter('isCPstatus', function () {
            return function (status) {
                var t = {
                    1: "处理中",
                    2: "失败",
                    3: "成功",
                    4: "募集中",
                    5: "待续投"
                };
                return t[status];
            };
        })
        .filter('time-out', function ($rootScope, $interval) {
            return function (status) {
                $scope.timer = interval(function () {
                }, 1000);
            };
        })
        // 单选
        .filter('isBool', function ($rootScope, $interval) {
            return function (bool) {
                // console.log(bool);
                if (bool) {
                    bool = false;
                } else {
                    bool = true;
                }
                return bool;
            };
        })
        /*×××××××××××××××××××××××××× over ×××××××××××××××××××××××××××××××*/
        //  倒计时弹窗
        .filter('倒计时弹窗', function (ngDialog) {
            return function (scope) {
                ngDialog.open({
                    template: '../../template/dialog/countdown-dialog.html',
                    className: 'special-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    showClose: false
                });
            };
        })
        //  幸运码弹窗
        .filter('幸运码弹窗', function (ngDialog, $timeout) {
            return function (scope) {
                ngDialog.open({
                    template: '../../template/dialog/special-code-dialog.html',
                    className: 'special-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    showClose: false
                });
                $timeout(function () {
                    $('.goToApp').attr('href', 'jsmp://page=9?pid=' + scope.product.id + '&ptype=' + scope.product.type + '&atid=1');
                })
            };
        })
        .filter('prizeStatus', function () {
            return function (code) {
                var map = {
                    0: '未开奖',
                    1: '未中奖',
                    2: '已中奖'
                };
                if (code >= 0 && map[code]) { return map[code] };
                return '无数据';
            }
        })
        .filter('phonesub', function () {
            return function (str, str2) {
                return str ? str.substring(0, 3) + str2 + str.substring(7) : '';
            }
        })
        .filter('percent', function () {
            return function (str) {
                var r = /^[1-9]?[0-9]*\.[1-9]*$/;
                var t = r.test(str);
                if (str < 1) {
                    return str * 10 + "‰";
                } else {
                    if (!t) {
                        str = parseInt(str);
                    }
                    return str + "%";
                }
            }
        })
        .filter('currency2', function () {
            return function (str) {
                if (str) {
                    str += "";
                    if (str.indexOf('.') != -1 && str.length - 1 - str.indexOf('.') > 2) {
                        str = str.toFixed(2);
                    } else if (str.indexOf('.') != -1 && str.length - 1 - str.indexOf('.') < 2) {
                        str += "0";
                    } else if (str.indexOf('.') == -1) {
                        str += ".00";
                    }
                    return str;
                } else {
                    return "-";
                }
            }
        })
        .filter('stringsub', function () {
            return function (str, num) {
                if (str) {
                    var len = 0, str2 = "";
                    for (var i = 0; i < str.length; i++) {
                        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                            len += 2;
                        } else {
                            len++;
                        }
                        if (len > num) {
                            str2 = str.substring(0, i - 1) + "...";
                            break;
                        } else {
                            str2 = str;
                        }
                    }
                    return str2;
                } else {
                    return "";
                }
            }
        })
        .filter('asHtml', function ($sce) {
            return function (data) {
                return $sce.trustAsHtml(data);
            }
        })
        .filter('getdate', function () {
            return function (date, i) {
                return new Date(new Date(date).getTime() + (86400000 * i));
            }
        })
        .filter('serverCenter', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/server-dialog.html',
                    className: 'recharge-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    showClose: false,
                });
            };
        })
        .filter('reminder', function (ngDialog, $filter) {
            return function (msg) {
                var error = {
                    1001: "敬请期待",
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })
        .filter('wechatReminder', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/wechat-dialog.html',
                    className: 'recharge-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    showClose: false,
                });
            };
        })
        .filter('invest-coupon-dialog', function (ngDialog) {
            return function (scope) {
                scope.closeDialog = function (bool) {
                    scope.isSubmit = false;
                    ngDialog.closeAll();
                };
                ngDialog.open({
                    template: '../../template/dialog/invest-coupon-dialog.html',
                    className: 'recharge-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: true,
                    showClose: false,
                });
            };
        })
        /*活动-errorCode*/
        .filter('活动信息', function (ngDialog, $filter) {
            return function (code, scope, YorN) {
                var error = {
                    1001: "活动尚未开始，请耐心等待",
                    1002: "活动已结束"
                };
                scope.msg = {};
                scope.msg.text = error[code];

                if (YorN == 'y') {
                    scope.msg = {};
                    //scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '通知：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('nameformat', function () {
            return function (name) {
                if (name.length === 2) {
                    return name.substring(0, 1) + '*'
                } else if (name.length > 2) {
                    return name.substring(0, 1) + '*' + name.substring(name.length - 1)
                } else {
                    return name
                }
            }
        })
        .filter('protocolFilter', function () {
            return function () {
                return window.location.protocol
            }
        })
        .filter('微信邀请分享-渠道', function () {
            return function (linkstr) {
                setTimeout(function () {
                    var urlstr = window.location.href;
                    if (urlstr === 'https://wap.huiyuanjinfu.com' || urlstr === 'https://wap.huiyuanjinfu.com/') {
                        urlstr = 'https://wap.huiyuanjinfu.com/main/home'
                    }
                    $.ajax({
                        url: '/product/signWeChat.dos',
                        type: 'post',
                        data: { url: urlstr, version: '2.0.0', channel: '3' },
                        success: function (data) {
                            if (data.success) {
                                wx.config({
                                    debug: false,
                                    appId: data.map.appid,
                                    timestamp: data.map.timestamp,
                                    nonceStr: data.map.noncestr,
                                    signature: data.map.sign,
                                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                                });
                                wx.ready(function () {
                                    wx.onMenuShareTimeline({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/zhuomireg?wap=true&' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/invite.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                    wx.onMenuShareAppMessage({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/zhuomireg?wap=true&' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/invite.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                    wx.onMenuShareQQ({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/zhuomireg?wap=true&' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/invite.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                    wx.onMenuShareWeibo({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/zhuomireg?wap=true&' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/invite.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                    wx.onMenuShareQZone({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/zhuomireg?wap=true&' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/invite.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                })
                            };
                        }
                    });
                })
            }
        })
        .filter('微信邀请分享-邀请', function () {
            return function (linkstr) {
                setTimeout(function () {
                    var urlstr = window.location.href;
                    if (urlstr === 'https://wap.huiyuanjinfu.com' || urlstr === 'https://wap.huiyuanjinfu.com/') {
                        urlstr = 'https://wap.huiyuanjinfu.com/main/home'
                    }
                    $.ajax({
                        url: '/product/signWeChat.dos',
                        type: 'post',
                        data: { url: urlstr, version: '2.0.0', channel: '3' },
                        success: function (data) {
                            if (data.success) {
                                wx.config({
                                    debug: false,
                                    appId: data.map.appid,
                                    timestamp: data.map.timestamp,
                                    nonceStr: data.map.noncestr,
                                    signature: data.map.sign,
                                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
                                });
                                wx.ready(function () {
                                    wx.onMenuShareTimeline({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/inviteReg?' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                    wx.onMenuShareAppMessage({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/inviteReg?' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                    wx.onMenuShareQQ({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/inviteReg?' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                    wx.onMenuShareWeibo({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/inviteReg?' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                    wx.onMenuShareQZone({
                                        title: '啄米理财，国企背景',
                                        desc: '注册就送618红包+99999体验金', // 分享描述
                                        link: 'https://wap.huiyuanjinfu.com/inviteReg?' + linkstr, // 分享链接
                                        imgUrl: 'https://wap.huiyuanjinfu.com/images/wechat-share/inviteReg.png', // 分享图标
                                        success: function () {
                                            alert('分享成功！');
                                        },
                                        cancel: function () {
                                            alert('您取消了分享！');
                                        }
                                    });
                                })
                            };
                        }
                    });
                })

            }
        })
});