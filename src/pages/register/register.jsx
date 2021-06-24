import React, { Component } from 'react'
import { Form, Input, Checkbox, Button, Radio, Icon, Tag, Modal } from 'antd';
import axios from 'axios';
import './register.css'

class register extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        UserID: '',
        visible: false
    };
    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleWebsiteChange = value => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };

    handleSubmit = e => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            //如果数据没有错误，检验成功
            if (!err) {
                console.log(values.identify)
                if (values.identify === 'Student') {
                    console.log('提交登录的ajax请求', values)
                    const getSex = values.Sex;
                    var Ssex = 0;
                    if (getSex === 'boy') {
                        Ssex = 1
                    } else if (getSex === 'girl') {
                        Ssex = 0;
                    }
                    const data = {
                        Sname: values.Username,
                        Spassword: values.password,
                        Ssex: Ssex,
                        type: 'Student'
                    }
                    console.log(data)
                    axios({
                        baseURL: 'http://localhost:8080/OnlineEducation',
                        method: 'post',
                        url: '/StudentController/register',
                        params: data
                    }).then(resp => {
                        console.log('=========');
                        console.log(resp)
                        console.log(resp.data.arg1);
                        if (resp.data.arg1 === '注册成功') {
                            console.log('-------------');
                            const Sid = resp.data.UserID
                            console.log('=======', Sid);
                            // this.props.history.push('/show')
                            this.setState({ UserID: Sid, visible: true },
                                () => {
                                    console.log(this.state.UserID, '--------------', this.state.visible);
                                })
                        }
                    })
                        .catch(err => console.log(err))

                } else if (values.identify === 'Teacher') {

                    console.log('提交登录的ajax请求', values)
                    const getSex = values.Sex;
                    var Tsex = 0;
                    if (getSex === 'boy') {
                        Tsex = 1
                    } else if (getSex === 'girl') {
                        Tsex = 0;
                    }
                    const teacherData = {
                        Tname: values.Username,
                        Tpassword: values.password,
                        Tsex: Tsex,
                        type: 'Teacher'
                    }
                    console.log(teacherData)
                    axios({
                        baseURL: 'http://localhost:8080/OnlineEducation',
                        method: 'post',
                        url: '/TeacherController/register',
                        params: teacherData
                    }).then(resp => {
                        console.log(resp)
                        if (resp.data.arg1 === '注册成功') {
                            this.props.history.push('/teacher')
                        }
                    })
                        .catch(err => console.log(err))

                }
            } else {
                console.log('注册失败！')
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { UserID, visible } = this.state

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <div className="register-box">
                <section className="register-section">
                    <h1>REGISTER</h1>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit} className="register-form">
                        <Form.Item label="Username">
                            {getFieldDecorator('Username', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your Username',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Password" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                            })(<Input.Password />)}
                        </Form.Item>
                        <Form.Item label="Confirm Password" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>
                        <Form.Item label="UserSex" >
                            {getFieldDecorator('Sex', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please choose your sex!'
                                    }],
                                // 设置初始值
                                initialValue: 'boy'
                            })
                                (
                                    <Radio.Group onChange={this.onChange} >
                                        <Radio value='boy'><Icon type="man" className="register-form-icon-man" /></Radio>
                                        <Radio value='girl'><Icon type="woman" className="register-form-icon-woman" /></Radio>
                                    </Radio.Group>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="identify" >
                            {getFieldDecorator('identify', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please choose your identify!'
                                    }],
                                // 设置初始值
                                initialValue: 'Student'
                            })
                                (
                                    <Radio.Group onChange={this.onChange} >
                                        <Radio value='Student'>Student</Radio>
                                        <Radio value='Teacher'>Teacher</Radio>
                                    </Radio.Group>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            {getFieldDecorator('agreement', {
                                valuePropName: 'checked',
                            })(
                                <Checkbox>
                                    I have read the <a href="/#">agreement</a>
                                </Checkbox>,
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" className="register-form-button" ghost>
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                    <Modal
                        title='您的账号'
                        visible={visible}
                        onCancel={() => this.props.history.push('/show')}
                        onOk={() => {
                            Modal.confirm({
                                title: '已记住账号ID?',
                                onOk: () => this.props.history.push('/show')
                            })
                        }}
                        okText='确认'
                    >
                        <p>您的账号ID为:</p>
                        <Tag color="geekblue">{UserID}</Tag>
                        <p>请记住您的账号ID，并进行登录</p>
                    </Modal>
                </section>
            </div>
        );
    }

}

export default Form.create()(register)