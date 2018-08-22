/**
 * Created by xhy on 17/7/13.
 */
import React from 'react';
import BaseComponent from '../../core/BaseComponent';

import '../../res/Component/BannerTitle.css';

class BannerTitle extends BaseComponent{
    static defaultProps = {
        height:'4rem'
    };

    render(){
        return(
            <div className="HY_banner_title" style={{height:this.props.height}}>
                <div className="inner_wrap">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default BannerTitle;