/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React from 'react';
import BaseComponent from './core/BaseComponent';
//import Navigator from './Component/navigator/Navigator';
//import Tabs from './Component/tabs/Tabs';
//import TitleBar from './Component/titleBar/TitleBar';
//import Slider from './Component/slider/Slider';
//import {ItemWrap,Item} from './Component/item/Item';
//import {Layer, Mask, Loading} from './Component/layer/Layer';
//import Progress from './Component/progress/Progress';
//import RegisterProtocol from './Component/protocol/RegisterProtocol';
//import CitySelect from './Component/citySelect/CitySelect';

//class Demo extends BaseComponent{
//    demoData = {
//            list: [
//                ['选项一', (index, text)=> {
//                    console.log(text + '被点击了');
//                }],
//                ['选项二', (index, text)=> {
//                    console.log(text + '被点击了');
//                }],
//                ['选项一', (index, text)=> {
//                    console.log(text + '被点击了');
//                }],
//                ['选项一', (index, text)=> {
//                    console.log(text + '被点击了');
//                }]
//            ]
//    };
//
//
//    imgList = [
//        {"alt":"","id":"71","path":"https://img.nianqa.com/data/uploads/img/2017/03/15/58c8e70479c2f.jpg","type":"1","url":""},
//        {"alt":"","id":"71","path":"https://img.nianqa.com/data/uploads/img/2017/03/15/58c8e70479c2f.jpg","type":"1","url":""},
//        {"alt":"","id":"71","path":"hx1ttps://img.nianqa.com/data/uploads/img/2017/03/15/58c8e70479c2f.jpg","type":"1","url":""},
//        {"alt":"","id":"71","path":"https://img.nianqa.com/data/uploads/img/2017/03/15/58c8e70479c2f.jpg","type":"1","url":""},
//        {"alt":"","id":"71","path":"https://img.nianqa.com/data/uploads/img/2017/03/15/58c8e70479c2f.jpg","type":"1","url":""}
//    ];
//
//    render(){
//        return (
//            <div style={{paddingTop:'60px',paddingBottom:'200px'}}>
//                <Navigator index="0"/>
//                <Tabs {...this.demoData}/>
//
//                <Slider imgList={this.imgList}/>
//                <TitleBar backCallback={()=>{alert('返回')}} title={'测试页面'}/>
//                <ItemWrap>
//                    <Item label="手机认证：" description="1586811233" url={"/jdfd"}/>
//                    <Item label="手机认证：" description="1586811233" url={"/jdfd"}/>
//                    <Item label="手机认证：" description={<span style={{color:'#ff6600',fontSize:'1.4rem'}}>立即认证</span>} url={"/jdfd"}/>
//                </ItemWrap>
//
//                <ItemWrap>
//                    <Item label="密码管理：" url={"/jdfd"}/>
//                </ItemWrap>
//
//                <Layer/>
//
//                <button onClick={this.showLoading}>show Loading</button>
//                <button onClick={this.hideLoading}>hide Loading</button>
//                <button onClick={()=>{this.showToast('dddddd')}}>show Toast</button>
//
//                <Progress shape="200" lineWidth="6" duration="1000" percent="0.8"/>
//
//                <RegisterProtocol/>
//            </div>
//        )
//    }
//
//
//}
//
//class Filter extends BaseComponent{
//    render(){
//        return(
//            <a className="btn">{this.props.filter}</a>
//        )
//    }
//}

//class Demo extends BaseComponent{
//    constructor(){
//        super();
//        this.state = {
//            show:false,
//            area:{
//                province:{},
//                city:{}
//            }
//        }
//    }
//
//    handleClick(){
//        this.setMyState({
//            show:!this.state.show
//        })
//    }
//
//    handleCancel(){
//        this.setMyState({
//            show:false
//        })
//    }
//    render(){
//        return(
//            <div>
//                <button onClick={this.handleClick.bind(this)}>选择地址</button>
//                <div className="text">
//                    {
//                        this.state.area.province.name
//                    }
//
//                    {
//                        this.state.area.city.name
//                    }
//                </div>
//                <CitySelect
//                    show={this.state.show}
//                    handleCancel={this.handleCancel.bind(this)}
//                    selectCallback={(area)=>{
//
//                        this.setMyState({
//                            area
//                        });
//                    }}
//                    ></CitySelect>
//            </div>
//        )
//    }
//}

//
//class Demo extends BaseComponent {
//    constructor(){
//        super();
//        this.state = {
//            value:''
//        }
//    }
//
//    handleDelayChange = (value)=>{
//        console.log(value);
//    };
//
//    handleNormalChange = (value) =>{
//        value = value.slice(0,8);
//        this.setMyState({
//            value
//        })
//    };
//
//    render(){
//        return(
//            <InputDelay onDelayChange={this.handleDelayChange}
//                        className="a333"
//                        style={{border:'1px solid #eee',width:'200px',height:'300px'}}
//                        maxLength={8}
//                        pattern={'[0-9]*'}
//                        type={'number'}
//                        normalChange={this.handleNormalChange}
//                        value={this.state.value}
//                        placeholder={'请输入'}
//                />
//        )
//    }
//
//}
//
//class InputDelay extends BaseComponent{
//    constructor(){
//        super();
//    }
//
//    static defaultProps = {
//        onDelayChange:(e)=>{
//
//        },
//        normalChange:(e)=>{
//
//
//        },
//        type:'text',
//        style:{},
//        placeholder:'',
//        className:'',
//        pattern:'',
//        maxLength:10,
//        value:''
//    };
//
//    timeout = null;
//    cache = '';
//
//    /**
//     * react默认change事件回调函数
//     * @param e
//     */
//    handleChange = (e) => {
//        clearTimeout(this.timeout);
//        let value = e.target.value;
//        this.props.normalChange(value);
//
//        this.timeout = setTimeout(()=>{
//            this.props.onDelayChange(value);
//        },200);
//    };
//
//    render(){
//        let {type,style,placeholder,className,pattern,maxLength,value} = this.props;
//        return (
//            <input type={type}
//                   style={style}
//                   placeholder={placeholder}
//                   className={className}
//                   pattern={pattern}
//                   maxLength={maxLength}
//                   value={value}
//                   onChange={this.handleChange}/>
//        )
//    }
//}

import ReactSwipe from 'react-swipe';
import {Link} from 'react-router';
//import './demo.css';
class Demo extends BaseComponent{
    static defaultProps = {
        imgList:[{"alt":"","id":"6","path":"https://img.huiyuanjinfu.com/http://img1.v.tmcdn.net/img/h000/h08/img20120821172025ad9610.jpg&imageView2/2/w/750","type":"1","url":null},{"alt":"","id":"5","path":"https://img.huiyuanjinfu.com/http://h.hiphotos.baidu.com/image/h%3D220/sign=13395a8f252eb938f36d7df0e56385fe/a686c9177f3e67098ee31c9131c79f3df9dc55f8.jpg&imageView2/2/w/750","type":"1","url":null},{"alt":"","id":"4","path":"https://img.huiyuanjinfu.com/http://s11.sinaimg.cn/bmiddle/4b3140743895adf63067a&imageView2/2/w/750","type":"1","url":null}],
        time:5000
    };

    constructor(){
        super();

        this.state = {
            selected:0
        }
    }

    render(){
        return(
            <div className="_LRSlider">
                <ReactSwipe className="sliderWrap" swipeOptions={{continuous: true,callback:(index)=>{this.setMyState({
                    selected:index
                })}}}>
                    {
                        this.props.imgList.map((item,i)=>{
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
                        this.props.imgList.map((item,i)=>{
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


export default Demo;