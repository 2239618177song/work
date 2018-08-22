/*
* Copyright 杭州异人异想网络科技有限公司  异人异想手机网贷理财wap版软件 All Rights Reserved
* @version 1.0  
*/
import React from 'react';
import BaseComponent from '../../core/BaseComponent';
import '../../res/Component/SliderProgress.css';


class Progress extends BaseComponent{
    constructor(props){
        super();
    }

    static defaultProps = {
        scales:'20'
    };

    render(){
        //防止溢出
        let pScales = this.props.scales*1;
        let scales = pScales < 1 ? 1 : pScales > 99? 99 : pScales;
      return (
          <div className="HY_progress">
              <div className="p_value">
                  {pScales}%
              </div>

              <div className="p_wrap">
                  <div className="p_item">
                      <div className="p_process" style={{width:scales+'%'}}>
                          <div className="p_dotted"></div>
                      </div>
                  </div>
              </div>
          </div>
      )
    }
}

export default Progress;