/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/

/**
 *
 * 顶部导航栏
 *
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/Component/TitleBar.css';

class Navigator extends BaseComponent{
    static defaultProps = {
        back:true,
        backCallback:null,
        title:'标题页面',
        right:[],
        fixed:true,
        transparent:false
    };

    constructor(props){
        super(props);
        this.state = {
            opacity:props.transparent ? 0 : 1
        }
    }

    height = 50;//顶部高度.暂时先写死,以后做成可配置

    /**
     * 返回按钮点击
     */
    backClick(){
        this.props.backCallback ? this.props.backCallback() : this.history.goBack();
    }

    /**
     * 更改透明度
     */
    changeOpacity = ()=>{
        this.setMyState({
            opacity:document.body.scrollTop/this.height
        })
    };

    /**
     * 绑定滚动条事件
     */
    bindScrollListener = ()=>{
        window.addEventListener('scroll',this.changeOpacity);
    };

    /**
     * 解除滚动条事件
     */
    unbindScrollListener = ()=>{
        window.removeEventListener('scroll',this.changeOpacity);
    };

    componentDidMount(){
        if(this.props.transparent){
            this.bindScrollListener();
        }

    }

    componentWillUnmount(){
        this.unbindScrollListener();
    }


    render(){
        return (
            <div className={this.props.fixed ? "CPT_titleBar fixed" : "CPT_titleBar"}
                 style={{background:this.props.transparent ? 'linear-gradient(45deg,rgba(210,53,47,'+this.state.opacity+'),rgba(230,105,63,'+this.state.opacity+'))' : 'linear-gradient(45deg,rgb(210,53,47),rgb(230,105,63))'}}>
                {this.props.back && <a className="leftArea" onTouchStart={this.backClick.bind(this)}/>}

                {this.props.right.length ? <div className="rightArea">{this.props.right}</div> : ''}
                <div className="titleArea">{this.props.title}</div>
            </div>
        )
    }
}

export default Navigator;