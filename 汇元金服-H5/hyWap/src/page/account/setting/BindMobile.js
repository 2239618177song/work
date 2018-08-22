/**
 * Created by xhy on 17/7/13.
 */
/**
 * 绑定手机
 */
import React from 'react';
import BaseComponent from '../../../core/BaseComponent';
import BaseForm from '../../../Component/form/Form';
import {Link} from 'react-router';

import Title from '../../../Component/titleBar/TitleBar';
import AutoFixedBottom from '../../../Component/autoFixedBottom/AutoFixedBottom';
import T from '../../../tool/tool';

class RealName extends BaseComponent{
    constructor(){
        super();
        this.state = {
            step:1
        }
    }

    /**
     *切换步骤
     */
    next(){
        this.setMyState({
            step:2
        });
    }

    render(){

        return (
            <div>
                {
                    this.state.step == 1 ? <Step1 next={this.next.bind(this)}/> : <Step2/>
                }
            </div>

        )
    }
}

/**
 * 第一步
 */
class Step1 extends BaseForm{
    constructor(props){
        super(props);
        this.state = {
            form:{
                mobile:'15000000000',
                mobileVCode:'',
                imgVCodeInput:''
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
            url:'sendModifyMobileVCode',
            delay:120,
            keyName:'userName',
            extraArgs:{
                token:this.TOKEN
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


        T.addClass($btn,'disabled');

        T.ajax({
            url:'checkMobile',
            load:true,
            data:state,
            method:'post'
        }).done((data)=>{
            this.props.next();
            T.removeClass($btn,'disabled');
        },()=>{
            T.removeClass($btn,'disabled');
        }).fail(function(){
            T.removeClass($btn,'disabled');
        });
    }

    render(){
        return(
            <div className="_step">
                <Title title="绑定手机"/>
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

                <AutoFixedBottom>
                    <div className="btn_area">
                        <a className="btn" onClick={this.handleSubmit.bind(this)}>下一步</a>
                    </div>
                </AutoFixedBottom>
            </div>
        )
    }
}

/**
 * 第二步
 */
class Step2 extends BaseForm{

    constructor(props){
        super(props);
        this.state = {
            form:{
                mobile:'',
                vCode:'',
                imgVCodeInput:''
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
        vCode:{
            required:true,
            emptyText:'手机验证码不能为空',
            valid:'',
            invalidText:''
        }
    };

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
                type:1
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


        T.addClass($btn,'disabled');

        T.ajax({
            url:'modifyMobile',
            load:true,
            data:state,
            method:'post'
        }).done((data)=>{
            T.forward('/setting/index');
            T.removeClass($btn,'disabled');
        },()=>{
            T.removeClass($btn,'disabled');
        }).fail(function(){
            T.removeClass($btn,'disabled');
        });
    }
    render(){
        return(
            <div className="_step">
                <Title title="绑定手机"/>
                <div className="HY_form_item no_border">
                    <div className="label">新手机号</div>
                    <div className="input">
                        <input type="text"
                               placeholder="输入新的手机号码"
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
                               placeholder="图形验证码"
                               maxLength="4"
                               onChange={this.handleInputChange.bind(this)}
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
                               placeholder="手机验证码"
                               name="vCode"
                               pattern="[0-9]*"
                               onChange={this.handleInputChange.bind(this)}
                               value={this.state.form.vCode}
                               maxLength="4"/>
                    </div>
                    <a className="v_btn" onClick={this.sendVCode.bind(this)}>
                        发送验证码
                    </a>
                </div>

                <AutoFixedBottom>
                    <div className="btn_area">
                        <a className="btn" onClick={this.handleSubmit.bind(this)}>确定</a>
                    </div>
                </AutoFixedBottom>
            </div>
        )
    }
}

export default RealName;