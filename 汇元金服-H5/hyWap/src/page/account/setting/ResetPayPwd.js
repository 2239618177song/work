/**
 * Created by xhy on 17/7/13.
 */
/**
 * 修改支付密码
 */
import React from 'react';
import BaseForm from '../../../Component/form/Form';
import {Link} from 'react-router';
import Title from '../../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../../Component/autoFixedBottom/AutoFixedBottom';
import T from '../../../tool/tool';

class ResetPayPwd extends BaseForm{
    constructor(){
        super();
        this.state = {
            form:{
                payPassword: '',
                newPayPassword: '',
                reNewPayPassword: ''
            }
        }
    }

    /**
     * 表单验证
     */
    valid = {
        payPassword:{
            required:true,
            emptyText:'原支付密码不能为空',
            valid:/^\d{6}$/,
            invalidText:'原支付密码格式有误(6位数字)'
        },
        newPayPassword:{
            required:true,
            emptyText:'请输入新支付密码',
            valid:/^\d{6}$/,
            invalidText:'新支付密码格式有误(6位数字)'
        },
        reNewPayPassword:{
            required:true,
            emptyText:'请再次输入新支付密码',
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

        if(state.newPayPassword != state.reNewPayPassword){
            T.showToast('两次输入的密码不一致');return;
        }


        T.addClass($btn,'disabled');
        let {
            payPassword,
            newPayPassword
        } = state;

        T.ajax({
            url:'updatePayPassword',
            load:true,
            data:{
                payPassword,
                newPayPassword
            },
            method:'post'
        }).done((data)=>{
            T.showToast('支付密码修改成功！');
            setTimeout(()=>{
                T.forward('/setting/index')
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
                    <Title title="修改支付密码"/>

                    <div className="HY_form_item no_border">
                        <div className="label">原支付密码</div>
                        <div className="input">
                            <input type="password"
                                   name="payPassword"
                                   placeholder="请输入原支付密码"
                                   maxLength="6"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.payPassword}
                            />
                        </div>
                    </div>

                    <div className="HY_form_item no_border">
                        <div className="label">支付密码</div>
                        <div className="input">
                            <input type="password"
                                   name="newPayPassword"
                                   placeholder="请输入6位数字密码"
                                   maxLength="6"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.newPayPassword}
                            />
                        </div>
                    </div>

                    <div className="HY_form_item no_border">
                        <div className="label">确认密码</div>
                        <div className="input">
                            <input type="password"
                                   placeholder="请再次输入新支付密码"
                                   name="reNewPayPassword"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.reNewPayPassword}
                                   maxLength="6"/>
                        </div>
                    </div>
                    <div className="to_find_paypwd"> 
                        <Link to="/setting/auth/findpwd">忘记交易密码？</Link>
                    </div>
                    <AutoFixedBottom>
                        <div className="btn_area">
                            <a className="btn" onClick={this.handleSubmit.bind(this)}>确认更改</a>
                        </div>
                    </AutoFixedBottom>
                </div>
            </div>

        )
    }
}

export default ResetPayPwd;