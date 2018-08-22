/**
 * Created by xhy on 17/7/28.
 */
/* eslint-disable */
import React from 'react';
import BaseComponent from "../../core/BaseComponent";
import Title from '../../Component/titleBar/TitleBar';
import {Link} from 'react-router';
import T from '../../tool/tool';
import InvestProtocol from '../../Component/protocol/InvestProtocol';
import '../../res/css/invest/invest.css';
import BannerTitle from '../../Component/bannerTitle/BannerTitle';
//import InputDelay from '../../Component/inputDelay/InputDelay';
import AutoFixedBottom from '../../Component/autoFixedBottom/AutoFixedBottom';
import KeyBoard from '../../Component/keyBoard/KeyBoard';

class InvestPay extends BaseComponent{

    constructor(props){
        super(props);
        this.state = {
            loaded:false,
            expectIncome:'0.0',//预期收益
            couponInfo: {//券包使用信息
                red: null,
                rate: null
            },
            amount:'',//申购金额(初始化为空字符串)
            investNum:0,//实际投资金额
            checked:true,
            btnArea:{
                valid:false,
                btnText:'实际支付0.0元'
            },
            
        };
    }

    /**
     * 获取初始化数据
     */
    getInitData(){
        const pid = this.props.params.id;
        T.ajax({
            url:'invest',
            method:'post',
            data:{
                pid: pid
            }
        }).done((data)=>{
            //debugger;
            this.setMyState({
                pid:pid,//项目id
                project:data.project,//标信息
                account:data.account,//账户对象
                loaded:true,//是否加载完成
                canUseRed:data.redEnvelopeRate*1,//是否可以使用红包
                canUseInterest:data.canIncreaseInterest*1//是否可以使用加息券
            });
        });
    }

    /**
     * 计算利息
     */
    handleIncomeCalculate(){
        let pid = this.props.params.id;
        let addRate = this.state.couponInfo.rate ? this.state.couponInfo.rate.amount : 0;

        let amount = this.state.amount || 0;

        T.ajax({
            url:'calculate',
            data:{
                pid:pid,
                amount:amount,
                increaseInterest:addRate
            },
            method:'post'
        }).done((data)=>{
            this.setMyState({
                expectIncome:data
            });
        });
    }

    /**
     * 控制全部投入
     */
    handleAllInvest(amount){
        let state = this.state;
        state.amount = amount;
        this.setMyState(state);

        setTimeout(() => {
            this.setInvestNum();
            this.handleIncomeCalculate(/*Math.floor(usable)*/);
            this.handleBtnArea();
        });

        //this.handleIncomeCalculate();
        //this.handleBtnArea();
    }

    /**
     * 控制确认协议
     */
    handleProtocolChecked(){
        let checked = this.state.checked;
        this.setMyState({
            checked:!checked
        });
        this.handleBtnArea();
    }


    /**
     * 控制券包信息
     * @param obj
     * @param type
     */
    handleCouponInfo(obj,type){
        let couponInfo = this.state.couponInfo;
        if(type){
            couponInfo.rate = obj;
        }else{
            couponInfo.red = obj;
        }

        this.setMyState({
            couponInfo:couponInfo
        });

        setTimeout(()=>{
            this.setInvestNum();

            if(type){//如果是加息券
                this.handleIncomeCalculate();
            }else{
                this.handleIncomeCalculate();
                this.handleBtnArea();
            }
        });

        //if(type){//如果是加息券
        //    this.handleIncomeCalculate();
        //}else{
        //    this.handleBtnArea();
        //}

    }

    /**
     * 控制表单的提交
     */
    handleSubmit(){

    }

    /**
     * 提交订单
     */
    submitInvest = (payPassword)=>{
        let {pid, redBag, investNum, couponInfo} = this.state;
        T.ajax({
            url: 'projectTransfer',
            data: {
                pid: pid,
                payPassword,
                amount: investNum,
                interestId: couponInfo.rate ? couponInfo.rate.id : '',
                redId: couponInfo.red ? couponInfo.red.id : ''
            },
            method: 'post',
            load: true
        }).done(()=>{
            T.showToast('恭喜您申购成功');
            setTimeout(()=>{
                T.forward('/account/invest/list');
            },1000);
        },({errmsg})=>{
            T.showToast(errmsg);
            this.setMyState({
                payPassword: ''
            })
        }).fail(()=>{
            this.setMyState({
                payPassword: ''
            })
        });
    }

