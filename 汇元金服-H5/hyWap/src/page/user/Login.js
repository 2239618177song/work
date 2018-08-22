/**
 * Created by xhy on 17/7/13.
 */
/**
 * 登录
 */
import React from 'react';
import {Link} from 'react-router';
import BaseForm from '../../Component/form/Form';

import Title from '../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../Component/autoFixedBottom/AutoFixedBottom';
import CSCookie from '../../tool/CSCookie';
import T from '../../tool/tool';
import config from '../../tool/config';

class Login extends BaseForm{
    constructor(){
        super();
        this.state = {
            form:{
                mobile:'',
                password:''
            }

        }
    }

    /**
     * 表单验证
     * @type {{mobile: {}}}
     */
    valid = {
        mobile:{
            required:true,
            emptyText:'手机号码不能为空',
            valid:/^1[3-8]\d{9}$/,
            invalidText:'手机号码格式有误'
        },
        password:{
            required:true,
            emptyText:'密码不能为空',
            valid:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)[^\s]{6,18}$/,
            invalidText:'密码格式有误(6-18数字字母组合)'
        }
    };

    /**
     * 表单提交
     * @type {boolean}
     */
    handleSubmit = (e)=>{
        e.preventDefault();

        //字段前端验证
        const validInputs = Object.keys(this.valid);

        for(let i = 0,length = validInputs.length;i < length;i++){
            const value = this.state.form[validInputs[i]];
            const validObj = this.valid[validInputs[i]];
            if(!this.validate(value,validObj))return;
        }

        T.ajax({
            method:'post',
            url:'loginByPassword',
            load:true,
            data:this.state.form
        }).done((result)=>{
            /*写入本地缓存 start*/
            localStorage.setItem('LR_USER',JSON.stringify(result));
            localStorage.setItem('LR_APIUID',result.uid);
            localStorage.setItem('LR_ACCESSTOKEN',result.accessToken);
            /*写入本地缓存 end*/

            /*新的跨域方案 start*/
            let csCookie = new CSCookie(config.activityIp);
            
            csCookie.setItem('LR_ACCESSTOKEN',result.accessToken);
            csCookie.setItem('LR_APIUID',result.uid);
            csCookie.init(()=>{
                let oldUrl;
                if(T.getQueryField('redirectTo') && T.getQueryField('ifJump')){
                    oldUrl = T.getQueryField('redirectTo');
                    window.location.href = oldUrl;
                }else{
                    oldUrl = "/account/index";
                    this.forward(oldUrl);
                }
            });
            /*新的跨域方案 end*/



            //this.back();
        }).fail();
    };
	
	checkIsPC(){
		function IsPC() {
	        var userAgentInfo = navigator.userAgent;
	        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	        var flag = true;
	        for (var v = 0; v < Agents.length; v++) {
	            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
	        }
	        return flag;
	    }
	    if (!IsPC()) {
	        
	    }else{
	    	window.location.href = 'https://www.huiyuanjinfu.com/';
	    }
	}
	
	componentDidMount(){
		this.checkIsPC();
	}
	
	
    render(){
        return (
            <div className="_loginSec">
                <Title transparent={true} title={''}/>
                <div className="banner_logo"></div>
                <div className="user_form form_panel">
                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-mobile"></span>
                        </div>
                        <div className="input">
                            <input type="number"
                                   name="mobile"
                                   placeholder="请输入手机号"
                                   pattern="[0-9]*"
                                   autoComplete="off"
                                   onChange={this.handleInputChange.bind(this)}
                                   value={this.state.form.mobile}
                                   ref="mobile"
                                   maxLength="11"
                                />
                        </div>
                    </div>

                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-pwd"></span>
                        </div>
                        <div className="input">
                            <input type="password"
                                   name="password"
                                   placeholder="请输入密码"
                                   autoComplete="off"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.password}
                                   maxLength="20"
                                />
                        </div>
                    </div>

                    <div className="btn_area">
                        <a className="btn" onClick={this.handleSubmit}>登录</a>
                    </div>
                    <div className="forget">
                        <Link to="/user/findPwd">忘记密码</Link>
                    </div>
                </div>
                <AutoFixedBottom>
                    <div className="bottom_info">
                        还没有账号?现在就去 <Link to="/user/register">免费注册</Link>
                    </div>
                </AutoFixedBottom>

            </div>
        )
    }
}

export default Login;