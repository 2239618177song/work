/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/Component/Tips.css';

class LRTips extends BaseComponent{
    constructor(){
        super();
        this.state = {
            show:false,
            text:'',
            btns:[],
            callbacks:[]
        }
    }

    Alert(msg,data){
        this.setMyState(data);
    }

    Confirm(msg,data){
        this.setMyState(data);
    }

    Close(msg,data){
        this.setMyState({
            show:false
        })
    }

    componentDidMount(){
        this.PubSub.subscribe('ALERT',this.Alert.bind(this));
        this.PubSub.subscribe('COMFIRM',this.Confirm.bind(this));
        this.PubSub.subscribe('CLOSE',this.Close.bind(this));
    }

    render(){
        const btnList = [];
            this.state.btns.map((v,i)=>{
                const clazz = this.state.btns.length === 1 ? 'doneBtn' : 'doneBtn half';
                btnList.push(<a key={i} className={clazz} onClick={(e)=>{this.setState({show:false});this.state.callbacks[i] &&　this.state.callbacks[i]();}}>{v}</a>)
                return true;
            });
        return (
            <div className={this.state.show ? '__tips_mask show' : '__tips_mask'}>
                <div className="__tips scaleIn">
                    <div className="__content">
                        {this.state.text}
                    </div>
                    <div className="__btm">
                        {btnList}
                    </div>
                </div>
            </div>
        )
    }
}

export default LRTips;