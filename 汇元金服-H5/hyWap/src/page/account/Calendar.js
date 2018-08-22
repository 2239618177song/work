/**
 * Created by xhy on 17/7/13.
 */
/**
 *  回款日历
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';
import '../../res/css/account/calendar.css';

import maskbBg from '../../res/images/calendar_icon.png';
import TitleBar from '../../Component/titleBar/TitleBar';
import T from '../../tool/tool';
class Calendar extends BaseComponent{
    constructor(){
        super();
        this.state = {
            dayInfo:{
                year:'----',
                month:'--',
                day:'--',
                dayPay:{
                    shouldPay:0,
                    hasPay:0
                },
                monthPay:{
                    shouldPay:0,
                    hasPay:0
                }
            },
            calendarData:[],
            maskShow:localStorage.getItem('lrCalendarDone')
        };
    }

    /**
     * 缓存数据
     * @type {Array}
     */
    cacheDataList = [];

    /**
     * 获取这个月的回款计划
     */
    getMonthPayPlan(date,callback){
        T.ajax({
            url:'getIncomeByMonth',
            load:true,
            data:{
                date:date || ''
            }
        }).done((data)=>{
            this.cacheDataList = data;
            this.setMyState({
                dayInfo:this.getDayInfo(this.cacheDataList,date),
                calendarData:this.getCalendarData(this.cacheDataList,date)
            });

            callback && callback();
        })
    }

    /**
     * 获取剩余日期
     * @param firstDay
     * @param lastDay
     * @returns {*[]}
     */
    getRestDays(firstDay,lastDay) {
        let firstWeekDay = firstDay.getDay(),
            lastWeekDay = lastDay.getDay(),
            firstTmp = [],
            lastTmp = [];

        for(let i = firstWeekDay;i>0 ;i--){/*从当前的weekday去找到此星期之前的剩余日期*/
            firstTmp.push({date:this.formatDate(new Date(firstDay.getTime()-24*60*60*1000*i)),className:'_other'});
        }

        for(let j = lastWeekDay,count=1;j<6;j++){/*从当前的weekday去找到此星期之后的剩余日期*/
            lastTmp.push({date:this.formatDate(new Date(lastDay.getTime()+24*60*60*1000*(count++))),className:'_other'});
        }

        return [firstTmp,lastTmp];
    }

    /**
     * 自动添加0
     * @param num
     * @returns {*}
     */
    addZero(num){
        num = num+'';
        if(num.length === 1){
            return ('0'+num);
        }else{
            return num;
        }
    }

    /**
     * 格式化日期
     * @param date
     * @returns {string}
     */
    formatDate(date){
        return date.getFullYear()+'-'+this.addZero(date.getMonth()+1)+'-'+this.addZero(date.getDate());
    }

    /**
     * 获取单个页面的所有日期（包括当月与剩余月份的前几天或后几天）
     * @param date
     * @param firstDay
     * @param lastDay
     * @param list
     * @returns {Array}
     */
    getDaysArray(date,firstDay,lastDay,list) {
        let prev_next = this.getRestDays(firstDay,lastDay),
            dayArr = list,
            tmp = [];

        prev_next.splice(1,0,dayArr);//中间插入当月的日期
        for(let j = 0;j<prev_next.length;j++){
            for(let k = 0;k<prev_next[j].length;k++){
                tmp.push(prev_next[j][k]);
            }
        }

        return tmp;
    }

    /**
     * 头部数据重组
     * @param date
     */
    getDayInfo(data,date){
        let  toDay = (function(date){//获取日期对象
            for(let i = 0 ;i<data.dayIncomeList.length;i++){
                if(date){//如果date传入了
                    if(date == data.dayIncomeList[i].date){
                        return data.dayIncomeList[i];
                    }
                }else{
                    if(data.dayIncomeList[i].isToday*1 === 1){
                        return data.dayIncomeList[i];
                    }
                }

            }
        })(date);

        /**
         * 转换成中文
         * @param month
         * @returns {string}
         */
        let mapperChinese = (month) =>{
            let mapperArr = ['','一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
            return mapperArr[month];
        };

        //日期信息
        let dayInfo = {
            year:new Date(toDay.date).getFullYear(),
            monthStr:mapperChinese(new Date(toDay.date).getMonth()+1),
            month:new Date(toDay.date).getMonth()+1,
            day:new Date(toDay.date).getDate(),
            dayPay:{
                shouldPay:toDay.todayCollectAmount,
                hasPay:toDay.todayCollectAmountYes
            },
            monthPay:{
                shouldPay:data.monthCollectAmount,
                hasPay:data.monthCollectAmountYes
            }
        };

        return dayInfo;

    }

    /**
     * 重组日历数据（杨大傻个巨坑）
     * @param data
     */
    getCalendarData(data,date){//获取整个月的数据
        let list = data.dayIncomeList;
        let firstDay = new Date(list[0].date);
        let lastDay = new Date(list[list.length-1].date);
        let today ;

        (function(){
            for(let i=0;i<list.length;i++){
                if(list[i].isRepayFinish == -1){
                    list[i].className = '_common';
                }else if(list[i].isRepayFinish == 0){
                    list[i].className = '_common _finished';
                }else{
                    list[i].className = '_common _notFinish';
                }

                if(date){//如果传入了date
                    if(list[i].date == date){
                        today = new Date(list[i].date);
                        list[i].className += ' _common _current';
                    }
                }else{
                    if(list[i].isToday == 1){
                        today = new Date(list[i].date);
                        list[i].className += ' _common _current';
                    }
                }


                let dayStr = list[i].date.split('-');


                list[i].day = dayStr[dayStr.length-1]*1;
            }
        })();

        return this.getDaysArray(today,firstDay,lastDay,list);
    }


    componentDidMount(){
        this.getMonthPayPlan();
    }

    /**
     * 控制日的变化（不请求）
     * @param date
     */
    handleDayChange(date){
        this.setMyState({
            dayInfo:this.getDayInfo(this.cacheDataList,date),
            calendarData:this.getCalendarData(this.cacheDataList,date)
        });
    }


    /**
     * 控制年份的变化
     * @param type
     */
    handleYearChange(type){
        let date = this.state.dayInfo;
        if(type === 'prev'){//上一年
            let year = date.year*1-1;
            this.getMonthPayPlan(year+'-'+this.addZero(date.month)+'-01');//切换成一号
        }else{//下一年
            let year = date.year*1+1;
            this.getMonthPayPlan(year+'-'+this.addZero(date.month)+'-01');//切换成一号
        }
    }

    /**
     * 控制月份的变化
     * @param type
     */
    handleMonthChange(type,callback){
        let date = this.state.dayInfo;
        let month = date.month*1;
        let dateStr = '';

        if(type === 'prev'){//上一个月
            if(month === 1){
                dateStr =  (date.year-1)+'-12-'+'01';
            }
            else{
                dateStr = date.year+'-'+this.addZero(month-1)+'-01';
            }
        }else {//下一个月
            if (month === 12) {
                dateStr = (date.year + 1) + '-01-' + '01';
            }
            else {
                dateStr = date.year + '-' + this.addZero(month + 1) + '-01';
            }
        }

        this.getMonthPayPlan(dateStr,callback);
    }

    /**
     * 控制遮罩层的显示
     */
    handleMaskDone(){
        localStorage.setItem('lrCalendarDone',1);
        this.setMyState({
            maskShow:'true'
        });
    }
    render(){
        return (
            <div className="_calendarSec">
                <TitleBar title="" transparent={true}/>
                <CalendarHeader {...this.state.dayInfo} handleYearChange={this.handleYearChange.bind(this)}/>
                <CalendarTips/>
                <CalendarBody
                    dayList={this.state.calendarData}
                    handleDayChange={this.handleDayChange.bind(this)}
                    handleMonthChange={this.handleMonthChange.bind(this)}/>
                <CalendarMask handleMaskDone={this.handleMaskDone.bind(this)}
                              show={this.state.maskShow ? 1 : 0}/>
            </div>
        )
    }
}

