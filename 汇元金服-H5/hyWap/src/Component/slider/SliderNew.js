/**
 * Created by xhy on 17/7/31.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import ReactSwipe from 'react-swipe';
import {Link} from 'react-router';
import '../../res/Component/SliderNew.css';
class SliderNew extends BaseComponent{
    static defaultProps = {
        imgList:[]
    };

    constructor(props){
        super(props);

        this.state = {
            selected:0,
            imgList:props.imgList}

    }

    componentWillReceiveProps(props){
        this.setMyState({
            imgList:props.imgList
        })
    }

    render(){
        if(this.state.imgList.length == 0){
            return (
                <div className="_LRSlider"></div>
            )
        }

        return(
            <div className="_LRSlider">
                <ReactSwipe className="sliderWrap" swipeOptions={{continuous: true,callback:(index)=>{this.setMyState({
                    selected:index
                })},disableScroll:true}}>
                    {
                        this.state.imgList.map((item,i)=>{
                            return (
                                <Link className="item" href={item.url} key={i}>
                                    <img src={item.path} alt={item.alt}/>
                                </Link>
                            )
                        })
                    }

                </ReactSwipe>
                <aside>
                    {
                        this.state.imgList.map((item,i)=>{
                            return(
                                <a key={i} className={this.state.selected === (i) ? "actived":""}/>
                            )
                        })
                    }
                </aside>
            </div>

        )
    }

}

export default SliderNew;