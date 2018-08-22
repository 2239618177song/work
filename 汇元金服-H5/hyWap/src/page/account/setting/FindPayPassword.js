/**
 * Created by xhy on 17/7/13.
 */
/**
 * 找回交易密码
 */
import React from 'react';
import BaseComponent from '../../../core/BaseComponent';
import BaseForm from '../../../Component/form/Form';
import {Link} from 'react-router';


import Title from '../../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../../Component/autoFixedBottom/AutoFixedBottom';
import T from '../../../tool/tool';

class FindPayPwdPage extends BaseComponent{
   
    constructor(){
        let LR_USER = JSON.parse(localStorage.getItem('LR_USER'));
        console.log(LR_USER);
        super();
        this.state = {
            
        }
    }
    render(){

        return (
            <div>
                {
                    <FindPayPwd/> 
                }
            </div>

        )
    }
}


class FindPayPwd extends BaseForm{
    constructor(props){
        super(props);
        this.state = {
            form:{
                mobile:'15000000000',
                mobileVCode:'',
                imgVCodeInput:'',
                password1:'',
                password2:''
            }
        }
    }

    /**
     * 表单验证
     */
    valid = {
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
        mobileVCode:{
            required:true,
            emptyText:'手机验证码不能为空',
            valid:'',
            invalidText:''
        },
        password1:{
            required:true,
            emptyText:'交易密码不能为空',
            valid:/\d{6}/,
            invalidText:'交易密码需要6位数字'
        }
    };


    /**
     * 获取当前的手机号码，遮挡过的
     */
    getCurrentPhone(){
        return JSON.parse(localStorage.getItem('LR_USER')).mobile;
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
                type:'3'
            },
            successCallback:T.noop,//操作成功以后的回调
            timeoutCallback:T.noop//超时未处理以后需要重新发送的回调
        });
    }

    componentDidMount(){
        //初始化验证码发送
        this.initImgVCode(this.refs.imgVCode,{
            token:this.TOKEN
        });

    }

    handleSubmit(e){
        let $btn = e.target;
        let state = this.state.form;
        //字段前端验证
        const validInputs = Object.keys(this.valid);

        for(let i = 0,length = validInputs.length;i < length;i++){
            const value = this.state.form[validInputs[i]];
            const validObj = this.valid[validInputs[i]];
            if(!this.validate(value,validObj))return;
        }
        if(!state.password2){
            T.showToast('请重复交易密码');
            return;
        }
        if(state.password2 != state.password1){
            T.showToast('两次交易密码不相等');
            return;
        }
        T.addClass($btn,'disabled');

        T.ajax({
            url:'resetPayPassword',
            load:true,
            method:'post',
            data:{
                payPassword:state.password1,
                mobileVCode:state.mobileVCode
            },
        }).done((data)=>{
            T.showToast('交易密码重置成功');
            setTimeout(()=>{
                T.forward('/setting/index');
            },500)
            T.removeClass($btn,'disabled');
        },()=>{
            T.removeClass($btn,'disabled');
        }).fail(function(){
            T.removeClass($btn,'disabled');
        });
    }

    render(){
        return(
            <div className="_step label_form_wrap">
                <Title title="找回交易密码"/>
                <div className="HY_form_item no_border">
                    <div className="label">当前手机号</div>
                    <div className="input">
                        <input type="text" readOnly="readOnly" value={this.getCurrentPhone()}/>
                        <input type="hidden"
                               name="mobile"
                               pattern="[0-9]*"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.mobile}
                               ref="mobile"
                               maxLength="11"/>
                    </div>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">图形验证码</div>
                    <div className="input">
                        <input type="text"
                               name="imgVCodeInput"
                               placeholder="请输入图形验证码"
                               maxLength="4"
                               onChange={this.handleInputChange}
                               value={this.state.form.imgVCodeInput}
                               ref="imgVCodeInput"/>
                    </div>
                    <a className="v_img">
                        <img src="" alt="" ref="imgVCode" onClick={this.handleChangeImgVCode.bind(this)}/>
                    </a>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">手机验证码</div>
                    <div className="input">
                        <input type="number"
                               placeholder="请输入手机验证码"
                               name="mobileVCode"
                               pattern="[0-9]*"
                               onChange={this.handleInputChange}
                               value={this.state.form.mobileVCode}
                               maxLength="4"/>
                    </div>
                    <a className="v_btn" onClick={this.sendVCode.bind(this)}>
                        发送验证码
                    </a>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">新交易密码</div>
                    <div className="input">
                        <input type="password"
                               placeholder="请输入新交易密码"
                               name="password1"
                               pattern="[0-9]*"
                               onChange={this.handleInputChange}
                               value={this.state.form.password1}
                               maxLength="6"/>
                    </div>
                </div>

                <div className="HY_form_item no_border">
                    <div className="label">重复交易密码</div>
                    <div className="input">
                        <input type="password"
                               placeholder="请重复新交易密码"
                               name="password2"
                               pattern="[0-9]*"
                               onChange={this.handleInputChange}
                               value={this.state.form.password2}
                               maxLength="6"/>
                    </div>
                </div>

                <AutoFixedBottom>
                    <div className="btn_area">
                        <a className="btn btn_gold" onClick={this.handleSubmit.bind(this)}>确认</a>
                    </div>
                </AutoFixedBottom>
            </div>
        )
    }
}


export default FindPayPwdPage;