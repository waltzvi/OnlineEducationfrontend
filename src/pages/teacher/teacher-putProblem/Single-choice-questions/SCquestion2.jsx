import React, { Component } from 'react'
import { Form, Input, Button, Radio, InputNumber } from 'antd';
import axios from 'axios'
import './SCquestion.css'
import memoryUtils from '../../../../utils/memoryUtils'

const { TextArea } = Input;
class SCquestion2 extends Component {
    state = {
        value: 1,
        A: '',
        B: '',
        C: '',
        D: '',
        Teacher: memoryUtils.User
    };

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    getNumber = (value) => {
        console.log('changed', value);
    }

    handleSubmit = e => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            console.log(values.title)
            console.log(values)
            if (!err) {
                let myList = [this.state.A, this.state.B, this.state.C, this.state.D]
                let PchoiceAnswer = myList.join('&')
                let PrightAnswer = ''
                //console.log(values.type)
                if (values.type === 'A') {
                    PrightAnswer = this.state.A
                } else if (values.type === 'B') {
                    PrightAnswer = this.state.B
                } else if (values.type === 'C') {
                    PrightAnswer = this.state.C
                } else if (values.type === 'D') {
                    PrightAnswer = this.state.D
                }
                const data = {
                    Tid: this.state.Teacher.Tid,
                    Ptitle: values.title,
                    Ptype: '单选题',
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

            } else {
                console.log('发布失败')
            }
        })
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
                <section className="SCquestion-section">
                    <h1>请编辑单选题：</h1>
                    <Form onSubmit={this.handleSubmit} >
                        <Form.Item label="题目：">
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Title can not be empty!',
                                    },
                                ],
                            })(<TextArea placeholder="请输入题目标题" rows={4} />)}
                        </Form.Item>
                        <Form.Item label="选项 答案">
                            {getFieldDecorator('type', {
                                rules: [{
                                    require: true,
                                },
                                ],
                            })(
                                <Radio.Group onChange={this.onChange} >
                                    <Radio value='A'>  A. <Input placeholder="请输入可选答案" onChange={this.getChoice('A')}></Input></Radio><br /><br />
                                    <Radio value='B'>  B. <Input placeholder="请输入可选答案" onChange={this.getChoice('B')}></Input></Radio><br /><br />
                                    <Radio value='C'>  C. <Input placeholder="请输入可选答案" onChange={this.getChoice('C')}></Input></Radio><br /><br />
                                    <Radio value='D'>  D. <Input placeholder="请输入可选答案" onChange={this.getChoice('D')}></Input></Radio><br /><br />
                                </Radio.Group>
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
export default Form.create()(SCquestion2)