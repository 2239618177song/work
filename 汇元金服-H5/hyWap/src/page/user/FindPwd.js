/**
 * Created by xhy on 17/7/13.
 */
/**
 * 找回密码
 */
import React from 'react';
import BaseForm from '../../Component/form/Form';
import {Link} from 'react-router';

import Title from '../../Component/titleBar/TitleBar';
import T from '../../tool/tool';
import AutoFixedBottom from '../../Component/autoFixedBottom/AutoFixedBottom';

class FindPwd extends BaseForm{

    constructor(){
        super();
        this.state = {
            form:{
                mobile:'',
                imgVCodeInput:'',
                vCode:'',
                password:''
            },
            openPassword:false

        };

        this.valid = {
            mobile:{
                required:true,
                emptyText:'手机号码不能为空',
                valid:/^1[3-8]\d{9}$/,
                invalidText:'手机号码格式有误'
            },
            imgVCodeInput:{
                required:true,
                emptyText:'图形验证码不能为空',
                valid:'',
                invalidText:''
            },
            vCode:{
                required:true,
                emptyText:'手机验证码不能为空',
                valid:'',
                invalidText:''
            },
            password:{
                required:true,
                emptyText:'密码不能为空',
                valid:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)[^\s]{6,18}$/,
                invalidText:'密码格式有误'
            }
        };

    }

    /**
     * 发送验证码回调函数
     * @param e
     */
    sendVCode(e){
        const $btn = e.target;
        this.handleSendVCode($btn,{
            $input:this.refs.mobile,//手机号码
            $vcode:this.refs.imgVCodeInput,//图形验证码框
            $imgVcode:this.refs.imgVCode,//图形验证码
            url:'sendMobileVCode',
            delay:120,
            keyName:'mobile',
            extraArgs:{
                token:this.TOKEN,
                type:2
            },
            successCallback:T.noop,//操作成功以后的回调
            timeoutCallback:T.noop//超时未处理以后需要重新发送的回调
        });
    }


    handleSubmit = (e) => {
        const $btn = e.target;

        //字段前端验证
        const validInputs = Object.keys(this.valid);

        for(let i = 0,length = validInputs.length;i < length;i++){
            const value = this.state.form[validInputs[i]];
            const validObj = this.valid[validInputs[i]];
            if(!this.validate(value,validObj))return;
        }

        T.addClass($btn,'disabled');

        T.ajax({
            method:'post',
            url:'forgetPsw',
            data:this.state.form
        }).done((data)=>{
            T.Alert('密码重置成功！','去登录',()=>{
                this.forward('/user/login');
            });
            T.removeClass($btn,'disabled');
        },()=>{
            T.removeClass($btn,'disabled');
        }).fail(()=>{
            T.removeClass($btn,'disabled');
        });
    };

    togglePassword = ()=>{
        console.log(this.state);
        let {openPassword} = this.state;
        this.setMyState({
            openPassword:!openPassword
        })
    };

    componentDidMount(){
        document.body.style.backgroundColor='#fff';
        //初始化验证码发送
        this.initImgVCode(this.refs.imgVCode,{
            token:this.TOKEN
        });
    }

    componentWillUnmount(){
        document.body.style.backgroundColor='#f8f8f8';
    }

    render(){
        return (
            <div className="_findPswSec">
                <Title title={'找回密码'}/>
                <div className="user_form" style={{padding:'0 0.4rem',marginTop:'0.2rem'}}>
                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-mobile"></span>
                        </div>
                        <div className="input">
                            <input type="number"
                                   name="mobile"
                                   placeholder="请输入您的手机号"
                                   pattern="[0-9]*"
                                   onChange={this.handleInputChange.bind(this)}
                                   value={this.state.form.mobile}
                                   ref="mobile"
                                   maxLength="11"/>
                        </div>
                    </div>

                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-vCode"></span>
                        </div>
                        <div className="input">
                            <input type="text"
                                   name="imgVCodeInput"
                                   placeholder="图形验证码"
                                   maxLength="4"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.imgVCodeInput}
                                   ref="imgVCodeInput"/>
                        </div>
                        <a className="v_img">
                            <img src="" alt="" ref="imgVCode" onClick={this.handleChangeImgVCode.bind(this)}/>
                        </a>
                    </div>

                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-mvCode"></span>
                        </div>
                        <div className="input">
                            <input type="number"
                                   name="vCode"
                                   placeholder="请输入验证码"
                                   pattern="[0-9]*"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.vCode}
                                   maxLength="4"
                                />
                        </div>
                        <a className="v_btn" onClick={this.sendVCode.bind(this)}>
                            发送验证码
                        </a>
                    </div>

                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-pwd"></span>
                        </div>
                        <div className="input">
                            <input type={this.state.openPassword ? 'text' : 'password'}
                                   name="password"
                                   placeholder="密码8-20个字符，区分大小写"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.password}
                                   maxLength="20"/>
                        </div>
                        <a className={'v_toggle '+(this.state.openPassword ? 'open' : 'close')}
                            onClick={this.togglePassword.bind(this)}></a>
                    </div>
                </div>
                <div className="btn_area">
                    <a className="btn" onClick={this.handleSubmit.bind(this)}>确定</a>
                </div>

            </div>
        )
    }
}

export default FindPwd;