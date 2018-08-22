/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import jsMerge from './merge';
import config from './config';
import PubSub from 'pubsub-js';
import { browserHistory } from 'react-router';
import Tween from './Tween';


class Tool{
    /**
     * 构造函数
     */
    constructor(){

    }

    /**
     * 事件订阅对象
     */
    PubSub = PubSub;

    /**
     * 敏感字段加密函数
     * @param plainText
     * @returns {string}
     */
    encrypt(plainText){
        const public_key = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgNg+zMcVL5Slgc45EfrfmsiGVZMMj08nsDmoeIgV2e/+iYZu2IF6bAla5QElu+2ZEOKabyZCCavYBAVu4uWkG+WYrfjOYmjg8ePJ32vVHNld5c/9VDz4RetSw+23RVTYU+hkgRAjqgwdp/C44U7eZb30YlAvIHIe9+/ndunnD/wIDAQAB';
        var encrypt = new window.JSEncrypt();//使用了全局对象,不得已而为之，实在找不到支持es6的非对称加密插件
        encrypt.setPublicKey(public_key);
        return encrypt.encrypt(plainText);
    }

    /**
     * ajax方法(需要配合handleData使用,相对不太方便)
     * @param opt 请求相关参数
     * @returns {Tool.Ajax}
     * @constructor
     */
    Ajax = (opt)=>{
        return new Ajax(opt);
    };

    queryList = {};

    /**
     * 简便的ajax函数(封装较为完善，与jquery的ajax调用方式相近，用起来较为方便)
     * @param opt
     * @returns {{promise: Ajax, done: (function()), fail: (function())}}
     */
    ajax = (opt)=>{
        if(opt.load){
            this.showLoading();
        }

        let _beforeSend = opt.beforeSend || (()=>{});

        /*处理重复提交的逻辑 start*/
        opt.beforeSend = (jqXHR)=>{
            if(opt.unique || (opt.method && opt.method.toLowerCase() == 'post')){//如果是需要处理重复提交的或者post请求
                if ( this.queryList[ jqXHR.url ] ) {
                    jqXHR._cancel();
                }else{
                    this.queryList[jqXHR.url] = jqXHR;
                }
            }

            _beforeSend(jqXHR);
        };

        opt.error = (jqXHR)=>{
            delete this.queryList[jqXHR.url];
            //console.log(jqXHR.url);
        };

        opt.success = (jqXHR)=>{
            delete this.queryList[jqXHR.url];
            //console.log(jqXHR);
        };
        /*处理重复提交的逻辑 end*/

        let promise = new Ajax(opt);

        let obj = {
            promise,
            done:(callback,errCallback,needLoginCallback)=>{
                obj.promise.then((data)=>{
                    this.hideLoading();
                    if(data.accessToken ){//如果过期了，那就重新设置
                        localStorage.setItem('LR_ACCESSTOKEN',data.accessToken);
                    }
                    if(data.code*1 === 0){//正常的code
                        callback(data.result);
                    }else if(data.code*1 === -100 || data.code*1 === -101 || data.code*1 === -102 || data.code*1 === -103){//表示需要登录了
                        needLoginCallback ? needLoginCallback(data.result) : this.noop();
                        //this.Alert('请先登录',()=>{
                        this.clearUserInfo();//清掉所有的用户相关信息
                        if(window.location.href.indexOf('/user/login') == -1){//如果已经在登录页面了,那就不继续跳转了
                            let redirectUrl = window.location.origin+window.location.pathname;
                            window.location.href = '/user/login?ifJump=true&redirectTo='+redirectUrl;
                        }

                        /*let redirectUrl = window.location.origin+window.location.pathname;
                        setTimeout(()=>{
                            this.forward('/user/login?ifJump=true&redirectTo='+redirectUrl+'');
                        },100);*/

                        //});
                    }
                    else{//弹出后台返回的错误信息
                        this.showToast(data.errmsg);
                        errCallback ? errCallback(data) : this.noop()
                    }
                });
                return obj;
            },
            fail:(errCallback)=>{
                obj.promise.then(this.noop,(data)=>{
                    this.hideLoading();
                    errCallback ? errCallback(data) : this.noop()
                });
                return obj;
            }
        };

        return obj;
    };

    /**
     * 深度拷贝和深度合并合并对象
     * @type {deepAssign}
     */
    merge = jsMerge;

    /**
     * 获取search参数
     * @param name
     * @returns {*}
     */
    getQueryField = (name) => {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return null;
    };



    /**
     * 處理返回正常數據域
     * @param data 後臺數據
     * @param callback 正常迴調函數
     * @param errCallback 報錯回調函數
     * @param needLoginCallback 需要登錄回調函數
     */
    handleData(data,callback,errCallback,needLoginCallback){
        if(data.code*1 === 0){//正常的code
            callback(data.result);
        }else if(data.code*1 === -101 || data.code*1 === -102){//需要登錄
            needLoginCallback ? needLoginCallback(data.result) : '';
        }else{//後臺返回的錯誤信息
            errCallback ? errCallback(data.errmsg) : '';
        }
    }

