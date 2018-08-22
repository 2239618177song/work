/**
 * Created by xhy on 17/7/24.
 */
import React,{Component} from 'react';
import citySelect from '../../res/Component/Cityselect.css';
import {province,city} from './city-data';
import T from '../../tool/tool';

class CitySelect extends Component{

    constructor(props){
        super(props);


        this.state = {
            city:this.getCityByParentId(props.province),
            province:province,
            select:{
                province:props.province,
                city:props.city
            },
            provinceOffset:0,
            cityOffset:0
        }
    }

    componentDidMount(){
        this.setProvinceOffsetByCode(this.state.select.province);
        this.setCityOffsetByCode(this.state.select.city);
        //this.lockWindow();
    }

    componentWillUnmount(){
        //this.unlockWindow();
    }

    unlockWindow(){
        document.body.ontouchmove  = null;
    }

    lockWindow(){
        document.body.ontouchmove  = ()=>{
            return false;
        }
    }

    static defaultProps = {
        province:1,
        city:1001,
        itemHeight:40,
        selectCallback:(area)=>{

        },
        show:false,
        handleCancel:()=>{

        }
    };

    /**
     * 根据code获取省的数组索引下标
     * @param code
     */
    setProvinceOffsetByCode = (code)=>{
        let index = 0;
        this.state.province.map((item,i)=>{
            if(item.code == code){
                index = i;
            }
        });
        this.setState({
            provinceOffset:-index*this.props.itemHeight
        });

        //return index*this.props.itemHeight;
    };

    /**
     * 根据code获取市的数组索引下标
     * @param code
     */
    setCityOffsetByCode(code){
        let index = 0;
        this.state.city.map((item,i)=>{
            if(item.code == code){
                index = i;
            }
        });

        this.setState({
            cityOffset:-index*this.props.itemHeight
        });
        //return index*this.props.itemHeight;
    }

    /**
     * 根据父id获取市区信息
     * @param id
     */
    getCityByParentId(id){
        return city.filter((item)=>{
           return item.parentId == id;
        });
    }

    moveObj = {
        province:0,
        city:0
    };

    /**
     * province开始触发
     * @param e
     */
    handleProvinceTouchStart(e){
        let oTop = e.touches[0].clientY;
        //console.log('start:  '+oTop);
        this.moveObj.province = oTop;
        this.lockWindow();
    }

    /**
     * province手指移动
     * @param e
     */
    handleProvinceTouchMove(e){
        let cTop = e.targetTouches[0].clientY;
        //console.log('move:  '+cTop);
        let offset = cTop - this.moveObj.province;//偏移量
        this.setState({
            provinceOffset:this.state.provinceOffset+offset
        });

        this.moveObj.province = cTop;
    }

    /**
     * province手指离开
     * @param e
     */
    handleProvinceTouchEnd(e){
        let eTop = e.changedTouches[0].clientY;
        console.log(this.state.provinceOffset);
        let finalOffset = this.state.provinceOffset;
        let index = 0;
        if(finalOffset > 0){//小于0,回offset=0的位置
            index = 0;
            //this.slideToIndex(0,'province');
        }else if(finalOffset < -(this.state.province.length-1)*this.props.itemHeight){//拉到底了,回到底部
            index = this.state.province.length-1;
            //this.slideToIndex(this.state.province.length-1,'province');
        }else {//计算偏移量最接近的选项,并触发回调
            index = this.getBoundItem(finalOffset,this.props.itemHeight);
            //this.slideToIndex(this.getBoundItem(finalOffset,this.props.itemHeight),'province');
        }

        this.slideToIndex(index,'province');

        let pCode = this.state.province[index].code;//选中的省代码
        let city = this.getCityByParentId(pCode);//所选中的省的市列表
        let cCode = city[0].code;//默认选中市区列表中的第一个

        this.setState({//触发选中
            city,
            select:{
                province:pCode,
                city:cCode
            },
            cityOffset:0
        });
        this.unlockWindow();
    }

    /**
     * 缓动到对应的item
     * @param index
     * @param type
     */
    slideToIndex(index,type,callback){
        type = type == 'province' ? 'provinceOffset' : 'cityOffset';
        T.animate({
            pri:this.state[type],
            end:-index*this.props.itemHeight,
            duration:100,
            callback:(value)=>{
                //let offset = this.state[type];
                if(type == 'provinceOffset'){
                    this.setState({
                        provinceOffset:value
                    });
                }else{
                    this.setState({
                        cityOffset:value
                    });
                }

            },
            endCallback:(value)=>{
                callback && callback(value)
            }
        });
    }



