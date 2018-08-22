/**
 * Created by xhy on 17/7/13.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/css/account/asset.css';

import Title from '../../Component/titleBar/TitleBar';
import BannerTitle from '../../Component/bannerTitle/BannerTitle';
import Chart from '../../Component/ringChart/RingChart';
import T from '../../tool/tool';

class Asset extends BaseComponent{
    constructor(){
        super();
        this.state = {
            loaded:false,
            data:{}
        }
    }

    /**
     * 获取初始数据
     */
    getInitData(){
        T.ajax({
            url:'getAccountInfo',
            load:true
        }).done((data)=>{
            this.setMyState({
                loaded:true,
                data:data.accountObj
            });
        });
    }

    componentDidMount(){
        this.getInitData();
    }

    parseData = (data)=>{
         return [
            {color: '#e14b34', value: data.usable},
            {color: '#ff6d34', value: data.dueinCapital},
            {color: '#f34871', value: data.dueinInterest},
            {color: '#ffc00d', value: data.frozen}
        ];
    };

    render(){
        let data = this.state.data;
        return (
            <div className="_a_assetSec">
                <Title title={'账户明细'} transparent={true}/>
                <BannerTitle>
                    <div className="banner_info">
                        <div className="title">总资产</div>
                        <div className="value">{data.total}</div>
                    </div>
                </BannerTitle>


                <div className="chart_view">
                    {
                        this.state.loaded ?  <Chart data={this.parseData(data)}/> : ''
                    }

                </div>

                <div className="detail_list">
                    <div className="item">
                        <span className="icon" style={{backgroundColor:'#e14b34'}}></span>
                        <span className="title">账户余额</span>
                        <span className="value">{data.usable || '--'}</span>
                    </div>
                    <div className="item">
                        <span className="icon" style={{backgroundColor:'#ff6d34'}}></span>
                        <span className="title">待收本金</span>
                        <span className="value">{data.dueinCapital || '--'}</span>
                    </div>
                    <div className="item">
                        <span className="icon" style={{backgroundColor:'#f34871'}}></span>
                        <span className="title">待收利息</span>
                        <span className="value">{data.dueinInterest || '--' }</span>
                    </div>
                    <div className="item">
                        <span className="icon" style={{backgroundColor:'#ffc00d'}}></span>
                        <span className="title">冻结资金</span>
                        <span className="value">{data.frozen || '--' }</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Asset;