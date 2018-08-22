/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/

import React,{Component} from 'react';
import { browserHistory } from 'react-router';
import PubSub from 'pubsub-js';

class BaseComponent extends Component{
    /**
     * 判断组件是否尚在其生命周期中
     * @type {boolean}
     */
    alive = true;


    /**
     * 专用setState(处理生命周期失效后的异步请求回调/延时对象回调处理)
     * @param obj
     */
    setMyState = (obj) => {
        if(this.alive){
            this.setState(obj);
        }
    };

    componentWillUnmount(){
        this.alive = false;
    }

    /**
     * 判断是否实名认证
     * @param callback
     * @param trueCallback
     */
    checkRealname(callback,trueCallback){
        var userCache = JSON.parse(localStorage.getItem('LR_USER'));
        var realNameState = userCache ? userCache.isRealNameState*1 : null;
        //debugger;
        if(realNameState != 1){//已认证
            callback && callback();
        }else{
            trueCallback && trueCallback();
        }
    }

    /**
     * 判断是否在app中
     */
    ifApp = (navigator.userAgent.indexOf('LRAPP') !== -1);

    /**
     * 订阅模式对象
     */
    PubSub = PubSub;

    /**
     * 路由控制对象
     */
    history = browserHistory;

    /**
     * 返回
     */
    back(){
        this.history.goBack();
    }

    /**
     * 页面跳转
     * @param url
     */
    forward(url){
        this.history.push(url);
    }

    /**
     * 空函数
     */
    noop = ()=>{};

    /**
     * 加载中函数
     */
    showLoading = ()=>{
        this.PubSub.publish('LOADING',{});
    };

    /**
     * 隐藏加载中
     */
    hideLoading = ()=>{
        this.PubSub.publish('CLOSE_LOADING',{});
    };

    /**
     * 吐司提示
     * @param text
     */
    showToast = (text)=>{
        this.PubSub.publish('TOAST',{text:text});
    };

}

export default BaseComponent;