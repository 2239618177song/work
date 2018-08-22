import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'react-fastclick';

import './res/css/reset.css';//全局清除默认样式
import Tips from './Component/tips/Tips';//全局弹窗组件
import {Layer} from './Component/layer/Layer';//全局提示组件
import './res/css/common.css';//全局公用样式


ReactDOM.render(
    <div>
        <App />
        <Tips/>
        <Layer/>
    </div>,
  document.getElementById('root')
);
