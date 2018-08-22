/**
 * Created by xhy on 17/7/13.
 * 投资列表
 */
/**
 * 项目信息
 */
import React from 'react';
import LRBaseComponent from "../../core/BaseComponent";
import T from '../../tool/tool';
import '../../res/css/invest/invest.css';
import Title from '../../Component/titleBar/TitleBar';
import Progress from '../../Component/progress/Progress';
import AutoFixedBottom from '../../Component/autoFixedBottom/AutoFixedBottom';


class InvestCalculator extends LRBaseComponent{

    constructor() {
        super();
        this.state = {
            chart:this.getChartData(0),
            form:{
                amount:'',
                yearRate:'',
                daysBetween:''
            }
        }
    }

    /**
     * 获取图表数据
     * @param data
     */
    getChartData = (data)=>{
        let flag = data*1;
        return {
            hy:{
                value:data.toFixed(2),
                percent:flag ? 1 : 0
            },
            other:{
                value:(data*0.5833).toFixed(2),
                percent:flag ? 0.5833 : 0
            },
            bank:{
                value:(data*0.4166).toFixed(2),
                percent:flag ? 0.4166 : 0
            }
        }
    };

    /**
     * 控制表单提交回调
     */
    handleSubmit = ()=>{
        let formData = this.state.form;

        if(formData.amount === ''){
            T.Alert('投资金额不能为空！');
            return;
        }

        if(/[^\d]/g.test(formData.amount)){
            T.Alert('您输入的投资金额有误！');
            return;
        }

        if(formData.yearRate === ''){
            T.Alert('年化率不能为空！');
            return;
        }

        if(!/^\d*.?\d+$/.test(formData.yearRate)){
            T.Alert('您输入的年利率金额有误！');
            return;
        }

        if(formData.yearRate*1 > 30){
            T.Alert('年化率不能超过30%！');
            return;
        }

        if(formData.daysBetween === ''){
            T.Alert('投资期限不能为空!');
            return;
        }

        if(/[^\d]/g.test(formData.daysBetween)){
            T.Alert('投资期限输入有误！');
            return;
        }

        if(formData.daysBetween*1 > 1000){
            T.Alert('投资期限不能超过1000天！');
            return;
        }

        /**
         * 验证通过
         */

        this.setMyState({
            chart:this.getChartData(0)
        });

        if(!formData.amount){
            return;
        }
        T.ajax({
            url:'calculator',
            method:'post',
            data:formData
        }).done((data)=>{
            setTimeout(()=>{
                //debugger;
                this.setMyState({
                    chart:this.getChartData(data)
                });
            },300);

        });
    };


    /**
     * 控制投资金额变化
     */
    handleAmountChange = (e)=>{
        let value = e.target.value;
        let form  = this.state.form;

        form.amount = value*1 > 20000000 ? 20000000 : value;

        this.setMyState({
            form:form
        });
    };


    /**
     * 控制年华利率变化
     */
    handleRateChange = (e)=>{
        let value = e.target.value;
        let form  = this.state.form;
        form.yearRate = value*1 > 30 ? 30 : value;
        this.setMyState({
            form:form
        });
    };

    /**
     * 控制投资时间变化
     */
    handleDaysChange = (e)=>{
        let value = e.target.value;
        let form = this.state.form;
        form.daysBetween = value*1 > 1000 ? 1000 : value;
        this.setMyState({
            form:form
        });
    };


    render(){
        let chart = this.state.chart;
        return(
            <div className="_calculateSec">
                <Title title="计算器"/>
                <div className="result_area">
                    <div className="title">
                        <span className="dotted"></span>
                        收益(元)
                    </div>

                    <div className="content">
                        <div className="chart_view hy">
                            <div className="wrap">
                                <Progress shape={120} duration={300} percent={chart.hy.percent}/>
                                <p className="platform">汇元</p>
                            </div>
                            <p className="name">¥ {chart.hy.value}</p>
                        </div>
                        <div className="chart_view other" style={{left:'30px'}}>
                            <div className="wrap">
                                <Progress shape={70} duration={300} percent={chart.bank.percent}/>
                                <p className="platform">银行</p>
                            </div>
                            <p className="name">¥ {chart.bank.value}</p>
                        </div>
                        <div className="chart_view other" style={{right:'30px'}}>
                            <div className="wrap">
                                <Progress shape={70} duration={300} percent={chart.other.percent}/>
                                <p className="platform">其他</p>
                            </div>
                            <p className="name">¥ {chart.other.value}</p>
                        </div>
                    </div>

                    <div className="form">
                        <div className="item">
                            <div className="label">
                                <span className="icon icon-amount"></span>
                                投资金额
                            </div>
                            <div className="input">
                                <input
                                    type="number"
                                    placeholder="输入投资金额(元)"
                                    name="amount"
                                    pattern="[0-9]*"
                                    value={this.state.form.amount}
                                    onChange={this.handleAmountChange.bind(this)}
                                    />
                            </div>
                        </div>

                        <div className="item">
                            <div className="label">
                                <span className="icon icon-rate"></span>
                                年化利率
                            </div>
                            <div className="input">
                                <input
                                    type="text"
                                    placeholder="输入年化利率(元)"
                                    name="yearRate"
                                    value={this.state.form.yearRate}
                                    onChange={this.handleRateChange}
                                    />
                            </div>
                        </div>

                        <div className="item">
                            <div className="label">
                                <span className="icon icon-date"></span>
                                投资期限
                            </div>
                            <div className="input">
                                <input
                                    type="number"
                                    placeholder="输入投资期限(天)"
                                    name="daysBetween"
                                    pattern="[0-9]*"
                                    value={this.state.form.daysBetween}
                                    onChange={this.handleDaysChange}/>
                            </div>
                        </div>

                        <AutoFixedBottom>
                            <div className="btn_area">
                                <a className="btn" onClick={this.handleSubmit}>计算利息</a>
                            </div>
                        </AutoFixedBottom>
                    </div>
                </div>
            </div>
        )
    }
}

export default InvestCalculator;