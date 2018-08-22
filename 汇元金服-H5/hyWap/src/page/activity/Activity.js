/**
 * Created by xhy on 17/7/15.
 */
/**
 * Created by xhy-pc on 2016/12/29.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import Nav from '../../Component/navigator/Navigator';
import '../../res/css/activity/activity.css';
import Title from '../../Component/titleBar/TitleBar';
import {LoadGrid} from '../../Component/loadGrid/LoadGrid';
import {Link} from 'react-router';
import InnerLoading from '../../Component/innerLoading/InnerLoading';

class Activity extends BaseComponent{
    render(){
        return(
            <div className="_activitySec">
                <Title title="活动" back={false} right={[(<Link to="/info/notice/list" key={1}>公告</Link>)]}/>
                <LoadGrid
                    top={'1.2rem'}
                    bottom={'1.1rem'}
                    url={'getActivityList'}
                    args={{}}
                    itemComponent={ActivityItem}
                    />
                <Nav index="2"/>
            </div>
        )
    }
}

class ActivityItem extends BaseComponent{
    constructor(){
        super();
        this.state = {
            load:true
        }
    }
    render(){
        let item = this.props.item;
        let stateArr = [];
        switch(item.state*1){
            case 0:stateArr = (<div key={1} className="status f_right going">进行中</div>);break;
            case 1:stateArr = (<div key={1} className="status f_right">未开始</div>);break;
            case 2:stateArr = (<div key={1} className="status f_right end">结束</div>);break;

        }
        return(
            <a href={item.url} className="actItem">
                <fugure className="imgWrap">
                    <img src={item.imgUrl}
                         data-original={item.imgUrl}
                         alt={item.title}
                         width="100%"
                         className="lazy"
                        />
                </fugure>
                <div className="activityInfo">

                    {stateArr}

                    <div className="activitDetail">
                        <p className="title">{item.title}</p>
                        <p className="dateRange">活动时间：<span className="main_red">{item.beginDate}至{item.endDate}</span></p>
                    </div>
                </div>
            </a>
        )
    }
}

export  default Activity;