    /**
     * 空函数
     */
    noop(){

    }

    /**
     * 清除所有用户信息
     */
    clearUserInfo(){
        localStorage.removeItem('_userCache');
        localStorage.removeItem('LR_ACCESSTOKEN');
        localStorage.removeItem('LR_APIUID');
    }

    /**
     * 判断是否登录
     * @param callback
     * @param trueCallback
     */
    checkLogin(callback = this.noop,trueCallback = this.noop){
        this.Ajax({
            url:'checkLogin'
        }).then((data)=>{
            this.handleData(data,(result) => {
                if(result*1 === 0){
                    callback();
                }else{
                    trueCallback();
                }
            })
        });
    }

    /**
     * 判断是否实名认证
     * @param callback
     * @param trueCallback
     */
    checkRealname(callback,trueCallback){
        this.ajax({
            url:'getUserInfo',
            load:true,
            unique:true
        }).done(({realNameState})=>{
            if(realNameState != 1){//已认证
                callback && callback();
            }else{
                trueCallback && trueCallback();
            }
        });
    }

    /**
     * 获取元素的类列表
     * @param $item
     * @returns {Array}
     */
    getClassList($item){
        return $item.className.split(/\s+/);
    }

    /**
     * 判断是否拥有某个类
     * @param $item
     * @param className
     * @returns {boolean}
     */
    hasClass($item,className){
        const classList = this.getClassList($item);
        return classList.indexOf(className) !== -1;
    }

    /**
     * 为元素增加类
     * @param $item
     * @param className
     * @returns {*}
     */
    addClass($item,className){
        const classList = this.getClassList($item);
        classList.push(className);
        $item.className = classList.join(' ');
        return $item;
    }

    /**
     * 为元素移除某个类
     * @param $item
     * @param className
     * @returns {*}
     */
    removeClass($item,className){
        const classList = this.getClassList($item).join(' ');
        $item.className = classList.replace(className,'');
        return $item;
    }

    /**
     * 路由跳转控制
     * @param url 要跳转的路劲
     */
    forward(url){
        browserHistory.push(url);
    }

    /**
     * 提示框
     * @param text 提示文本
     * @param btn 按钮文本
     * @param callback 按钮回调函数
     * @constructor
     */
    Alert(text='',btn='确定',callback=function(){}){
        const data = {
            show:true,
            text:text,
            btns:[],
            callbacks:[]
        };

        //兼容两个形参或三个形参的情况
        if(typeof btn === 'function'){
            data['btns'] = ['确定'];
            data['callbacks'] = [btn];
        }else{
            data['btns'] = [btn];
            data['callbacks'] =[callback];
        }
        setTimeout(()=>{
            this.PubSub.publish('ALERT',data)
        });
    }

    /**
     * 询问框
     * @param text 文案
     * @param btn 按钮文案数组
     * @param callbacks 回调函数数组
     * @constructor
     */
    Confirm(text='',btn=['确定','取消'],callbacks=[function(){},function(){}]){
        const data = {
            show:true,
            text:text,
            btns:btn,
            callbacks:callbacks
        };

        //兼容两个形参或三个形参的情况
        if(typeof btn[0] === 'function'){
            data['btns'] = ['确定','取消'];
            data['callbacks'] = btn;
        }else{
            data['btns'] = btn;
            data['callbacks'] =callbacks;
        }
        setTimeout(()=>{
            this.PubSub.publish('COMFIRM',data)
        });
    }

    /**
     * 加载中函数
     */
    showLoading = ()=>{
        setTimeout(()=> {
            this.PubSub.publish('LOADING', {});
        });
    };

    /**
     * 隐藏加载中
     */
    hideLoading = ()=>{
        setTimeout(()=> {
            this.PubSub.publish('CLOSE_LOADING', {});
        });
    };

    /**
     * 吐司提示
     * @param text
     */
    showToast = (text)=>{
        setTimeout(()=> {
            this.PubSub.publish('TOAST', {text: text});
        });
    };

    parse_date = ( second_time )=>{
        var time = {
            day:'0',
            hour:'0',
            minute:'0',
            second:parseInt(second_time)
        };
        if( parseInt(second_time )> 60){

            var second = parseInt(second_time) % 60;
            var min = parseInt(second_time / 60);
            time = {
                day:'0',
                hour:'0',
                minute:min,
                second:second
            };

            if( min > 60 ){
                min = parseInt(second_time / 60) % 60;
                var hour = parseInt( parseInt(second_time / 60) /60 );
                time = {
                    day:'0',
                    hour:hour,
                    minute:min,
                    second:second
                };

                if( hour > 24 ){
                    hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
                    var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
                    time = {
                        day:day,
                        hour:hour,
                        minute:min,
                        second:second
                    };
                }
            }


        }

        return time;
    };


    /**
     * 获取用户设置状态
     */
    getUserSettingInfo(){
        let userInfo = localStorage.getItem('LR_USER');
        if(!userInfo){
            this.forward('/user/login');
            return;
        }

        return JSON.parse(userInfo);
    }