    /**
     * city开始触发
     * @param e
     */
    handleCityTouchStart(e){
        let oTop = e.touches[0].clientY;
        //console.log('start:  '+oTop);
        this.moveObj.city = oTop;
        this.lockWindow();
    }

    /**
     * city手指移动
     * @param e
     */
    handleCityTouchMove(e){
        let cTop = e.targetTouches[0].clientY;
        //console.log('move:  '+cTop);
        let offset = cTop - this.moveObj.city;//偏移量
        this.setState({
            cityOffset:this.state.cityOffset+offset
        });

        this.moveObj.city = cTop;
    }

    /**
     * city手指离开
     * @param e
     */
    handleCityTouchEnd(e){
        let eTop = e.changedTouches[0].clientY;
        console.log(this.state.cityOffset);
        let finalOffset = this.state.cityOffset;
        let index = 0;
        if(finalOffset > 0){//小于0,回offset=0的位置
            index = 0;

            //this.slideToIndex(0,'city');
        }else if(finalOffset < -(this.state.city.length-1)*this.props.itemHeight){//拉到底了,回到底部
            index = this.state.city.length-1;
            //this.slideToIndex(this.state.city.length-1,'city');
        }else {//计算偏移量最接近的选项,并触发回调
            index = this.getBoundItem(finalOffset,this.props.itemHeight);

        }
        this.slideToIndex(index,'city');

        let select = this.state.select;
        select.city = this.state.city[index].code;//选中的市区代码

        this.setState({//触发选中
            select
        });
        this.unlockWindow();
    }

    /**
     * 根据区间取得当前选中的item
     * @param num
     * @param step
     * @returns {number}
     */
    getBoundItem = (num,step)=>{
        num = Math.abs(num);
        var halfStep = step/2;
        var rest = num%step;
        var result = Math.ceil(num/step);
        return rest <= halfStep ? (num-rest)/step : result;
    };

    /**
     * 确定按钮的点击
     */
    handleDoneClick = ()=>{
        //debugger;
        let province = this.state.province.filter((item)=>{
            return item.code == this.state.select.province;
        });
        let city = this.state.city.filter((item)=>{
            return item.code == this.state.select.city;
        });

        let obj = {
            province:{
                name:province[0].name,
                code:province[0].code
            },
            city:{
                name:city[0].name,
                code:city[0].code
            }
        };
        this.props.selectCallback(obj);
        this.props.handleCancel();
    };

    /**
     * 关闭
     */
    handleCancel = ()=>{
        this.props.handleCancel();
    };


    render(){
        let state = this.state;
        return(
            <div className="city_select">
                <div className={`c_mask ${this.props.show ? 'show' : 'hide'}`} onClick={this.handleCancel.bind(this)}></div>
                <div className={`c_content ${this.props.show ? 'show' : 'hide'}`}>
                    <div className="c_title">
                        <a className="f_left" onClick={this.handleCancel.bind(this)}>取消</a>
                        请选择
                        <a className="f_right" onClick={this.handleDoneClick.bind(this)}>确定</a>
                    </div>
                    <div className="c_drag_area">
                        <ul className="c_province"
                            onTouchStart={this.handleProvinceTouchStart.bind(this)}
                            onTouchMove={this.handleProvinceTouchMove.bind(this)}
                            onTouchEnd={this.handleProvinceTouchEnd.bind(this)}
                            style={{transform:'translateY('+state.provinceOffset+'px)'}}>
                            <li className="empty"></li>
                            <li className="empty"></li>
                            <li className="empty"></li>
                            {
                                this.state.province.map((item,i)=>{
                                    return <li key={i} className={state.select.province == item.code ? 'current' : ''} data-value={item.code}>{item.name}</li>
                                })
                            }
                            <li className="empty"></li>
                            <li className="empty"></li>
                            <li className="empty"></li>
                        </ul>

                        <ul className="c_city"
                            style={{transform:'translateY('+state.cityOffset+'px)'}}
                            onTouchStart={this.handleCityTouchStart.bind(this)}
                            onTouchMove={this.handleCityTouchMove.bind(this)}
                            onTouchEnd={this.handleCityTouchEnd.bind(this)}>
                            <li className="empty"></li>
                            <li className="empty"></li>
                            <li className="empty"></li>
                            {
                                this.state.city.map((item,i)=>{
                                    return <li key={i} className={state.select.city == item.code ? 'current' : ''} data-value={item.code}>{item.name}</li>
                                })
                            }
                            <li className="empty"></li>
                            <li className="empty"></li>
                            <li className="empty"></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default CitySelect;