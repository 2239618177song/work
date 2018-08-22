/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React from 'react';
import BaseComponent from '../../../core/BaseComponent';
import '../../../res/css/account/account.css';
import '../../../res/css/account/setting.css';

class AccountBase extends BaseComponent{

    constructor(){
        super();
    }

    componentDidMount(){

    }

    render(){
        return(
            <div className="_accountSec _settingSec">
                <div>{this.props.children}</div>
            </div>
        )
    }
}

export default AccountBase;