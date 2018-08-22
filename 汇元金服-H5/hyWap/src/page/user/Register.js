/**
 * Created by xhy on 17/7/13.
 */
/**
 *  注册
 */
import React from 'react';
import BaseForm from '../../Component/form/Form';
import {Link} from 'react-router';

import Title from '../../Component/titleBar/TitleBar';
import T from '../../tool/tool';
import Protocol from '../../Component/protocol/RegisterProtocol';

class Register extends BaseForm{
    constructor(props){
        super(props);
        let iCode = window.location.search.match(/iCode=(\w+)/);//邀请码匹配数组
        this.state = {
            form:{//表单数据
                mobile:'',
                vCode:'',
                password:'',
                invitationCode:(iCode ? iCode[1] : ''),
                imgVCodeInput:''
            },
            config:{
                checked:true,
                showProtocol:false
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
            },
            invitationCode:{
                required:false,
                emptyText:'',
                valid:'',
                invalidText:''
            }
        };
    }


    /**
     * 协议
     * @type {RegisterProtocol}
     */
    //protocol = new Protocol();

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
            url:'sendRegisterMobileVCode',
            delay:120,
            keyName:'mobile',
            extraArgs:{
                token:this.TOKEN
            },
            successCallback:T.noop,//操作成功以后的回调
            timeoutCallback:()=>{
                let form = this.state.form;
                form.imgVCodeInput = '';
                this.setMyState({
                    form
                })
            }//超时未处理以后需要重新发送的回调
        });
    }


    /**
     * 控制同意协议
     * @param e
     */
    handleCheck = (e)=>{
        let config = this.state.config;
        config.checked = !this.state.config.checked;
        this.setState({config:config});
    };


    /**
     * 打开协议
     * @param e
     */
    openProtocol = (e)=>{
        let config = this.state.config;
        config.showProtocol = true;
        this.setState({config:config});
    };


    /**
     * 反向数据流
     */
    handleCloseProtocol = () =>{
        let config = this.state.config;
        config.showProtocol = false;
        this.setState({
            config:config
        });
    };

    successCallback = ()=>{
        /*判断终端*/
        var u = navigator.userAgent;
        //var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        let url = {'type':'login','pram':''};
        if(u.indexOf('LRAPP') !== -1){
            if (isIOS){
                window.webkit.messageHandlers.toAppJumpTo.postMessage(url);
            }else{
                window.lrBridgeJS.toAppJumpTo(JSON.stringify(url));
            }
        }else{
            T.forward('/user/login');
        }
    };


    handleSubmit = (e) => {
        // this.successCallback();
        // return;
        const $btn = e.target;

        //字段前端验证
        const validInputs = Object.keys(this.valid);

        for(let i = 0,length = validInputs.length;i < length;i++){
            const value = this.state.form[validInputs[i]];
            const validObj = this.valid[validInputs[i]];
            if(!this.validate(value,validObj))return;
        }

        //是否同意协议
        if(!this.state.config.checked){
            T.showToast('您必须先同意注册协议');
            return;
        }

        T.addClass($btn,'disabled');

        T.ajax({
            method:'post',
            url:'register',
            data:this.state.form
        }).done((data)=>{
            T.Alert('恭喜您,注册成功!',()=>{
                //T.forward('/user/login');
                this.successCallback();
            });

            //T.removeClass($btn,'disabled');
        },()=>{
            T.removeClass($btn,'disabled');
        }).fail(() => {
            T.removeClass($btn,'disabled');
        })
    };

    togglePassword = ()=>{
        console.log(this.state);
        let {openPassword} = this.state;
        this.setMyState({
            openPassword:!openPassword
        })
    };

    componentDidMount(){

        //初始化验证码发送
        this.initImgVCode(this.refs.imgVCode,{
            token:this.TOKEN
        });

        document.body.style.backgroundColor = '#fff';
    }
    componentWillUnmount(){
        document.body.style.backgroundColor = 'f8f8f8';
    }

    render(){
        return (
            <div className="_registerSec" style={{paddingTop:this.ifApp ? '0rem' : '1rem'}}>
                {
                    this.ifApp ? '' : <Title title={'注册'}/>
                }
                <div className="logo_area">
                    <img src={require('../../res/images/huiyuan_font1.png')} alt=""/>
                </div>
                <div className="user_form" style={{padding:'0 0.4rem'}}>
                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-mobile"></span>
                        </div>
                        <div className="input">
                            <input type="number"
                                   name="mobile"
                                   placeholder="请输入手机号"
                                   pattern="[0-9]*"
                                   onChange={this.handleInputChange.bind(this)}
                                   value={this.state.form.mobile}
                                   ref="mobile"
                                   maxLength="11"
                                   autoComplete="off"
                                />
                        </div>
                    </div>

                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-vCode"></span>
                        </div>
                        <div className="input">
                            <input type="text"
                                   name="imgVCodeInput"
                                   placeholder="请输入图形验证码"
                                   maxLength="4"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.imgVCodeInput}
                                   ref="imgVCodeInput"
                                   autoComplete="off"
                                />
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
                            <input type="text"
                                   name="vCode"
                                   placeholder="请输入验证码"
                                   pattern="[0-9]*"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.vCode}
                                   maxLength="4"
                                   autoComplete="off"
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
                                   placeholder="请输入6-18位字母+数字，不含空格"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.password}
                                   maxLength="20"
                                   autoComplete="off"
                                />
                        </div>
                        <a className={'v_toggle '+(this.state.openPassword ? 'open' : 'close')} onClick={this.togglePassword}></a>
                    </div>

                    <div className="form_item">
                        <div className="label">
                            <span className="icon icon-invite"></span>
                        </div>
                        <div className="input">
                            <input type="text"
                                   name="invitationCode"
                                   placeholder="请输入邀请码（选填）"
                                   onChange={this.handleInputChange}
                                   value={this.state.form.invitationCode}
                                   maxLength="11"
                                   autoComplete="off"
                                />
                        </div>
                    </div>
                </div>

                <div className="btn_area">
                    <a className="btn" onClick={this.handleSubmit}>立即注册</a>
                </div>

                <aside className="tips">
                    <p>
                        <span>
                            <input type="checkbox" id="checkProtocolBtn" checked={this.state.config.checked ? 'checked' : ''} onChange={this.handleCheck}/>
                            <label htmlFor="checkProtocolBtn" className="fakeCheckbox">我已阅读并同意
                                <a href="javascript:void(0)" className="main_red" id="checkProtocol" onClick={this.openProtocol}>《用户注册协议》</a>
                            </label>
                        </span>
                    </p>
                </aside>

                <Protocol show={this.state.config.showProtocol} handleCloseProtocol={this.handleCloseProtocol}/>
            </div>
        )
    }
}

export default Register;