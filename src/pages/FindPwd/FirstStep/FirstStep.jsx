import React, { Component } from 'react';
import { Form, Input, Icon, Button, message, Radio } from 'antd'
import axios from '../../../axios/axios'
import PubSub from 'pubsub-js'

class FirstStep extends Component {

    state = {
        ID: '',
        IdentityCard: ''
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {          //这里的values采用的是{medID:num}这样的对象形式，标识有多少这个药品
            if (!err) {
                console.log(values);

                if (values.identify === 'Student') {
                    const student = {
                        Sid: values.ID,
                        Sname: values.Sname
                    }

                    axios('/StudentController/updatePwdStep1', { ...student, type: 'Student' }, 'POST')
                        .then(resp => {
                            console.log(resp.data);
                            if (resp.data.arg1 === "验证成功") {
                                message.success('验证成功')
                                PubSub.publish('current', 1)
                                this.setState({ ID: values.ID }, () => PubSub.publish('Sid', this.state.ID))
                            } else if (resp.data === 0) {
                                message.error('学号不正确')
                            } else {
                                message.error('该用户不存在')
                            }
                        })
                        .catch(err => message.error(err.message))
                }
            }

        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <div>
                    <Form onSubmit={this.handleSubmit} style={{ width: '400px' }}>
                        <Form.Item>
                            {getFieldDecorator('ID', {
                                rules: [{ required: true, message: '请输入您的ID!' }, { pattern: /^[0-9]\d*$/, message: '学号类型错误!' }],
                            })(<Input
                                prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='ID号' />)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('Sname', {
                                rules: [{ required: true, message: '请输入您的姓名!' }]
                            })(<Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='姓名' />)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('identify', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择你的身份!'
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

                        <p style={{ textAlign: 'center' }}>
                            <Button type='dashed' onClick={() => this.props.form.resetFields()} style={{ marginRight: '10px' }}>重置</Button>
                            <Button type='primary' htmlType='submit'>确认</Button>
                        </p>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Form.create()(FirstStep);