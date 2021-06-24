import React, { Component } from 'react'
import axios from 'axios'
import { Radio, Checkbox, Divider, Typography, Button, Form, Modal, Input, Icon, InputNumber, Tag } from 'antd';
import './PublishExam.css'
import memoryUtils from '../../../../../utils/memoryUtils'

const { Text } = Typography;
class PublishExam extends Component {
    state = {
        getSChoiceData: [],
        getMChoiceData: [],
        getCompletionData: [],
        getSAnswerData: [],
        ModalVisible: false,
        getTotalScore: '',
        Teacher: memoryUtils.User
    }
    componentDidMount() {
        let getPidArray = []
        const { PidArry } = this.props.location.state
        console.log(PidArry);
        for (let i = 0; i < PidArry.length; i++) {
            getPidArray.push(
                {
                    Pid: PidArry[i],
                }
            )
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/ProblemController/findByPidArray',
            data: getPidArray
        }).then(resp => {
            console.log(resp.data);
            //获取到的每个题目的详细信息
            let getSChoiceDetail = []
            let getMChoiceDetail = []
            let getSAnswerDetail = []
            let getCompletionDetail = []
            //遍历所有题目，将不同题型进行分离
            resp.data.forEach(item => {
                if (item.ptype === '单选题') {
                    getSChoiceDetail.push({
                        key: item.pid,
                        title: item.ptitle,
                        //将可选择的答案进行分离，通过符号“&”分开放入数组
                        pchoiceAnswer: item.pchoiceAnswer.split("&"),
                        prightAnswer: item.prightAnswer,
                        pscore: item.pscore,
                    })
                } else if (item.ptype === '多选题') {
                    getMChoiceDetail.push({
                        key: item.pid,
                        title: item.ptitle,
                        pchoiceAnswer: item.pchoiceAnswer.split("&"),
                        prightAnswer: item.prightAnswer.split("&"),
                        pscore: item.pscore,
                    })
                } else if (item.ptype === '填空题') {
                    getCompletionDetail.push({
                        key: item.pid,
                        title: item.ptitle,
                        prightAnswer: item.prightAnswer,
                        pscore: item.pscore,
                    })
                } else if (item.ptype === '简答题') {
                    getSAnswerDetail.push({
                        key: item.pid,
                        title: item.ptitle,
                        prightAnswer: item.prightAnswer,
                        pscore: item.pscore,
                    })
                }
            });
            //更改state状态
            this.setState({
                getSChoiceData: getSChoiceDetail,
                getMChoiceData: getMChoiceDetail,
                getCompletionData: getCompletionDetail,
                getSAnswerData: getSAnswerDetail,
            })
            let SCtotalScore = 0
            let MCtotslScore = 0
            let ComtotalScore = 0
            let SAtotalScore = 0
            this.state.getSChoiceData.forEach((Element) => {
                SCtotalScore += Element.pscore
            })
            this.state.getMChoiceData.forEach((Element) => {
                MCtotslScore += Element.pscore
            })
            this.state.getCompletionData.forEach((Element) => {
                ComtotalScore += Element.pscore
            })
            this.state.getSAnswerData.forEach((Element) => {
                SAtotalScore += Element.pscore
            })

            let totalScore = SCtotalScore + MCtotslScore + ComtotalScore + SAtotalScore
            this.setState({ getTotalScore: totalScore })
        })

    }
    finish = () => {
        this.setState({ ModalVisible: true })
    }
    handleOk = e => {
        console.log(e);
        this.handleSubmit(e);
        this.setState({
            ModalVisible: false,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let getPidArray = []
                const { PidArry } = this.props.location.state
                // console.log(PidArry);
                for (let i = 0; i < PidArry.length; i++) {
                    console.log('PidArry[i]', PidArry[i]);
                    getPidArray.push(
                        {
                            Pid: PidArry[i],
                        }
                    )
                }
                // console.log(values);
                // console.log(values.ExamName, this.state.getTotalScore, values.EtotalTime, this.state.Teacher.Tid);
                // console.log("进入examDAta");
                const examData = {
                    Ename: values.ExamName,
                    EtotalScore: this.state.getTotalScore,
                    EtotalTime: values.EtotalTime,
                    Tid: this.state.Teacher.Tid,
                }
                // console.log('结束===========');
                // console.log("values==========", values)
                // console.log("试卷信息：", examData);
                axios({
                    baseURL: 'http://localhost:8080/OnlineEducation',
                    method: 'post',
                    url: '/ExamProblemConteoller/insertExam',
                    params: examData,
                    data: getPidArray
                }).then(resp => {
                    if (resp.data.arg1 === "发布成功") {
                        this.props.history.push('/teacher/handfinishPaper')
                    }
                    console.log("进入了");
                }).catch(err => console.log(err))
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { getSChoiceData, getMChoiceData, getCompletionData, getSAnswerData } = this.state;
        let SCtotalScore = 0
        let MCtotslScore = 0
        let ComtotalScore = 0
        let SAtotalScore = 0
        getSChoiceData.forEach((Element) => {
            SCtotalScore += Element.pscore
        })
        getMChoiceData.forEach((Element) => {
            MCtotslScore += Element.pscore
        })
        getCompletionData.forEach((Element) => {
            ComtotalScore += Element.pscore
        })
        getSAnswerData.forEach((Element) => {
            SAtotalScore += Element.pscore
        })

        let totalScore = SCtotalScore + MCtotslScore + ComtotalScore + SAtotalScore
        return (
            <div>
                <Divider orientation="left" >单选题({getSChoiceData.length}道，<Tag color="blue">分值：{SCtotalScore}分</Tag>)</Divider>

                {
                    getSChoiceData.map((item) => {
                        return (
                            <div key={item.key}>
                                <p>{item.title}</p>
                                <Radio.Group value={item.prightAnswer}>
                                    {
                                        item.pchoiceAnswer.map((value, index) => {
                                            return <Radio key={value + index} value={value}>{value}</Radio>
                                        })
                                    }
                                </Radio.Group>
                                <Button size='small' shape="circle" className="button_position"><Icon type="arrow-up" /></Button>
                                <Button size='small' shape="circle" className="button_position"><Icon type="arrow-down" /></Button>
                                <Divider dashed="true" />
                            </div>
                        )
                    })
                }
                <Divider orientation="left">多选题({getMChoiceData.length}道，<Tag color="blue">分值：{MCtotslScore}分</Tag>)</Divider>
                {
                    getMChoiceData.map((item) => {
                        return (
                            <div key={item.key}>
                                <p>{item.title}</p>
                                <Checkbox.Group value={item.prightAnswer}>
                                    {
                                        item.pchoiceAnswer.map((value, index) => {
                                            return <Checkbox key={value + index} value={value}>{value}</Checkbox>
                                        })
                                    }
                                </Checkbox.Group>
                                <Button size='small' shape="circle" className="button_position"><Icon type="arrow-up" /></Button>
                                <Button size='small' shape="circle" className="button_position"><Icon type="arrow-down" /></Button>
                                <Divider dashed="true" />
                            </div>
                        )
                    })
                }
                <Divider orientation="left">填空题({getCompletionData.length}道，<Tag color="blue">分值：{ComtotalScore}分</Tag>)</Divider>
                {
                    getCompletionData.map((item) => {
                        return (
                            <div key={item.key}>
                                <p>{item.title}</p>
                                <Text disabled>答案：</Text>
                                <Text code>{item.prightAnswer}</Text>
                                <Button size='small' shape="circle" className="button_position"><Icon type="arrow-up" /></Button>
                                <Button size='small' shape="circle" className="button_position"><Icon type="arrow-down" /></Button>
                                <Divider dashed="true" />
                            </div>
                        )
                    })
                }
                <Divider orientation="left" >简答题({getSAnswerData.length}道，<Tag color="blue">分值：{SAtotalScore}分</Tag>)</Divider>
                {
                    getSAnswerData.map((item) => {
                        return (
                            <div key={item.key}>
                                <p>{item.title}</p>
                                <Text disabled>答案：</Text>
                                <br />
                                <p editable={{ onChange: this.onChangeTitle }} rows={10} style={{ width: '80% ' }}>{item.prightAnswer}</p>
                                <Button size='small' shape="circle" className="button_position"><Icon type="arrow-up" /></Button>
                                <Button size='small' shape="circle" className="button_position"><Icon type="arrow-down" /></Button>
                                <Divider dashed="true" />
                            </div>
                        )
                    })
                }
                <Button onClick={this.finish}>确认生成</Button>
                <Modal
                    title="生成试卷"
                    visible={this.state.ModalVisible}
                    onOk={this.handleSubmit}
                    onCancel={() => { this.setState({ ModalVisible: false }) }}
                    keyboard={true}
                    bodyStyle={{ width: '600px' }}
                    width={600}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label="请输入试卷的名称">
                            {getFieldDecorator('ExamName', {
                                rules: [{ required: true, message: 'Please input the name of exam!' }],
                            })(
                                <Input
                                    placeholder="ExamName"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="请输入试卷完成时间（分钟）">
                            {getFieldDecorator('EtotalTime', {
                                initialValue: 100,
                                rules: [{ required: true, message: 'Please input the Score of exam!' }],
                            })(
                                <InputNumber min={0} max={200} />,
                            )}
                        </Form.Item>
                        <Tag color="blue">分值：{totalScore}分</Tag>
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(PublishExam)