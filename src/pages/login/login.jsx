import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Radio, message } from 'antd';
import { NavLink, Redirect } from 'react-router-dom'
import a from '../../axios/axios'
import axios from 'axios'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import "./login.css"


class login extends Component {
    state = {
    };

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    handleSubmit = e => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            //如果数据没有错误，检验成功
            if (!err) {
                if (values.type === 'Student') {
                    console.log('Received values of form: ', "values的值", values);
                    values = JSON.parse(JSON.stringify(values).replace(/userID/g, 'Sid').replace(/password/g, 'Spassword'))  //把原来values中的userID字段名转换成Sid,把password转换成Spassword
                    console.log('提交登录的ajax请求', values)
                    let Student = values
                    axios({
                        baseURL: 'http://localhost:8080/OnlineEducation',
                        method: 'post',
                        url: '/StudentController/login',
                        params: values
                    }).then(resp => {
                        console.log(resp)
                        if (resp.data.arg1 === '登录成功') {
                            memoryUtils.User = Student
                            storageUtils.saveUser(Student)
                            message.success('登陆成功!')
                            this.props.history.push('/show/video')
                        }
                    })
                        .catch(err => console.log(err))

                } else if (values.type === 'Teacher') {

                    console.log('Received values of form: ', "values的值", values);
                    values = JSON.parse(JSON.stringify(values).replace(/userID/g, 'Tid').replace(/password/g, 'Tpassword'))  //把原来values中的ID字段名转换成EmpID
                    console.log('提交登录的ajax请求', values)
                    let Teacher = values
                    axios({
                        baseURL: 'http://localhost:8080/OnlineEducation',
                        method: 'post',
                        url: '/TeacherController/login',
                        params: values
                    }).then(resp => {
                        console.log(resp)
                        if (resp.data.arg1 === '登录成功') {
                            message.success('登陆成功!')
                            memoryUtils.User = Teacher
                            storageUtils.saveUser(Teacher)
                            console.log(Teacher);
                            this.props.history.push('/teacher')
                        }
                    })
                        .catch(err => console.log(err))
                }
            } else {
                console.log('登录失败！')
            }
        });
    };

    text = () => {
        a('/ProblemController/findAllProblem')
            .then(resp => console.log(resp))
            .catch(err => console.log(err.message))
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        if (memoryUtils.User) {
            if (memoryUtils.User.Sid) {
                return <Redirect to='/show' />
            } else if (memoryUtils.User.Tid) {
                return <Redirect to='/teacher' />
            }
        }
        return (
            <div className="login-box">
                <section className="login-section">
                    <h1>用户登录</h1>
                    <div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {
                                    getFieldDecorator('userID', {
                                        rules: [{ required: true, message: 'Please input your userID!' }],
                                        initialValue: '1234567891'
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            placeholder="userID"
                                        />,
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your Password!' }],
                                        initialValue: '123456'
                                    })(
                                        <Input.Password
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            type="password"
                                            placeholder="Password"
                                        />,
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator('type', {
                                        rules: [{ required: true, message: 'Please choose the identity!' }],
                                        // 设置初始值
                                        initialValue: 'Teacher'
                                    })(
                                        <Radio.Group onChange={this.onChange} >
                                            <Radio value='Student'>学生</Radio>
                                            <Radio value='Teacher'>教师</Radio>
                                        </Radio.Group>
                                    )
                                }
                            </Form.Item>
                            <Form.Item>
                                {
                                    getFieldDecorator('remember', {
                                        valuePropName: 'checked',
                                        initialValue: true,
                                    })(
                                        <Checkbox>记住密码</Checkbox>
                                    )
                                }
                                <NavLink className="login-form-forgot" to='/FindPwd'>
                                    忘记密码
                                </NavLink>


                                <Button type="primary" htmlType="submit" className="login-form-button" >
                                    登录
                                </Button>

                                <NavLink className="login-form-register" to="/register">
                                    立刻注册!
                                </NavLink>
                            </Form.Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}

export default Form.create()(login)
