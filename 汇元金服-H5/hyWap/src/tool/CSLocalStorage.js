/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
/**
 * 跨域localstorage
 */
var CSLocalStorage = function(origin,path){
    this.origin = origin;
    this.path = path || '/localStorageCrossDomain.html';
    this.loaded = false;
    this.iframe = null;
    this.queue = [];
    this.cacheList = {};
}

/**
 * 操作类型
 * @type {Object}
 */
var ENUM = {
    WRITE:'WRITE',
    READ:'READ',
    DELETE:'DELETE',
    CLEAR:'CLEAR'
}

/**
 * 回调缓存对象id
 * @type {Number}
 */
var uniqueId = 0;

/**
 * 原型
 * @type {Function}
 */
CSLocalStorage.fn = CSLocalStorage.prototype;

CSLocalStorage.fn.contructor = CSLocalStorage;

/**
 * 初始化函数
 * @return {[type]} [description]
 */
CSLocalStorage.fn.init = function(callback){
    this.createIframe().bindEvent(callback);
    return this;
}

/**
 * 绑定事件
 * @return {[type]} [description]
 */
CSLocalStorage.fn.bindEvent = function(callback){
    var self = this;
    this.iframe.addEventListener('load',function(event){self._loadedCallabck(event);callback && callback()},false);
    window.addEventListener('message',function(event){self._receiveMessage(event)},false);
}
/**
 * 构建iframe
 * @return {[type]} [description]
 */
CSLocalStorage.fn.createIframe = function(){
    this.iframe = document.createElement('iframe');
    this.iframe.style.cssText = 'position:absoulte;left:-1px;width:1px;height:1px;opacity:0;';
    this.iframe.src = this.origin+this.path;

    document.body.appendChild(this.iframe);


    return this;
}

/**
 * iframe加载完成函数
 * @return {[type]} [description]
 */
CSLocalStorage.fn._loadedCallabck = function(event){
    var self = this;
    this.loaded = true;
    //循环阻塞队列
    this.queue.map(function(item){
        self.sendMessage(item);
    });

    //清空阻塞队列
    this.queue.length = 0;
}

/**
 * 监听消息事件
 * @param  {[type]} event [description]
 * @return {[type]}      [description]
 */
CSLocalStorage.fn._receiveMessage = function(event){
    if(event.origin == this.origin){//确认是否是目标域发来的请求
        var data = JSON.parse(event.data);
        //debugger;
        this.cacheList[data.id] && this.cacheList[data.id](data.key,data.value);
        delete this.cacheList[data.id];
    }
    return this;
}

/**
 * 发送消息
 * @param  {[Object]} data [消息]
 */
CSLocalStorage.fn.sendMessage = function(data){
    if(!this.iframe){//如果没有构建iframe
        this.init();
    }

    if(!this.loaded){//如果加载未完成,进入阻塞队列
        this.queue.push(data);
        return;
    }

    //var contentWindow = this.iframe.contentWindow;
    data.id = ++uniqueId;//id自增
    //debugger;
    this.cacheList[data.id] = data.callback || function(){};
    this.iframe.contentWindow.postMessage(JSON.stringify(data),this.origin);

    return this;

}

/**
 * 仿原生setItem
 * @param {[String]} key   [键名]
 * @param {[String]} value [键值]
 * @param {[Function]} value [回调函数]
 */
CSLocalStorage.fn.setItem = function(key,value,callback){
    this.sendMessage({
        key:key,
        value:value,
        type:ENUM.WRITE,
        callback:callback
    });
    return this;
};

/**
 * 仿原生getItem
 * @param {[String]} key   [键名]
 * @param {[Function]} value [回调函数]
 */
CSLocalStorage.fn.getItem = function(key,callback){
    this.sendMessage({
        key:key,
        type:ENUM.READ,
        callback:callback
    });
    return this;
};


/**
 * 仿原生removeItem
 * @param {[String]} key   [键名]
 * @param {[Function]} value [回调函数]
 */
CSLocalStorage.fn.removeItem = function(key,callback){
    this.sendMessage({
        key:key,
        type:ENUM.DELETE,
        callback:callback
    });
    return this;
};

/**
 * 仿原生clear
 * @param {[Function]} value [回调函数]
 */
CSLocalStorage.fn.clear = function(callback){
    this.sendMessage({
        type:ENUM.CLEAR,
        callback:callback
    });
    return this;
};

export default CSLocalStorage;