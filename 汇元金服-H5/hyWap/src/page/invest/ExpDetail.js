/**
 * Created by xhy on 17/7/13.
 * 投资列表
 */
/**
 * 项目详情
 */
import React from 'react';
import BaseComponent from "../../core/BaseComponent";
import {Link} from 'react-router';
import '../../res/css/invest/invest.css';

import Title from '../../Component/titleBar/TitleBar';
import Progress from '../../Component/sliderProgress/SliderProgress';
import T from '../../tool/tool';
import InnerLoading from '../../Component/innerLoading/InnerLoading';
import KeyBoard from '../../Component/keyBoard/KeyBoard';
class InvestDetail extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            ifLogin:-1,
            project:{
                tType:'',
                repayType:'',
                project:{
                    name:'--',
                    takeNum:'0',
                    day:'0',
                    yearRate:'0'
                }
            },
            show:false,
            list:[],
            ticketId:null,
            amount: 0,
            earnings:0,
            payPassword: '',//支付密码
            showTips: false,//是否显示支付密码输入框,
        }
    }


    /**
     * 判断是否登录
     */
    getCheckInfo(){
        T.checkLogin(()=>{
            this.setMyState({
                ifLogin:0
            })
        },()=>{
            this.setMyState({
                ifLogin:1
            })
        });
    }

    /**
     * 获取标的信息
     */
    getProjectInfo(){
        T.ajax({
            url:'experienceDetail',
            load:true,
            data:{
                projectId:this.props.params.id
            }
        }).done((data)=>{
            this.setMyState({
                project:data
            });
        });
    }

    /**
     * 获取体验金列表
     */
    getCouponList(){
        T.ajax({
            url:'/usableTicket',
            load:true,
        }).done((data)=>{
            this.setMyState({
                show:true,
                list:data
            });
        });
    }

    /**
     * 选择体验金
     */
    selectedAmount(obj){
        this.setMyState({
            amount:obj.amount,
            ticketId:obj.id
        });

        this.closePanel();
        this.getTicketCalculate(obj)
    }

    /**
     * 关闭体验金选择面板
     */
    closePanel(){
        this.setMyState({
            show:false
        });
    }

    /**
     * 计算体验金收益
     */
    getTicketCalculate(obj){
        // if(!this.state.ticket){
        //     return;
        // }
        T.ajax({
            url:'experience/ticketCalculate',
            data:{
                projectId:this.props.params.id,
                ticketId:obj.id,
            }
        }).done((data)=>{
            this.setMyState({
                earnings:data
            })
        });
    }

    /**
     * 提交体验金购买
     */
    handleSubmit(){
        T.ajax({
            url:'/usableTicket',
            load:true,
        }).done((data)=>{
            this.setMyState({
                list:data
            });
        });

        let list = this.state.list;

        //加息券
        if(!list.length){//数据为空
            T.showToast('您还没有选择体验金券');
        }else{
            this.setMyState({
                showTips: true
            })
        }
        
        // T.ajax({
        //     url:'experience/invest',
        //     data:{
        //         projectId:this.props.params.id,
        //         ticketId:this.state.ticketId,

        //     },
        //     method:'post'
        // }).done((data)=>{
        //     T.showToast('申购成功');
        //     setTimeout(function () {
        //         T.forward('/account/capital')
        //     },2000)
        // });
    }


    /**
     * 提交购买表单
     */
    submitOrder = (payPassword)=>{
        // let $btn = this.refs.submitBtn;
        T.ajax({
            url:'experience/invest',
            data:{
                projectId:this.props.params.id,
                ticketId:this.state.ticketId,
                payPassword,
            },
            method:'post'
        }).done((url)=>{
            T.showToast('恭喜您，投资成功~');
            setTimeout(()=>{
                T.forward('/account/index');
            })
        },({errmsg})=>{
            T.showToast(errmsg);
            this.setMyState({
                payPassword: ''
            })
            this.setMyState({
                showTips: false
            })
        }).fail(()=>{
            this.setMyState({
                payPassword: ''
            })
        })

    }

    componentWillMount(){
        this.getCheckInfo();
        this.getProjectInfo();

    }
    render(){
        let pro = this.state.project;
        let {payPassword} = this.state;
        return(
            <div className="_investDetailSec">
                <Title title="体验金项目" backCallback={()=>{
                    this.forward('/invest/list')
                }} />
                <div className="invest-info">
                    <div className="name">
                        {pro.project.name}
                    </div>
                    <div className="price">
                        <div className="value">{pro.project.yearRate}%</div>
                        <p>年化收益率</p>
                    </div>
                    <div className="bottom_info">
                        <div className="item">
                            <div className="item-value">{pro.project.day}</div>
                            <p>体验期限（天）</p>
                        </div>
                        <div className="item">
                            <div className="item-value">{pro.project.takeNum}</div>
                            <p>体验人数（人）</p>
                        </div>
                        <div className="item">
                            <div className="item-value">{this.state.earnings}</div>
                            <p>预期收益（元）</p>
                        </div>
                    </div>
                </div>

                <div className="choose-list">
                    <div className="info">
                        <p>还款方式：{pro.tType}</p>
                        <p>起息方式：<span style={{color:'#ff721f'}}>{pro.repayType}</span></p>
                    </div>
                    <div className="choose-btn" onClick={this.getCouponList.bind(this)} >
                        选择优惠券:  <span style={{float:'right', color:'#999',fontSize:'0.24rem',paddingRight:'0.2rem'}}>理财金：{this.state.amount}</span>
                        <div className="arrow"> </div>
                    </div>
                </div>

                <CouponList {...this.state}
                    closePanel={this.closePanel.bind(this)}
                    selectedAmount={this.selectedAmount.bind(this)}
                />

                {/*<ProjectInfo project={this.state.project}/>*/}

                <div className="expdetails-content">
                    <img src={require('../../res/images/expdetails.png')} width='100%' alt=""/>
                </div>

                <SubmitArea handleSubmit={this.handleSubmit.bind(this)} {...this.state}/>
                <KeyBoard payPwd={payPassword}
                        show={this.state.showTips}
                        successCallback={this.submitOrder}
                        onClose={()=>{
                            this.setMyState({
                                showTips: false
                            })
                        }}
                /> 
            </div>
        )
    }
}

