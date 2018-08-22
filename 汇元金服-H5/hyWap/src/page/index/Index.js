/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React from 'react';
import BaseComponent from "../../core/BaseComponent";
import {Link} from 'react-router';
import T from '../../tool/tool';

import '../../res/css/index/index.css'

import LRSliderText from '../../Component/sliderText/SliderText';
import Slider from '../../Component/slider/Slider';
import Nav from '../../Component/navigator/Navigator';
import Project from '../../Component/project/Project';
import Progress from '../../Component/sliderProgress/SliderProgress';
import InnerLoading from '../../Component/innerLoading/InnerLoading';

/**
 * 首页
 */
class Index extends BaseComponent{
    constructor(){
        super();
        this.state = {
            bannerList: [],
            textList: [],
            project: null
        };
    };

    /**
     * 获取banner列表
     */
    getBannersData(){
        T.ajax({
            url:'getBannerList'
        }).done((data)=>{
            this.setMyState({bannerList:data});
        })
    }

    /**
     * 获取轮播文字
     */
    getSliderText(){
        T.ajax({
            url:'getArticleList'
        }).done((data)=>{
            this.setMyState({
                textList:data.list
            })
        })
    }

    /**
     * 获取首页标的
     */
    getProject(){
        T.ajax({
            url:'getProjectById'
        }).done((data)=>{
            this.setMyState({
                project:data
            })
        })
    }

    componentDidMount(){
        this.getBannersData();
        this.getSliderText();
        this.getProject();
    }


    render(){
        return (
            <div className="_indexSec">
                <Slider imgList={this.state.bannerList}/>
                <SlideText list={this.state.textList}/>
                <Ads/>
                {
                    this.state.project ?
                        <ProjectIndex item={this.state.project}/>
                        :
                        <InnerLoading/>
                }

                <Nav index="0"/>
            </div>
        );
    }
}

/**
 * 文字轮播
 */
class SlideText extends BaseComponent{

    render(){
        console.log(this.props);
        return(
            <section className="notice lrSlideIn">
                <div className="leftIcon"><span/></div>
                <div className="rightSlide">
                    {
                        this.props.list.length ?
                            <LRSliderText list={this.props.list} height={30}/>
                            :
                            '暂无公告'

                    }
                     </div>
            </section>
        )
    }
}

/**
 * 首页广告
 */
class Ads extends BaseComponent{
    render(){
        return (
            <div className="ads">

                <Link to="/invest/list" className="ad">
                    <img src={require('../../res/images/sy_zwt@2x.png')} alt=""/>
                </Link>

                <Link to="/info/aboutUs" className="ad type2">
                    <img src={require('../../res/images/tu_zhanwei2.png')} alt=""/>
                </Link>
            </div>
        )
    }
}

/**
 * 首页标的
 * (公用标的的子类)
 */
class ProjectIndex extends Project{
    render(){
        //console.log(this.state);
        let item = this.state;

        /**
         * 获取标的类名
         * @returns {string}
         */
        let getClassName = ()=>{
            let className = 'HY_project index';
            if(item.isNovice == 1){
                className+=' newer';
            }

            if(item.state == 4){
                className+=' count_time';
            }else if(item.state == 10) {
                className += ' selling';
            }else{
                className+=' sold_out';
            }

            return className;
        };

        return (
            <div className={getClassName()} onClick={()=>{
                this.forward(`/invest/detail/${item.id}`)
            }}>
                <div className="tag_area">
                    {
                        item.isNovice == 1?
                            <div className="new_tag"></div>
                            :
                            <div className="hot_sell"></div>
                    }

                    {
                        item.state == 4 ?
                            <div className="count_time">
                                <span className="icon icon-time"></span>
                                开标倒计时:
                                {Math.floor(item.countdown/60)}:
                                {item.countdown%60}
                            </div>
                            :
                            ''
                    }
                </div>
                <div className="title">
                    <div className="right_area">
                    </div>
                    <div className="text">{item.name}</div>
                </div>

                <div className="content">
                    <div className="item rate">
                        <div className="value"><span className="rate_value main_color">{item.yearRate}</span>
                            {
                                item.addRate > 0 ?
                                    <span className="add_rate">+{item.addRate }</span>
                                    :
                                    ''
                            }

                        </div>
                        <div className="item_title">年化收益</div>
                    </div>

                    <div className="item info">
                        <div className="l_date">
                            期限
                            <span className="main_color">{item.cycle}</span>
                            {
                                ['','天','周','月','季','年'][item.cycleType]
                            }
                        </div>
                        <div className="l_amount">项目总额 <span className="main_color">{item.account}</span>元</div>
                    </div>
                </div>

                <div className="progress_wrap">
                    <Progress scales={item.scales}/>
                </div>
            </div>
        )
    }
}

export default Index;