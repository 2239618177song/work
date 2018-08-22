/**
 * Created by xhy on 17/7/13.
 */
/**
 * 授权/快捷投资 重置支付密码
 */
import React from 'react';
import BaseComponent from '../../../core/BaseComponent';
import {Link} from 'react-router';

import Title from '../../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../../Component/autoFixedBottom/AutoFixedBottom';

class ResetQuick extends BaseComponent{
    render(){
        return (
            <div className="_a_settingSec">
                <Title title={'修改支付密码'}/>
                <div className="HY_form_item no_border">
                    <div className="label">原支付密码</div>
                    <div className="input">
                        <input type="text" placeholder="请输入原支付密码"/>
                    </div>
                </div>
                <div className="HY_form_item no_border">
                    <div className="label">新支付密码</div>
                    <div className="input">
                        <input type="text" placeholder="请输入6位支付密码"/>
                    </div>
                </div>
                <div className="HY_form_item no_border">
                    <div className="label">确认密码</div>
                    <div className="input">
                        <input type="text" placeholder="请再次支付密码"/>
                    </div>
                </div>
                <AutoFixedBottom>
                    <div className="btn_area">
                        <a className="btn">确认更改</a>
                    </div>
                </AutoFixedBottom>
            </div>
        )
    }
}

export default ResetQuick;