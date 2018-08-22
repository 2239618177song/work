/**
 * Created by xhy-pc on 2016/12/30.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import {Link} from 'react-router';
import T from '../../tool/tool';
class LRSliderText extends BaseComponent{
    constructor(props){
        super(props);
        let sortedList = this.sortList(1);
        this.state = {
            index:1,
            sortedList:sortedList
        }
    }

    /**
     * 重新排序
     * @returns {*}
     */
    sortList(index){
        //debugger;
        let list = this.props.list;

        if(!list.length)return [];

        let tmpArr = [].concat(list.slice(index-1),list.slice(0,index-1));

        tmpArr.map((v,i)=>{
            tmpArr[i].top = i*this.props.height;
        });

        return tmpArr;
    }

    animate = {};

    slideToIndex(){
        this.animate = T.animate({
            pri:0,
            end:-this.props.height,
            duration:500,
            callback:(value)=>{

                let sortedList = this.state.sortedList;
                sortedList.map((v,i)=>{
                    sortedList[i].top = value+i*this.props.height;
               });

                this.setMyState({
                    sortedList
                });
            },
            endCallback:()=>{

                let index = this.state.index;
                if(index === this.props.list.length){

                    this.setMyState({
                        index:1,
                        sortedList:this.sortList(1)
                    });
                }else{

                    this.setMyState({
                        index:index+1,
                        sortedList:this.sortList(index+1)
                    });
                }
            }
        });
    }

    static defaultProps = {
      time:5000
    };

    /**
     * 定时器对象
     */
    timer;

    /**
     * 自动循环
     */
    autoPlay(){
        this.stopPlay();
        this.timer = setInterval(()=>{

            this.slideToIndex();
        },this.props.time);
    }

    /**
     * 关闭循环
     */
    stopPlay(){
        clearInterval(this.timer);
    }

    componentDidMount(){
        if(this.props.list.length){
            this.autoPlay();
        }
    }

    componentWillReceiveProps(props){
        if(props.list.length){
            this.autoPlay();
        }

        let sortedList = this.sortList(1);

        this.setMyState({
            index:1,
            sortedList:sortedList
        })
    }

    componentWillUnmount(){
        clearInterval(this.timer);
        this.animate.stop && this.animate.stop();
    }

    render(){
        let listArr = [];
        this.state.sortedList.map((v,i)=>{
            listArr.push(
                <li style={{top: v.top+'px'}} key={i}>
                    <Link to={'/info/notice/detail/'+v.id}>{v.title}</Link>
                </li>
            );
        });
        return(
            <div>
                <ul id="slideWrap">
                    {listArr}
                </ul>
            </div>
        );
    }
}



export default LRSliderText;