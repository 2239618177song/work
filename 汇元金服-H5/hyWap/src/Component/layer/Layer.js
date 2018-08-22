/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/

/**
 *
 * 各种提示方式
 *
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/Component/Layer.css';

/**
 * 提示组件
 */
class Layer extends BaseComponent{

    constructor(props){
        super(props);
        this.state = {
            showLoading:false,
            toast:{
                show:false,
                text:''
            }
        }
    }


    componentDidMount(){
        this.PubSub.subscribe('LOADING',this.loading.bind(this));
        this.PubSub.subscribe('CLOSE_LOADING',this.closeLoading.bind(this));
        this.PubSub.subscribe('TOAST',this.toast.bind(this));
    }

    /**
     * 加载中函数
     */
    loading(){
        this.setMyState({
            showLoading:true
        })
    }

    /**
     * 关闭加载中
     */
    closeLoading(){
        this.setMyState({
            showLoading:false
        })
    }

    /**
     * 防止吐司提示重复出现（待优化，不是最好的解决方案）
     * @type {boolean}
     */
    toasting = true;

    /**
     * 吐司提示
     */
    toast(msg,data){
        if(!this.toasting)//如果正在显示中
            return;

        this.setMyState({
            toast:{
                show:true,
                text:data.text
            }
        });

        //以下为处理重复出现提示的代码，并非最好的方案，待解决
        this.toasting = false;
        
        setTimeout(()=>{
            this.setMyState({
                toast:{
                    show:false,
                    text:''
                }
            });

            this.toasting = true;
        },3000);
    }

    render(){
        return (
            <div className="HY_layer">
                <Loading show={this.state.showLoading}/>
                <Toast {...this.state.toast}/>
            </div>
        )
    }
}

/**
 * mask组件
 */
class Mask extends BaseComponent{

    static defaultProps = {
        show:false
    };

    render(){
        return (
            <div className="mask" style={{display:this.props.show ? 'block' : 'none'}}>
                {this.props.children}
            </div>
        );
    }
}

/**
 * loading组件
 */
class Loading extends BaseComponent{
    render(){
        return (
            <div className="loadContent" style={{display:this.props.show ? 'block' : 'none'}}>
                <i className="loadImg"/>
                <div className="loadingText">Loading... </div>
            </div>
        );
    }
}

/**
 * toast提示方式
 */
class Toast extends BaseComponent{
    render(){
        return (
            <div className={this.props.show ? "toastContent show" : "toastContent"}>
                {this.props.text}
            </div>
        );
    }
}

export {
    Layer,
    Mask,
    Loading
};