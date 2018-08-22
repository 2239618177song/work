/**
 * Created by xhy-pc on 2017/2/27.
 */
import React,{Component} from 'react';
class AutoFixedBottom extends Component{
    constructor(props){
        super(props);
        this.state = {
            type:1//1->static 2->absolute
        }
    }

    componentDidMount(){
        this.setPosition();
        window.addEventListener('resize',this.callback);
    }

    /**
     * 专用回调函数
     */
    callback = ()=>{
        this.setPosition();
    };

    /**
     * 定位位置
     */
    setPosition = ()=>{
        let winHeight = window.innerHeight;
        let bodyHeight = document.getElementById('root').offsetHeight;
        console.log(winHeight-bodyHeight);

        if(winHeight-bodyHeight >= this.props.offset){
            this.setState({
                type:2
            });
        }else{
            this.setState({
                type:1
            });
        }
    };

    componentWillUnmount(){
        window.removeEventListener('resize',this.callback);
    }

    static defaultProps = {
        1:{
            position:'static',
            width:'100%',
            marginTop:'0.4rem'
        },
        2:{
            position:'absolute',
            bottom:'0.4rem',
            left:0,
            width:'100%'
        },
        offset:0
    };

    render(){
        return (
            <div style={this.props[this.state.type]}>
                {this.props.children}
            </div>
        );
    }
}

export default AutoFixedBottom;