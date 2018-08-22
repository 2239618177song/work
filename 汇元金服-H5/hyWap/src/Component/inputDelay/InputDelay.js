/**
 * Created by xhy on 17/7/27.
 */
import React,{Component} from 'react';
class InputDelay extends Component{
    constructor(){
        super();
    }

    static defaultProps = {
        onDelayChange:(e)=>{

        },
        normalChange:(e)=>{


        },
        type:'text',
        style:{},
        placeholder:'',
        className:'',
        pattern:'',
        maxLength:10,
        value:''
    };

    timeout = null;
    cache = '';

    /**
     * react默认change事件回调函数
     * @param e
     */
    handleChange = (e) => {
        clearTimeout(this.timeout);
        let value = e.target.value;
        this.props.normalChange(value);

        this.timeout = setTimeout(()=>{
            this.props.onDelayChange(value);
        },200);
    };

    render(){
        let {type,style,placeholder,className,pattern,maxLength,value} = this.props;
        return (
            <input type={type}
                   style={style}
                   placeholder={placeholder}
                   className={className}
                   pattern={pattern}
                   maxLength={maxLength}
                   value={value}
                   onChange={this.handleChange}/>
        )
    }
}

export default InputDelay;