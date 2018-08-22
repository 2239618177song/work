/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React from 'react';
import BaseComponent from '../../core/BaseComponent';


class InfoBase extends BaseComponent{

    constructor(){
        super();
    }

    componentDidMount(){

    }

    render(){
        return(
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default InfoBase;