    /**
     * 获取投资金额
     */
    setInvestNum(){
        let state = this.state;
        let amount = state.amount*1;//投资金额
        let red = state.couponInfo.red;//红包金额对象
        let maxInvest = state.project.maxInvest*1;//最大投资金额
        let remain = state.project.surplus*1;//剩余可投金额

        let judeNumber = maxInvest  <= remain ? maxInvest : remain;//判断
        let trulyPay = amount;//真实支付

        if(judeNumber >= (red?red.amount*1 : 0)+amount){//如果投资金额加上红包金额小于判断数据,则采取向上加的方式
            this.setMyState({
                investNum:amount+(red?red.amount*1 : 0)
            });
        }else{//投资金额加上红包金额大于判断数据,则需要特别判断
            this.setMyState({
                investNum:judeNumber
            });
        }
    }

    /**
     * 控制amount变化
     * @param amount
     */
    handleAmountChange(amount){
        let state = this.state;
        if(amount === '' || amount*1 === 0){//如果为空或者为0
            state.amount = amount;
            state.expectIncome ='0.0';
            this.setMyState(state);
            setTimeout(()=>{
                this.setInvestNum();
            })
        }else if(amount !== state.amount){//不为空且有变化
            state.amount = amount;
            state.investNum = amount;
            this.setMyState(state);
            setTimeout(()=>{
                this.setInvestNum();
                this.handleIncomeCalculate(/*M  ath.floor(usable)*/);
            });
            //this.handleIncomeCalculate(/*Math.floor(usable)*/);
        }

        this.handleBtnArea();



    }

    /**
     * 控制表单的显示
     */
    handleBtnArea(){
        let state = this.state;
        let amount = state.amount*1;//投资金额
        let red = state.couponInfo.red;//红包金额对象
        let minInvest = state.project.minInvest*1;//最小投资金额
        let maxInvest = state.project.maxInvest*1;//最大投资金额
        let remain = state.project.surplus*1;//剩余可投金额
        let usable = state.account.usable*1;//账户余额


        if(red){//如果已经选择了红包
            if(amount*1 < red.minInvest*1) {//如果金额变化以后，红包的使用条件金额不符合了，那就要提示错误
                this.setMyState({
                    btnArea:{
                        valid:false,
                        btnText: '请重新选择红包或重新填写投资金额'
                    }
                });
                return;
            }
        }

        if(amount < minInvest && minInvest*1 <= remain){//输入金额小于等于最小投资金额
            this.setMyState({
                btnArea:{
                    valid:false,
                    btnText: '低于起投金额'+minInvest+'元'
                }
            });
            return;
        }

        if(minInvest > remain && (amount !== remain)){//剩余可投金额小于剩余金额(且投资金额不为剩余可投金额)
            this.setMyState({
                btnArea:{
                    valid:false,
                    btnText: '剩余可投金额为'+remain+'元，请投入剩余可投金额'
                }
            });
            return;
        }

        if(maxInvest > 0 && amount > maxInvest){//投资金额超过单笔投资限额
            this.setMyState({
                btnArea:{
                    valid:false,
                    btnText: '单笔投资限额为'+maxInvest+'元!'
                }
            });
            return;
        }

        if((minInvest <= remain) && (amount > remain)){//投资金额大于剩余可投金额
            this.setMyState({
                btnArea:{
                    valid:false,
                    btnText: '剩余可投金额为'+remain+'元!'
                }
            });
            return;
        }

        if(usable < amount){//可用余额不足的
            this.setMyState({
                btnArea:{
                    valid:false,
                    btnText: '余额不足'
                }
            });
            return;
        }

        let judeNumber = maxInvest  <= remain ? maxInvest : remain;//判断
        let trulyPay = amount;//真实支付
        if(judeNumber >= (red?red.amount*1 : 0)+amount){//如果投资金额加上红包金额小于判断数据,则采取向上加的方式
            trulyPay = amount;
            this.setMyState({
                investNum:amount+(red?red.amount*1 : 0),
                btnArea:{
                    valid:true,
                    btnText: '实付 '+(trulyPay)+' 元'
                }
            });
        }else{//投资金额加上红包金额大于判断数据,则需要特别判断
            trulyPay = judeNumber-(red?red.amount*1 : 0);
            this.setMyState({
                investNum:judeNumber,
                btnArea:{
                    valid:true,
                    btnText: '实付 '+(trulyPay)+' 元'
                }
            });
        }

        //this.setMyState({
        //    btnArea:{
        //        valid:true,
        //        btnText: '实付 '+(amount - (red?red.amount : 0))+' 元'
        //    }
        //});



    }

