/**
 * Created by xhy on 17/7/13.
 */
/**
 * 授权/快捷投资
 */
import React from 'react';
import BaseComponent from '../../../core/BaseComponent';
import {Link} from 'react-router';

import Title from '../../../Component/titleBar/TitleBar';

class Index extends BaseComponent{
    render(){
        return (
            <div className="_a_settingSec">
                <Title title={'授权投资'}/>

                <div className="op_list">
                    <Link className="l_item" to="/setting/auth/find">
                        <div className="title">
                            找回支付密码
                        </div>
                        <div className="arrow"></div>
                    </Link>
                </div>

                <div className="op_list">
                    <Link className="l_item" to="/setting/auth/reset">
                        <div className="title">
                            修改支付密码
                        </div>
                        <div className="arrow"></div>
                    </Link>
                </div>

                <div className="op_list">
                    <Link className="l_item" to="/setting/auth/set">
                        <div className="title">
                            设置支付密码
                        </div>
                        <div className="arrow"></div>
                    </Link>
                </div>

            </div>
        )
    }
}

export default Index;