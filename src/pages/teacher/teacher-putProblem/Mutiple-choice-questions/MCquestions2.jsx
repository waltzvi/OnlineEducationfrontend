import React, { Component } from 'react'
import { Form, Checkbox, Button, Input, InputNumber } from 'antd';
import './MCquestion.css'
import axios from 'axios';
import memoryUtils from '../../../../utils/memoryUtils'

const { TextArea } = Input;
class MCquestions2 extends Component {
    state = {
        //cheaked: '',
        A: '',
        B: '',
        C: '',
        D: '',
        Teacher: memoryUtils.User
    }

    getChoice = (type) => {
        return (event) => {
            if (type === 'A') {
                this.setState({
                    A: event.target.value
                })
            } else if (type === 'B') {
                this.setState({
                    B: event.target.value
                })
            } else if (type === 'C') {
                this.setState({
                    C: event.target.value
                })
            } else if (type === 'D') {
                this.setState({
                    D: event.target.value
                })
            }

        }
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
                console.log("题目", values.title)
                console.log("type的值", values.type)
                let rightArray = values.type
                let choiceArray = [this.state.A, this.state.B, this.state.C, this.state.D]
                var rightChoice = []
                //采用遍历的方法找到正确答案
                rightArray.forEach(element => {
                    console.log("element的值", element)
                    let indexElement = choiceArray[element - 1]
                    rightChoice.push(indexElement)

                });
                let PchoiceAnswer = choiceArray.join('&')
                let PrightAnswer = rightChoice.join('&')
                const data = {
                    Tid: this.state.Teacher.Tid,
                    Ptype: '多选题',
                    Ptitle: values.title,
                    PchoiceAnswer,
                    PrightAnswer,
                    Pscore: values.Pscore,
                }
                axios({
                    baseURL: 'http://localhost:8080/OnlineEducation',
                    method: 'post',
                    url: '/ProblemController/publishProblem',
                    params: data
                }).then(resp => {
                    console.log(resp)
                    if (resp.data.arg1 === '发布成功') {
                        this.props.history.push('/teacher/hadput')
                    }
                }).catch(err => console.log(err))
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
                <section className="MCquestion-section">
                    <h1>请编辑多选题：</h1>
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
                        <Form.Item label="答案 选项">
                            {
                                getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '答案不能为空！'
                                        }
                                    ],
                                })(
                                    <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>

                                        <Checkbox value="1">A. <Input placeholder="请输入可选答案" onChange={this.getChoice('A')} /></Checkbox><br /><br />

                                        <Checkbox value="2">B. <Input placeholder="请输入可选答案" onChange={this.getChoice('B')} /></Checkbox><br /><br />

                                        <Checkbox value="3">C. <Input placeholder="请输入可选答案" onChange={this.getChoice('C')} /></Checkbox><br /><br />

                                        <Checkbox value="4">D. <Input placeholder="请输入可选答案" onChange={this.getChoice('D')} /></Checkbox><br /><br />


                                    </Checkbox.Group>,
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
                                ],
                                initialValue: 5
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

export default Form.create()(MCquestions2)