    componentDidMount(){
        this.getInitData();
    }

    render(){
        if(!this.state.loaded){
            T.showLoading();
            return (
                <div> </div>
            )
        }
        let {showPayPasswordTips, payPassword, checked} = this.state;
        return(
            <div className="_investPaySec">
                <Title title="项目申购" transparent={true} backCallback={()=>{
                    T.forward('/invest/list')
                }}/>
                <ProjectInfo
                    {...this.state}
                    />
                <ResultOverview
                    {...this.state}
                    handleAmountChange={this.handleAmountChange.bind(this)}
                    handleAllInvest={this.handleAllInvest.bind(this)}
                    />
                <CouponSelectItem
                    {...this.state}
                    handleCouponInfo={this.handleCouponInfo.bind(this)}
                    />
                <CheckProtocol
                    {...this.state}
                    handleProtocolChecked={this.handleProtocolChecked.bind(this)}
                    />
                <BtnArea
                    {...this.state}
                    handleSubmit={this.handleSubmit.bind(this)}
                    />
            </div>
        )
    }
}

class ProjectInfo extends BaseComponent{
    constructor(){
        super();
    }
    render(){
        //debugger;
        const project = this.props.project;
        return(
            <BannerTitle height="5rem">
                <div className="pro_info">
                    <div className="title">
                        {project.name}
                    </div>
                    <div className="rate">
                        {project.yearRate}%
                        {/*<span className="add_rate">
                         +1%
                         </span>*/}

                        <p className="title">年化收益率</p>
                    </div>

                    <div className="other_info">
                        <div className="item">
                            <p className="value">{project.cycle}</p>
                            <p className="title">项目期限({[,'天','周','月','季','年'][project.cycleType*1]})</p>
                        </div>

                        <div className="item">
                            <p className="value">{project.surplus}</p>
                            <p className="title">剩余可投(元)</p>
                        </div>
                    </div>
                </div>
            </BannerTitle>
        )
    }
}

class ResultOverview extends BaseComponent{

    /**
     * 控制申购金额的改变
     * @param amount
     */
    handleAmountChange = (e)=>{
        e.preventDefault();

        let amount = e.target.value;
        if((amount+'').length > 8){//如果位数长于8位，截取8位
            amount = (amount.replace(/[^\d]/ig,'').slice(0,8));
            e.target.value = amount;
        }

        //e.target.value = amount;
        console.log(amount);

        this.props.handleAmountChange(amount);

        // if(amount === this.state.cacheAmount){
        //     this.setMyState({
        //         amount:amount,
        //         cacheAmount:amount
        //     });
        // }else{
        //     this.props.handleIncomeCalculate(amount);
        //}
        //let $this = e.target;
        //this.props.handleIncomeCalculate(String.fromCharCode(e.keyCode));
    };

    /**
     * 全部投入的处理
     */
    handleAllInvest(){
        let minInvest = this.props.project.minInvest*1;
        let remain = this.props.project.surplus*1;
        let usable = this.props.account.usable*1;
        let amount = 0;
        let $amount = this.refs.amount;
        if(usable <= minInvest){
            T.Confirm('当前余额少于起投金额，是否去充值？',
                ['去充值','取消'],
                [()=>{
                    this.forward('/account/recharge');
                }]);
            return;
        }
        if(remain > usable){//剩余可投大于余额
            amount = Math.floor(usable);
            // this.setMyState({
            //     amount:Math.floor(usable)
            // });

            //this.handleIncomeCalculate(/*Math.floor(usable)*/);
        }else{//剩余可投小于等于余额
            amount = Math.floor(remain);
            // this.setMyState({
            //     amount:Math.floor(remain)
            // });
            //this.handleIncomeCalculate(/*Math.floor(remain)*/);
        }
        $amount.value = amount;
        this.props.handleAllInvest(amount);
    }