/**
 * 提交区域
 */
class SubmitArea extends BaseComponent{
    /**
     * 控制按钮的点击
     * (没有实名认证需要先进行实名认证)
     */
    handleClick(){
        let url = '/invest/pay/'+this.props.project.id;
        //T.forward(url);
        //进行一些判断
        T.ajax({
            url:'getUserInfo'
        }).done(({isPayPassword,realNameState})=>{
            if(realNameState*1 !== 1){
                T.Alert('您需要先通过实名认证才可以投资哦',()=>{
                    T.forward('/setting/realName');
                });
                return;
            }
            if(isPayPassword*1 !== 0 ){
                T.Alert('您还未设置支付密码,请先去设置',()=>{
	                this.forward('/setting/payPwd/set')
	            });
                return;
            }
            this.props.handleSubmit()
        });
    }

    /**
     * 根据条件生成按钮
     * @returns {XML}
     */
    getBtn(){
        let pro = this.props.project;
        let ifLogin = this.props.ifLogin;
        if(!pro) {//接口还没返回数据
            return (
                <InnerLoading height={'1.4rem'}/>
            );
        }

        if(ifLogin === 0){//没登录
            return (
                <Link to={"/user/login?redirect=/invest/project/"+pro.id+"&ifJump=true"} className="btn disabled">立即登录</Link>
            );
        }else{//登录了
            return (
                <Link className="btn" onClick={this.handleClick.bind(this)}>立即申购</Link>
            )
        }
    }

    render(){
        return (
            <div className="btn_area">
                {this.getBtn()}
            </div>
            
        )
    }
}



/**
 * 体验金列表
 */
class CouponList extends BaseComponent{
    constructor(props){
        super(props);
    }

    itemSelected(obj){
        this.props.selectedAmount(obj); //选择一项体验金并关闭列表
    }

    closePanel(){
        this.props.closePanel()
    }
    render(){

        let list = this.props.list;
        let couponList = [];
        //加息券
        if(!list.length){//数据为空
            couponList = [(
                <div className="noResult" key="1">

                    <div className="text">您还没有体验金券~</div>
                </div>
            )];
        }

        list.map((v,i)=>{
            let clazz = 'welfare_item expert_bag';
            couponList.push(
                <li key={i} className={clazz} onClick={()=>{
                    this.itemSelected(v);
                }}>
                    <div className="left_block">
                        <h4>{v.name}</h4>
                        <p style={{marginTop:'0.3rem'}}>{v.remark}</p>
                        <p style={{marginTop:'0.3rem'}}>{v.expiredTime}到期</p>
                    </div>
                    <div className="right_block">
                        {v.amount}<span>元</span>
                    </div>
                </li>
            );
        });

        return (
            <div className={this.props.show ? "couponPanel show" : "couponPanel"}>
                <div className="header">
                    <span className="return_icon" onClick={()=>{this.closePanel();}}></span>
                    请选择体验金券
                </div>
                <div className="welfare_list">
                    <ul>
                        {couponList}
                    </ul>
                </div>
                
            </div>
        )
    }
}

export default  InvestDetail;