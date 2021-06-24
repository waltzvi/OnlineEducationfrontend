import React, { Component } from 'react'
import { Form, Input, Button, InputNumber } from 'antd';
import axios from 'axios'
import memoryUtils from '../../../../utils/memoryUtils'
import './completion.css'

const { TextArea } = Input;
class completion extends Component {
    state = {
        Teacher: memoryUtils.User
    }
    getNumber = (value) => {
        console.log('changed', value);
    }
    handleSubmit = e => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            if (!err) {

                const data = {
                    Tid: this.state.Teacher.Tid,
                    Ptitle: values.title,
                    Ptype: '填空题',
                    PchoiceAnswer: '',
                    PrightAnswer: values.answer,
                    Pscore: values.Pscore,
                }
                axios({
                    baseURL: 'http://localhost:8080/OnlineEducation',
                    method: 'post',
                    url: '/ProblemController/publishProblem',
                    params: data
                }).then(resp => {
                    console.log("resp的值", resp)
                    console.log("resp.data的值", resp.data)
                    if (resp.data.arg1 === '发布成功') {
                        this.props.history.push('/teacher/hadput')
                    }
                }).catch(err => console.log(err))
            } else {
                console.log('发布失败')
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
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

            <div>
                <section className="completion-section">
                    <h1>请编辑填空题：</h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label="题目：">
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Title can not be empty!',
                                    },
                                ],
                            })(<TextArea placeholder="请输入题目标题" rows={3} />)}
                        </Form.Item>
                        <Form.Item label="答案：">
                            {
                                getFieldDecorator('answer', {
                                    rules: [{ required: true, message: 'Answer can not be empty!' }]
                                })(
                                    <Input placeholder="正确答案："
                                    />,
                                )
                            }
                        </Form.Item>

                        <Form.Item label="分值：">
                            {getFieldDecorator('Pscore', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Title can not be empty!',
                                    },
                                ], initialValue: 5
                            })(<InputNumber min={1} max={50} onChange={this.getNumber} />)}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" className="SCquestion-form-button" ghost>publish</Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default Form.create()(completion)