    render(){
        const project = this.props.project;
        const account = this.props.account;
        return (
        <div className="list_info">
            <div className="item">
                <div className="label">可用余额:</div>
                <div className="input">
                    <span className="main_color">{account.usable}元</span>
                </div>
                <div className="btn_area">
                    <Link to="/account/recharge" className="btn">充值</Link>
                </div>
            </div>

            <div className="item">
                <div className="label">预期收益:</div>
                <div className="input">
                    <span className="main_color">{this.props.expectIncome}元</span>
                </div>
            </div>

            <div className="item">
                <div className="label">预期收益天数:</div>
                <div className="input">
                    <span className="main_color">{project.remainDays}天</span>
                </div>
            </div>

            <div className="item special">
                <div className="label">购买金额:</div>
                <div className="input">
                    <input type="number"
                           placeholder={project.minInvest+'元起购'}
                           pattern="[0-9]*"
                           maxLength="8"
                           id="amount"
                           ref="amount"
                           onChange={(e)=>{
                               e.preventDefault();
                                 this.handleAmountChange(e);
                           }}/>
                </div>
                <div className="btn_area">
                    <Link className="btn" onClick={this.handleAllInvest.bind(this)}>全投</Link>
                </div>
            </div>
        </div>

        )
    }
}

class CouponSelectItem extends BaseComponent{
    constructor(config){
        super(config);

        this.state = {
            show:false,
            type:0,//0-红包 1-加息券
            list:[]
        }
    }

    /**
     * 获取红包加息券
     * @param type
     */
    getCouponList(type){
        if(this.props.amount === ''){
            T.Alert('请输入申购金额~');
            return;
        }
        T.ajax({
            url:'getRedEnvelopeAndincreaseInterest',
            load:true,
            data:{
                amount:this.props.amount,
                pid:this.props.pid
            }
        }).done((data)=>{
            if(type === 0){
                this.setMyState({
                    show:true,
                    type:type,
                    list:data.redEnvelopeList,
                    red:this.props.couponInfo.red
                });
            }else{
                this.setMyState({
                    show:true,
                    type:type,
                    list:data.increaseInterestList,
                    rate:this.props.couponInfo.rate
                });
            }
        });
    }

    /**
     * 控制选择券包
     * @param type
     */
    handleCouponSelect(type){
        if(!type){//红包
            if(this.props.redEnvelopeRate === 0){
                return;
            }
        }else{//加息券
            if(this.props.canUseInterest !== 1){
                return;
            }
        }
        this.getCouponList(type);
    }

    /**
     * 关闭券包选择面板
     */
    handlePanelOpen(obj,type){
        this.props.handleCouponInfo(obj,type);
        this.setMyState({
            show:false
        });

    }


    render(){
        const prop = this.props;

        //处理红包
        let redText1 = [];
        let redText2 = [];
        if(prop.couponInfo.red === null){//没选择红包
            redText1 = [<span key="1">红包券抵扣0元</span>];
            redText2 = [<span key="2">未选择</span>];
        }else {
            if (prop.amount * 1 < prop.couponInfo.red.minInvest * 1) {//如果金额变化以后，红包的使用条件金额不符合了，那就要提示错误
                redText1 = [<span key="1" className="main_color">金额不足，满{prop.couponInfo.red.minInvest}元可使用</span>]
            }else{
                redText1 = [<span key="1">红包券抵扣{prop.couponInfo.red.amount}元</span>];
            }

            if(prop.redEnvelopeRate === 0){
                redText2 = [<span key="2">不可使用红包</span>];
            }else{
                redText2 = [<span key="2">{prop.couponInfo.red.amount*1}元红包</span>];
            }

        }

        //处理加息券
        let rateText1 = [];
        let rateText2 = [];
        console.log(prop.canUseInterest);
        if(prop.couponInfo.rate === null){//没选择加息券
            rateText1 = [<span key="1">加息券已加息0%</span>];
            if(prop.canUseInterest*1 === 1){
                rateText2 = [<span key="2">未选择</span>];
            }else{
                rateText2 = [<span key="2">不可使用加息券</span>];
            }

        }else{
            rateText1 = [<span key="1">加息券已加息{prop.couponInfo.rate.amount}%</span>];
            //rateText2 = [<span key="2">{prop.couponInfo.rate.amount}%加息券</span>];
            if(prop.canUseInterest*1 === 1){
                rateText2 = [<span key="2">{prop.couponInfo.rate.amount}%加息券</span>];
            }else{
                rateText2 = [<span key="2">不可使用加息券</span>];
            }
        }

        return (
            <div className="welfare_list">
                <div className={prop.redEnvelopeRate ? 'item' : 'item disabled'}
                     onClick={(evt)=>{this.handleCouponSelect(0)}}
                >
                    <div className="title">
                        <span className="icon icon-red"></span>
                        折扣红包
                    </div>

                    <div className="description">
                        {redText2}
                    </div>

                    <div className="arrow"></div>

                    <div className="info">{redText1}</div>
                </div>

                <div className={prop.canUseInterest*1 !== 1 ? 'item' : 'item disabled'}
                     onClick={(evt)=>{this.handleCouponSelect(1)}}
                >
                    <div className="title">
                        <span className="icon icon-rate"></span>
                        加息券
                    </div>

                    <div className="description">
                        {rateText2}
                    </div>

                    <div className="arrow"></div>

                    <div className="info">
                        {rateText1}
                    </div>
                </div>
                <CouponList {...this.state} handlePanelOpen={this.handlePanelOpen.bind(this)}/>
            </div>

        )
    }
}