class CalendarHeader extends BaseComponent{
    render(){
        return(
            <section className="payBackInfo">
                <div className="clearfix">
                    <div className="payBackDetail">
                        <div className="item">
                            <div className="title">
                                <span className="icon-dotted">●</span>&nbsp;
                                当日回款
                            </div>
                            <div className="content">
                                <table>
                                    <thead>
                                    <tr>
                                        <th width="50%">应回</th>
                                        <th width="50%">已回</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{this.props.dayPay.shouldPay}</td>
                                        <td>{this.props.dayPay.hasPay}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="item">
                            <div className="title">
                                <span className="icon-dotted">●</span>&nbsp;
                                当月回款
                            </div>
                            <div className="content">
                                <table>
                                    <thead>
                                    <tr>
                                        <th width="50%">应回</th>
                                        <th width="50%">已回</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>{this.props.monthPay.shouldPay}</td>
                                        <td>{this.props.monthPay.hasPay}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="dateInfo">
                        <div className="year">
                            <a href="javascript:void(0)"
                               className="changeYear prev font_huge"
                               onClick={(e)=>{
                               this.props.handleYearChange('prev');
                               }}>&lt;</a>
                            <span style={{fontSize:'0.5rem'}}> {this.props.year} </span>
                            <a href="javascript:void(0)"
                               className="changeYear next font_huge"
                               onClick={(e)=>{
                               this.props.handleYearChange('next');
                               }}>&gt;</a>
                        </div>
                        <div className="date">
                            {this.props.day}
                        </div>
                        <div className="month">
                            {this.props.monthStr}
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}


class CalendarTips extends BaseComponent{
    render(){
        return(
            <aside className="repatTips clearfix">
                <div className="f_left">
                    <div className="item"><span className="icon-dotted">●</span> 标记未回款
                    </div>
                    <div className="item"><span className="icon-dotted" style={{color:'#aaa'}}>●</span> 标记已回款
                    </div>

                </div>
                <Link to="/account/repay/list" className="f_right">回款记录&gt;&gt;</Link>
            </aside>
        )
    }
}

class CalendarBody extends BaseComponent{
    constructor(){
        super();
        this.state = {
            rotate:0
        }
    }


    /**
     * 获取日期模板
     * @returns {string}
     */
    getDayList(){
        let tpl = '';
        let list = this.props.dayList;
        if(list.length === 0){
            tpl = '<tr><td colspan="7">' +
                '<div class="lrLoading"></div>'+
                '</td></tr>';
            return tpl;
        }
        for(let i =0 ;i< list.length;i++){
            if(i%7 == 0){
                tpl+='<tr>';
            }
            if(list[i].className == '_other'){
                tpl+='<td></td>';
            }else{
                tpl+='<td>' +
                    '<a href="javascript:void(0)" ' +
                    'class="'+list[i].className+'" ' +
                    'data-date="'+list[i].date+'">'+(new Date(list[i].date).getDate())+
                    '</a>' +
                    '</td>';
            }

            if(i%7 === 6){tpl+='</tr>';}
        }
        return tpl;
    }

    /**
     * 日期点击
     * @param e
     */
    bindDayClick(e){
        let $this = e.target;
        if($this.tagName.toLocaleLowerCase() == 'a'){
            let str = $this.dataset.date;
            this.props.handleDayChange(str);
        }

    }

    /**
     * 手指事件缓存对象
     * @type {{range: number, offset: number, left: number}}
     */
    moveObj = {
        range:window.screen.width*0.3,offset:0,left:0
    };

    /**
     * touchstart
     * @param e
     */
    handleTouchStart(e){

        let oLeft = e.touches[0].clientX;
        this.moveObj.left = oLeft;
        console.log(`开始:${e.touches[0].clientX}`);
    }

    /**
     * touchmove
     * @param e
     */
    handleTouchMove(e){
        //e.preventDefault();
        let cLeft = e.targetTouches[0].clientX;
        let offset = cLeft - this.moveObj.left;//偏移量
        let rotateAngle = offset/window.screen.width*180;//偏转角度
        this.setMyState({
            rotate:rotateAngle
        });
    }

    /**
     *旋转至指定的角度
     */
    goBack(angle){
        /*暂不处理关闭（理论上认为200ms时间内用户没有时间完成页面切换）*/
        T.animate({
            pri:this.state.rotate,
            end:angle || 0,
            duration:200,
            timeFunc:'Bounce.easeOut',
            callback:(value)=>{
                this.setMyState({
                    rotate:value
                })
            }
        });
    }

    /**
     * touched
     * @param e
     */
    handleTouchEnd(e){
        let eLeft = e.changedTouches[0].clientX;
        let offset = eLeft - this.moveObj.left;//偏移量
        if(offset < -this.moveObj.range){//向右，前一个月
            this.props.handleMonthChange('next');
            /*this.setState({
             rotate:0
             })*/
            console.log('1');
            this.goBack(360);
        }else if(offset > this.moveObj.range){//向左 后一个月
            this.props.handleMonthChange('prev');
            /*this.setState({
             rotate:0
             })*/
            console.log('2');
            this.goBack(360);
        }else{//回到起点
            /*this.setState({
             rotate:0
             })*/
            console.log('3');
            this.goBack(0);

        }

        //console.log(`结束:${e.changedTouches[0].clientX}`);
    }

    render(){
        let dayList = this.getDayList();
        return(
            <section className="calendar"
                     onTouchStart={this.handleTouchStart.bind(this)}
                     onTouchMove={this.handleTouchMove.bind(this)}
                     onTouchEnd={this.handleTouchEnd.bind(this)}
                     style={{transform:'rotateY('+this.state.rotate+'deg)'}}>
                <table>
                    <thead>
                    <tr>
                        <th className="main_red">日</th>
                        <th>一</th>
                        <th>二</th>
                        <th>三</th>
                        <th>四</th>
                        <th>五</th>
                        <th className="main_red">六</th>
                    </tr>
                    </thead>
                    <tbody dangerouslySetInnerHTML={{__html:dayList}} onClick={this.bindDayClick.bind(this)}>

                    </tbody>
                </table>
            </section>
        )
    }
}

class CalendarMask extends BaseComponent{
    handleDone(e){
        this.props.handleMaskDone();
    }

    render(){
        return(
            <div className="guideMask" style={{display:this.props.show*1 ? 'none' : 'block'}}>
                <p className="title">左右滑动以切换月份</p>
                <img src={maskbBg} alt="" className="guideIcon" />
                <a className="btn getIt" onClick={this.handleDone.bind(this)}>知道啦</a>
            </div>
        )
    }
}

export default Calendar;