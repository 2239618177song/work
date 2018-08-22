/**
 * Created by xhy on 17/7/20.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';

class InnerLoading extends BaseComponent{
    static defaultProps = {
        height:'1.5rem'
    };

    render(){

        return (
            <div className="HY_inner_loading" style={{height:this.props.height}}>

            </div>
        )
    }
}

export default InnerLoading;