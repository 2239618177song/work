/**
 * Created by xhy on 17/7/12.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/Component/Project.css';
import Progress from '../sliderProgress/SliderProgress';

class Project extends BaseComponent{

    constructor(props){
        super(props);
        this.state = props.item;
        //this.state.state = 4;
        //this.state.countdown = 500;
    }

    innerTimer;

    /**
     * 倒计时
     */
    countdown = ()=>{
        this.innerTimer = setInterval(()=>{
            let time = this.state.countdown*1;
            if(time <= 1){
                this.clearIntervalProject();
                this.setMyState({
                    state:10
                })
            }else{
                this.setMyState({
                    countdown:--time
                });
            }

        },1000);
    };

    clearIntervalProject(){
        clearInterval(this.innerTimer);
    }

    componentDidMount(){
        if(this.state.state == 4){
            this.countdown();
        }

    }

    componentWillUnmount(){
        this.clearIntervalProject();
    }

    render(){
        //console.log(this.state);
        let item = this.state;

        /**
         * 获取标的类名
         * @returns {string}
         */
        let getClassName = ()=>{
            let className = 'HY_project';
            if(item.isNovice == 1){
                className+=' newer';
            }

            if(item.state == 4){
                className+=' count_time';
            }else if(item.state == 10) {
                className += ' selling';
            }else if(item.state == 1) {
                className += '';
            }
            else{
                className+=' sold_out';
            }

            return className;
        };

        return (
            <div className={getClassName()} onClick={()=>{
                item.state === '1' ?
                    this.forward(`/invest/experienceDetail/${item.id}`)
                    :
                    this.forward(`/invest/detail/${item.id}`)
            }}>
                <div className="title">
                    {
                        item.isNovice == 1?
                            <div className="new_tag"></div>
                            :
                            ''
                    }

                    <div className="right_area">
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
                    <div className="text">{item.name}</div>
                </div>

                <div className="content">
                    <div className="item rate">
                        <div className="value"><span className="rate_value">{item.yearRate}</span>
                            {
                                item.addRate > 0 ?
                                    <span className="add_rate">+{item.addRate }</span>
                                    :
                                    ''
                            }

                        </div>
                        <div className="item_title">年化收益</div>
                    </div>

                    <div className="item date">
                        <div className="value">{item.cycle}
                            <span className="day">
                                {
                                    ['','天','周','月','季','年'][item.cycleType]
                                }
                            </span>
                        </div>
                        <div className="item_title">项目期限</div>
                    </div>
                    {
                        item.takeNum ?
                            <div className="item">
                                <div className="value">{item.takeNum}人
                                </div>
                                <div className="item_title">投资人数</div>
                            </div>
                            :
                            ''
                    }

                </div>

                <div className="progress_wrap">
                    {
                        item.scales ?
                            <Progress scales={item.scales}/>
                            :
                            ''
                    }

                </div>
            </div>
        )
    }
}

export default Project;