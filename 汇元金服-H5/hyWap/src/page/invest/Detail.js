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

class InvestDetail extends BaseComponent{
    constructor(){
        super();
        this.state = {
            ifLogin:-1,
            project:null
        }
    }

    innerTimer;

    /**
     * 倒计时
     */
    countdown = ()=>{
        this.innerTimer = setInterval(()=>{
            let {project} = this.state;
            let time = project.countdown*1;
            if(time <= 1){
                this.clearIntervalProject();
                project.state = 10;
                this.setMyState({
                    project
                })
            }else{
                project.countdown = --time;
                this.setMyState({
                    project
                });
            }

        },1000);
    };

    clearIntervalProject(){
        clearInterval(this.innerTimer);
    }

    //componentDidMount(){
    //    let {project} = this.state;
    //    if(project && project.state == 4){
    //        this.countdown();
    //    }
    //
    //}

    componentDidMount(){
        this.getCheckInfo();
        this.getProjectInfo();

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
            url:'getProjectById',
            load:true,
            data:{
                id:this.props.params.id
            }
        }).done((data)=>{
            this.setMyState({
                project:data
            });

            if(data.state == 4){
                this.countdown();
            }
        });
    }

    render(){
        let pro = this.state.project;
        return(
            <div className="_investDetailSec">
                <Title title="产品详情" backCallback={()=>{
                    this.forward('/invest/list')
                }} right={[<CalculateBtn key={1}/>]}/>

                <ProjectInfo project={this.state.project}/>

                <div className="item_list">
                    <div className="item type2">
                        <div className="title">
                            计息方式
                        </div>
                        <div className="description">
                            {
                                !pro ? '--' :  pro.tType == 0 ? '投资日起息' : '第二天起息'
                            }
                        </div>
                    </div>

                    <div className="item type2">
                        <div className="title">
                            预计还款时间
                        </div>
                        <div className="description">
                            {
                                pro ? pro.repayTime : '--'
                            }
                        </div>
                    </div>

                    <div className="item type2">
                        <div className="title">
                            还款方式
                        </div>
                        <div className="description">
                            {
                                !pro ? '--' :  [,'等额本息','等额本金','先息后本','到期结清'][pro.repayType]
                            }
                        </div>
                    </div>

                    <div className="item type2">
                        <div className="title">
                            单笔申购限额
                        </div>
                        <div className="description">
                            {
                                pro ? pro.maxInvest+'元' : ''
                            }
                        </div>
                    </div>

                    <div className="item" onClick={()=>{
                        this.forward(`/invest/info/${this.props.params.id}`)
                    }}>
                        <div className="title">
                            <span className="icon icon-xiangmu"></span>
                            了解项目
                        </div>
                        <div className="description">
                            总金额{pro ? pro.account : '--'}元
                        </div>
                        <div className="arrow"></div>
                    </div>

                    <div className="item" onClick={()=>{
                        this.forward(`/invest/record/${this.props.params.id}`)
                    }}>
                        <div className="title">
                            <span className="icon icon-tzjl"></span>
                            投资记录
                        </div>
                        <div className="description">
                            {pro ? pro.projectInvestCount+'笔' : '--笔'}
                        </div>
                        <div className="arrow"></div>
                    </div>
                </div>

                <SubmitArea {...this.state}/>
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
            if(isPayPassword*1 === 1 ){
                T.Alert('您需要先设置支付密码哦',()=>{
                    T.forward('/setting/payPwd/set');
                });
                return;
            }

            T.forward(url);
        });
        //判断是否进行过实名认证
        //T.checkRealname(()=>{
        //    T.Alert('您需要先通过实名认证才可以投资哦',()=>{
        //        T.forward('/setting/realName');
        //    })
        //},()=>{
        //    T.forward(url);
        //});
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
            if(pro.state*1 === 10){//正常的标
                if(pro.isNovice*1 === 1){//是新手标
                    if(pro.isNew*1 === 1){//新手标，人不是新手
                        return (
                            <Link className="btn disabled">仅限新手申购</Link>
                        )
                    }else{//标是新手标，人也是新手
                        return (
                            <Link className="btn" onClick={this.handleClick.bind(this)}>立即申购</Link>
                        )
                    }
                }else{
                    return (
                        <Link className="btn" onClick={this.handleClick.bind(this)}>立即申购</Link>
                    )
                }
            }else{//其他状态的标
                let stateText;
                if(pro.state*1 === 22){stateText = '已完成';}
                else if(pro.state*1 === 4){stateText='敬请期待';}
                else{stateText='还款中';}

                return (
                    <Link className="btn disabled">{stateText}</Link>
                )
            }
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
 * 计算器按钮
 */
class CalculateBtn extends BaseComponent{
    render(){
        return (
            <Link className="calculate_btn" to="/invest/calculator"/>
        )

    }
}

/**
 * 标的信息
 */
class ProjectInfo extends BaseComponent{
    render(){
        let pro = this.props.project;
        if(pro == null){
            return <InnerLoading/>
        }
        return(
            <div className="project_info">
                {
                    pro.state*1 != 4 && pro.state*1 != 10
                        ?
                        <div className="sold_out"></div>
                        :
                        ''
                }

                <div className="title clearfix">
                    <div className="left_tag">
                        {pro.isNovice*1 === 1 ? <span className="newer"></span> : ''}
                    </div>
                    <div className="right_state">
                        {
                            pro.state*1 == 10 ?
                                <span className="selling">申购中</span>
                                :
                                ''
                        }

                    </div>
                    <div className="text">
                        {pro.name}
                    </div>
                </div>

                <div className="content">
                    <div className="rate">
                        <div className="r_value">
                            {pro.yearRate}
                            {
                                pro.addRate*1 !== 0 ? <span className="add_rate">+{pro.addRate}%</span> : ''
                            }
                            {
                                pro.state == 4 ?
                                    <div className="count_time">
                                        <span className="icon icon-time"></span>
                                        开标倒计时:
                                        {Math.floor(pro.countdown/60)}:
                                        {pro.countdown%60}
                                    </div>
                                    :
                                    ''
                            }


                        </div>
                        <div className="r_title">
                            年化收益率(%)
                        </div>
                    </div>

                    <div className="info_list">
                        <div className="item">
                            <div className="r_value">{pro.cycle}</div>
                            <div className="r_title">项目期限({[,'天','周','月','季','年'][pro.cycleType*1]})</div>
                        </div>
                        <div className="item">
                            <div className="r_value">{pro.remain}</div>
                            <div className="r_title">剩余可投(元)</div>
                        </div>
                        <div className="item">
                            <div className="r_value">{pro.minInvest}</div>
                            <div className="r_title">起投金额(元)</div>
                        </div>
                    </div>

                    <div className="progress_wrap">
                        <Progress scales={pro.scales}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default  InvestDetail;