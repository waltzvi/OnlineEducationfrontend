import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom"
import './index.css';
import App from './App.jsx';
import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils'

//读取local中保存的user，保存到内存中
const User = storageUtils.getUser()
memoryUtils.User = User

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  , document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
