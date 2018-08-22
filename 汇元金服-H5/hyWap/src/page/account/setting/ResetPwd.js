/**
 * Created by xhy on 17/7/13.
 */
/**
 * 修改登录密码
 */
import React from 'react';
import BaseForm from '../../../Component/form/Form';

import Title from '../../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../../Component/autoFixedBottom/AutoFixedBottom';
import T from '../../../tool/tool';

class ResetPwd extends BaseForm{
    constructor(){
        super();
        this.state = {
            form:{
                password:'',
                newPassword:'',
                rePassword:''
            }
        }
    }

    /**
     * 表单验证
     */
    valid = {
        password:{
            required:true,
            emptyText:'原密码不能为空',
            valid:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)[^\s]{6,18}$/,
            invalidText:'原密码格式有误(6-18位数字字母组合)'
        },
        newPassword:{
            required:true,
            emptyText:'新密码不能为空',
            valid:/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)[^\s]{6,18}$/,
            invalidText:'原密码格式有误(6-18位数字字母组合)'
        },
        rePassword:{
            required:true,
            emptyText:'请再次输入新密码',
            valid:'',
            invalidText:''
        }
    };

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

        if(state.rePassword != state.newPassword){
            T.showToast('两次输入的密码不一致');return;
        }


        T.addClass($btn,'disabled');
        let {
            password,
            newPassword
        } = state;

        T.ajax({
            url:'resetPsw',
            load:true,
            data:{
                password,
                newPassword
            },
            method:'post'
        }).done((data)=>{
            T.showToast('密码重置成功！');
            setTimeout(()=>{
                T.forward('/user/login')
            },1000);

        },()=>{
            T.removeClass($btn,'disabled');
        }).fail(function(){
            T.removeClass($btn,'disabled');
        });
    }

    render(){

        return (
            <div>
                <div className="_step">
                    <Title title="修改登录密码"/>
                    <div className="HY_form_item no_border">
                        <div className="label">原密码</div>
                        <div className="input">
                            <input type="password"
                                   name="password"
                                   onChange={this.handleInputChange.bind(this)}
                                   value={this.state.form.password}
                                   placeholder="请输入原密码"
                                   maxLength="20"/>
                        </div>
                    </div>

                    <div className="HY_form_item no_border">
                        <div className="label">新密码</div>
                        <div className="input">
                            <input type="password"
                                   name="newPassword"
                                   placeholder="请输入新密码"
                                   maxLength="20"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.newPassword}
                            />
                        </div>
                    </div>

                    <div className="HY_form_item no_border">
                        <div className="label">确认密码</div>
                        <div className="input">
                            <input type="password"
                                   placeholder="请再次输入密码"
                                   name="rePassword"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.rePassword}
                                   maxLength="20"/>
                        </div>
                    </div>

                    <AutoFixedBottom>
                        <div className="btn_area">
                            <a className="btn" onClick={this.handleSubmit.bind(this)}>下一步</a>
                        </div>
                    </AutoFixedBottom>
                </div>
            </div>

        )
    }
}

export default ResetPwd;