class CouponList extends BaseComponent{
    constructor(props){
        super(props);
    }

    /**
     * 关闭panel
     */
    itemFadeOut(obj,type){
        this.props.handlePanelOpen(obj,type);
    }

    itemSelected(obj){
        this.itemFadeOut(obj,this.props.type);//关闭
    }

    render(){

        let list = this.props.list;
        let couponList = [];
        if(this.props.type){//加息券
            if(!list.length){//数据为空
                couponList = [(
                    <div className="noResult" key="1">
                        <img src={require("../../res/images/zhanweitu@2x.png")} alt="" />
                        <div className="text">没有符合条件的加息券哦~</div>
                    </div>
                )];
            }

            list.map((v,i)=>{
                let clazz = 'clearfix addRate';
                if(this.props.rate && v.id === this.props.rate.id){
                    clazz+= ' actived';
                }
                couponList.push(
                    <li key={i} className={clazz}
                        onClick={()=>{
                            this.itemSelected(v);
                        }}>
                        <div className="left">
                            <div className="value">
                                {v.amount}<span>%</span>
                            </div>
                        </div>

                        <div className="right">
                            <div className="title">
                                {v.name}
                            </div>
                            <div className="remark">
                                <p>投资项目天数{v.projectDays}天起</p>
                            </div>
                            <div className="date">
                                有效期至 {v.expiredTime}
                            </div>
                        </div>
                    </li>
                );
            });
        }else{//红包
            if(!list.length){//数据为空
                couponList = [(
                    <div className="noResult" key="1">
                        <img src={require("../../res/images/zhanweitu@2x.png")} alt="" />
                        <div className="text">没有符合条件的红包哦~</div>
                    </div>
                )];
            }
            list.map((v,i)=>{
                let clazz = 'clearfix';
                if(this.props.red && v.id === this.props.red.id){
                    clazz+= ' actived';
                }
                couponList.push(
                    <li key={i} className={clazz}
                        onClick={()=>{
                            this.itemSelected(v);
                        }}>
                        <div className="left">
                            <div className="value" style={{marginTop:'0.7rem'}}>
                                {v.amount}<span>元</span>
                            </div>
                        </div>

                        <div className="right">
                            <div className="title">
                                {v.name}
                            </div>
                            <div className="remark">
                                {v.type === 1 ? (<p/>):(<p>单笔最低投资{v.minInvest}元</p>) }
                                {(v.type !== 1 && v.projectDays > 1) ? (<p>投资项目天数{v.projectDays}天起</p>) : (<p/>)}
                            </div>
                            <div className="date">
                                有效期至 {v.expiredTime}
                            </div>
                        </div>
                    </li>
                );
            })
        }

        return (
            <div className={this.props.show ? "couponPanel show" : "couponPanel"}>
                <div className="header">
                    本次交易您可以使用以下{this.props.type ? '加息券':'红包'}
                </div>
                <div className="couponList">

                    <ul>
                        {couponList}
                    </ul>

                    <a href="javascript:void(0)" className="notUse"
                       onClick={()=>{
                            this.itemSelected(null);
                    }}>
                        本次暂不使用红包券
                    </a>

                </div>
            </div>
        )
    }
}

