/**
 * Created by xhy on 17/7/13.
 */
/**
 * 账户设置
 */
import React from 'react';
import BaseComponent from '../../../core/BaseComponent';
import {Link} from 'react-router';

import Title from '../../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../../Component/autoFixedBottom/AutoFixedBottom';
import T from '../../../tool/tool';
import config from '../../../tool/config';

class Index extends BaseComponent{
    constructor(){
        super();

        //this.state = this.getUserInfo() || {};
        this.state = {

        }
    }

    /**
     * 从本地获取用户信息
     */
    getUserInfo(){
        T.ajax({
            url:'getUserInfo',
            load:true
        }).done((data)=>{
           this.setMyState(data);
        });
        //return JSON.parse(localStorage.getItem('LR_USER'));
    }

    componentDidMount(){
        this.getUserInfo();
    }


    /**
     * 授权
     */
    setPayPassword = ()=>{
        let isRealNameState = this.state.realNameState*1;

        if(isRealNameState === 1){
            T.ajax({
                url:'setPayPassword',
                method:'post'
            }).done((result)=>{
                window.location.href = decodeURIComponent(result);
            })
        }else{
            T.showToast('您需要实名认证后才可以进行授权操作');
            setTimeout(()=>{
                T.forward('/setting/realName') ;
            },1000);
        }
    };

    /**
     * 登出
     */
    logout = ()=>{
        T.ajax({
            url:'logout'
        }).done((data)=>{
            this.forward('/user/login');
        });
    };

    render(){
        let userInfo = this.state;
        return (
            <div className="_a_settingSec">
                <Title title={'账户设置'}/>
                <div className="op_list">
                    <Link className="l_item" to={userInfo.realNameState*1 === 1 ? "/setting/index" : "/setting/realName"}>
                        <div className="title">
                            <span className="icon icon-smrz"></span>
                            实名认证
                        </div>
                        <div className="description">
                            <span className="main_color">{userInfo.realNameState*1 === 1 ? userInfo.realName : '未认证'}</span>
                        </div>
                        {userInfo.isRealNameState*1 !== 1 &&  <div className="arrow"></div>}
                    </Link>
                </div>

                <div className="op_list">
                    <Link className="l_item" to="/setting/bindMobile">
                        <div className="title">
                            <span className="icon icon-bdsj"></span>
                            绑定手机
                        </div>
                        <div className="description">
                            <span className="main_color">{userInfo.mobile}</span>
                        </div>
                        <div className="arrow"></div>
                    </Link>
                    <Link className="l_item">
                        <div className="title">
                            <span className="icon icon-yxrz"></span>
                            邮箱认证
                        </div>
                        <div className="description">
                            <span className="main_color">{userInfo.emailState*1 === 1 ? userInfo.email : '未认证'}</span>
                        </div>
                    </Link>
	                    <Link className="l_item" to={userInfo.isPayPassword == 1 ? '/setting/payPwd/set' : '/setting/payPwd/reset'}>
	                        <div className="title">
	                        	<span className="icon icon-sqtz"></span>
	                            支付密码
	                        </div>
	                        <div className="description">
	                            <span className="main_blue">{userInfo.isPayPassword == 1 ? '设置' : '修改'}</span>
	                        </div>
	                        <div className="arrow"></div>
	                    </Link>
						
	                    {/*<Link className="l_item" to="/setting/resetPwd">
	                        <div className="title">
	                            重置密码
	                        </div>
	                        <div className="arrow"></div>
	                    </Link>*/}
                </div>

                <div className="op_list">
                    <Link className="l_item" href={config.activityIp+'/inviteFriends'}>
                        <div className="title">
                            <span className="icon icon-yqhy"></span>
                            邀请好友
                        </div>
                        <div className="arrow"></div>
                    </Link>
                </div>

                <div className="op_list">
                    <Link className="l_item" to="/setting/help/index">
                        <div className="title">
                            <span className="icon icon-bzzx"></span>
                            帮助中心
                        </div>
                        <div className="arrow"></div>
                    </Link>
                    {/*<Link className="l_item" to="/setting/version">
                        <div className="title">
                            <span className="icon icon-bbxx"></span>
                            版本信息
                        </div>
                        <div className="arrow"></div>
                    </Link>*/}
                </div>

                <div className="op_list">
                    <Link className="l_item" to="/setting/address">
                        <div className="title">
                            <span className="icon icon-shdz"></span>
                            收货地址
                        </div>
                        <div className="arrow"></div>
                    </Link>
                    {/*<Link className="l_item" to="/setting/address">
                        <div className="title">
                            <span className="icon icon-shdz"></span>
                            重置密码
                        </div>
                        <div className="arrow"></div>
                    </Link>*/}
                </div>

                <div className="op_list">
                    <Link className="l_item" to="/info/aboutUs">
                        <div className="title">
                            <span className="icon icon-gywm"></span>
                            关于我们
                        </div>
                        <div className="arrow"></div>
                    </Link>
                </div>


                <AutoFixedBottom>
                    <div className="btn_area">
                        <a className="btn" onClick={this.logout}>退出登录</a>
                    </div>
                </AutoFixedBottom>
            </div>
        )
    }
}

export default Index;