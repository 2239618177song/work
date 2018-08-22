/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React,{Component} from 'react';
import '../../res/Component/Protocol.css';

class InvestProtocol extends Component{
    constructor(){
        super();
    }

    handleClose = (e)=>{
        this.props.handleCloseProtocol();
    };

    render(){
        return(
            <div className={this.props.show ? 'CN_protocol show':'CN_protocol hide'}>
                <div className="p_title">
                   大汇元投资协议
                    <a href="javascript:;" className="p_close" onClick={this.handleClose}>关闭</a>
                </div>
                <div className="p_wrap" dangerouslySetInnerHTML={{__html:this.props.content}}>
                </div>
            </div>
        )
    }
}

export default InvestProtocol;