    /**
     * 设置用户设置状态
     */
    setUserSettingInfo(data){
        //debugger;
        let userInfo = this.getUserSettingInfo();
        Object.keys(data).map((key)=>{
            userInfo[key] = data[key];
        });
        localStorage.setItem('LR_USER',JSON.stringify(userInfo));
    }

    /**
     * 动画函数
     * @param opt
     */
    animate = (opt) =>{
        let d_opt = {
            pri: 0,
            end: 0,
            duration: 300,
            timeFunc: 'Linear',
            callback: ()=>{},
            endCallback: ()=>{}
        };

        let flag;

        /**
         * 获取时间曲线函数
         * @param string
         * @returns {*}
         */
        let getTimeFunc = (string)=>{
            let arr = string.split('.');
            let obj = Tween;
            arr.map((v)=>{
                obj = obj[v];
            });
            if(!obj){
                console.error('该时间曲线不存在');
                return Tween.Linear;
            }

            return obj;
        };

        opt = this.merge({},d_opt,opt);
        opt.timeFunc = getTimeFunc(opt.timeFunc);

        let cTime = 0;
        let start  = ()=>{
            //console.log('动画进行中....');
            var cValue = opt.timeFunc(cTime,opt.pri,opt.end*1-opt.pri,opt.duration);
            if(cTime < opt.duration){
                cTime+=16;
                flag = requestAnimationFrame(start);
                opt.callback(cValue);
            }else{
                opt.callback(opt.end);
                opt.endCallback(opt.end);
                //console.log('------动画结束------');
            }

        };

        /**
         * 开始
         */
        let begin = ()=>{
            //requestAnimationFrame(start);
            if (!flag) {
                start();
            }
        };


        let stop = ()=>{
            if (flag) {
                window.cancelAnimationFrame(flag);
                flag = undefined;
            }
        };

        begin();


        return {
            stop:stop,
            begin:begin
        }

    }


}



/*需要加密的字段*/
const encryptMapper = [
    "mobile", "password", "realName", "identifyCard", "userName",
    "payPassword", "newPayPassword", "cardNo"
];

/*ajax函数*/
class Ajax{
    constructor(opts){
        this.T = new Tool();
        const _opt = {
            url:'',
            method:'GET',
            data:{
                accessToken:localStorage.getItem('LR_ACCESSTOKEN') || '',
                apiUid:localStorage.getItem('LR_APIUID') || '',
                OS:config.OS,
                version:config.version
            },
            needParse:true,
            beforeSend:()=>{},
            async:true,
            cache:false,
            load:false,//是否需要加载中样式
            contentType:'application/x-www-form-urlencoded',
            error:()=>{},
            success:()=>{}
        };

        opts = this.T.merge({},_opt,opts);//合并并且加上公用參數

        //加密一些敏感信息(可能需要加密)
         for(var i in opts.data){
             if(encryptMapper.indexOf(i) !== -1 && opts.data.hasOwnProperty(i)){
                 opts.data[i] = this.T.encrypt(opts.data[i]).replace(/\s/g,'');
             }
         }
        var versionPath = opts.data.version;

        opts.url = config.ip+'/AppApi/v'+versionPath+'/'+opts.url;

        this.opts = opts;

        return new Promise((resolve,reject) => {
            this.initAjax(resolve,reject);
        });
    }

    getSearch() {
        var search = '?';
        //console.log(this.opts.data);
        if(typeof this.opts.data === 'object'){//如果需要传递额外参数
            var args = [];
            for(var key in this.opts.data){
                args.push(key+'='+this.opts.data[key]);
            }
            search += args.join('&');
        }else{
            search += '';
        }

        if(!this.opts.cache){
            search += '&rd='+(+new Date());
        }
        if(search.length === 1){
            search = '';
        }

        return search;
    }

    initAjax(success,error) {
        var xhr =new XMLHttpRequest();
        xhr.url = this.opts.url;
        xhr._NEEDSEND = true;
        xhr._cancel = function(){
            this._NEEDSEND = false;
        };

        this.opts.beforeSend(xhr);//客户端beforeSend回调函数
        if(!xhr._NEEDSEND){
            return;
        }

        if(this.opts.method.toUpperCase() == 'GET'){
            xhr.open('GET',this.opts.url+this.getSearch(),this.opts.async);
            xhr.send(null);
        }else{
            xhr.open('POST',this.opts.url,this.opts.async);
            xhr.setRequestHeader("Content-type", this.opts.contentType);
            xhr.send(this.getSearch().slice(1));
        }


        xhr.onerror = ()=>{
            error(xhr);
            this.opts.error(xhr);
            this.T.showToast('网络错误，请重试~');
        };

        xhr.onreadystatechange = ()=>{
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    this.opts.success(xhr);
                    var data = this.opts.needParse ? xhr.responseText : xhr.response;
                    this.opts.needParse && (data = JSON.parse(data));
                    success(data,xhr);
                }
            }
        };

        return xhr;
    }
}

export default new Tool();