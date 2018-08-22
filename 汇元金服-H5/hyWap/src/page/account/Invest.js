/**
 * Created by xhy on 17/7/13.
 */
/**
 *  申购记录
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/css/account/invest.css';
import {Link} from 'react-router';

import TitleBar from '../../Component/titleBar/TitleBar';
import T from '../../tool/tool';

class Invest extends BaseComponent{
    constructor(){
        super();
        this.state = {
            sumIncome: "--",
            sumInvest: "--",
            todayIncome: "--"
        }
    }

    componentDidMount(){
        T.ajax({
            url:'getIncomeInfo',
            load:true
        }).done((data)=>{
            this.setMyState(data);
        });
    }

    render(){
        let {
                sumIncome,
                sumInvest,
                todayIncome
            } = this.state;

        return (
            <div className="_investSec">
                <TitleBar title="申购记录" backCallback={()=>{
                    T.forward('/account/index')
                }}/>
                <div className="chart_view">
                    <div className="chart">
                        <p>{sumIncome}</p>
                    </div>
                    <p className="title">累计收益(元)</p>
                </div>

                <div className="op_list">
                    {/*<Link className="l_item">
                        <div className="title">
                            <span className="icon icon-income"></span>
                            今日收益
                        </div>
                        <div className="description">
                            <span className="main_color">{todayIncome}元</span>
                        </div>
                    </Link>*/}
                    <Link className="l_item">
                        <div className="title">
                            <span className="icon icon-allNum"></span>
                            申购总额
                        </div>
                        <div className="description">
                            <span className="main_color">{sumInvest}元</span>
                        </div>
                    </Link>
                    <Link className="l_item" to="/account/invest/list">
                        <div className="title">
                            <span className="icon icon-detail"></span>
                            申购明细
                        </div>
                        <div className="arrow"></div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Invest;