class CheckProtocol extends BaseComponent{

    constructor(props){
        super(props);
        this.state = {
            show:false,
            content:''
        };
    }
    /**
     * 确认协议
     */
    checkProtocol(){
        this.props.handleProtocolChecked();
    }


    /**
     * 获取协议数据
     */
    getProtocolData(){
        let amount = this.props.amount;
        let pid = this.props.pid;

        amount = amount || 0;

        T.ajax({
            url:'protocol',
            load:true,
            data:{
                pid:pid,
                amount:amount
            }
        }).done((data)=>{
            data = data.replace(/<html>[\s\S]+<body>/gm,'').replace(/<\/body>[\s\S]+<\/html>/gm,'');
            this.setMyState({
                show:true,
                content:data
            });
        })
    }

    /**
     * 控制协议的关闭
     */
    handleCloseProtocol(){
        this.setMyState({
            show:false
        })
    }

    render(){
        return(
            <section className="checkProtocol">
                <span>
                    <input type="checkbox" id="checkProtocol" checked={this.props.checked}
                           onChange={this.checkProtocol.bind(this)}/>
                    <label htmlFor="checkProtocol" className="fakeCheckbox">
                        我同意《<a href="javascript:void(0)"
                               className="main_red"
                               id="previewProtocol"
                               onClick={this.getProtocolData.bind(this)}>投资协议</a>》
                    </label>
                </span>

                <InvestProtocol {...this.state} handleCloseProtocol={this.handleCloseProtocol.bind(this)}/>
                {/*<Protocol {...this.state} handleCloseProtocol={this.handleCloseProtocol.bind(this)}/>*/}
            </section>
        )
    }
}

class BtnArea extends BaseComponent{
    constructor(props){
        super(props);
        this.state = {
            show:false,
            quickPsw:[],
            payPassword: '',//支付密码
            showPayPasswordTips: false,//是否显示支付密码输入框
        };
    }
    flag = true;

     /**
     * 提交订单
     */
    submitInvest = (payPassword)=>{
        if(!this.props.btnArea.valid || !this.props.checked || !this.flag){//如果是验证不通过状态,则不予以的跳转
            return;
        }

        T.ajax({
            url: 'projectInvest',
            data: {
                id:this.props.pid,
                amount:this.props.investNum,
                redId: this.props.couponInfo.red ? this.props.couponInfo.red.id : '',
                interestId:this.props.couponInfo.rate ? this.props.couponInfo.rate.id : '',
                payPassword,
            },
            method: 'post',
            load: true
        }).done(()=>{
            T.showToast('恭喜您,投资成功!');
            setTimeout(()=>{
                T.forward('/account/invest/list');
            },1000);
        },({errmsg})=>{
            T.showToast(errmsg);
            this.setMyState({
                payPassword: ''
            })
            this.setMyState({
                showPayPasswordTips: false,
            })
        }).fail(()=>{
            this.setMyState({
                payPassword: ''
            })
        });
    }

    /**
     * 处理按钮的点击事件
     */
    handleShow(){
        if(!this.props.btnArea.valid || !this.props.checked || !this.flag){//如果是验证不通过状态,则不予以的跳转
            return
        }
        this.setMyState({
            showPayPasswordTips: true
        })
    }


    render(){
        let {showPayPasswordTips, payPassword} = this.state;
        return(
            <footer className="btn_area">
                <a className={(this.props.btnArea.valid && this.props.checked) ? "btn" : "btn disabled"}
                    id="btnSubmit"
                    onClick={this.handleShow.bind(this)}
                >{this.props.btnArea.btnText}</a>
                {/*虚拟键盘*/}
                <KeyBoard payPwd={payPassword}
                    show={showPayPasswordTips}
                    successCallback={this.submitInvest.bind(this)}
                    onClose={()=>{
                        this.setMyState({
                            showPayPasswordTips: false
                        })
                    }}
                />
            </footer>
        )
    }
}

export default InvestPay;