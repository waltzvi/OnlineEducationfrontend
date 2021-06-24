import React, { Component } from 'react'
import axios from 'axios'
import { Form, Checkbox, Divider, Tag, Input, Button, PageHeader, Radio, Modal, message } from 'antd';
import memoryUtils from '../../../../utils/memoryUtils'
import CountDown from '../CountDown/CountDown'

const { TextArea } = Input;
class takeTheExam extends Component {
    state = {
        showSChoice: [],
        showMChoice: [],
        showSAnswer: [],
        showCompletion: [],
        Etitle: '',
        Etime: '',
        visible: false,
        Exam: memoryUtils.Exam,
        Student: memoryUtils.User,
        useTime: '',                     //学生做题时间
        startVisible: false
    }


    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
        this.handleSubmit(e);
        this.onFinish();
    };

    componentDidMount() {
        const { eid, etitle, etime } = this.props.location.state;
        var getEid = eid
        const EidData = {
            Eid: getEid
        }
        this.setState({ Etitle: etitle, Etime: etime })
        const totalPersonExam = {
            Sid: this.state.Student.Sid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/TotalPersonExamController/findDoneBySid',
            params: totalPersonExam
        }).then(resp1 => {
            console.log(resp1, '================+');
            let type = 0
            resp1.data.forEach((element) => {
                if (element.eid === getEid) {
                    type = 1
                }
            })
            console.log(type);
            if (type === 1) {
                this.setState({ startVisible: true })
                // this.props.history.push('/teacher')
            } else {
                axios({
                    baseURL: 'http://localhost:8080/OnlineEducation',
                    method: 'get',
                    url: '/ExamProblemConteoller/findProblemByEid',
                    params: EidData
                }).then(resp => {
                    //获取到的每个题目的详细信息
                    let showSChoiceDetail = []
                    let showMChoiceDetail = []
                    let showSAnswerDetail = []
                    let showCompletionDetail = []
                    //遍历所有题目，将不同题型进行分离
                    resp.data.forEach(item => {
                        if (item.ptype === '单选题') {
                            showSChoiceDetail.push({
                                key: item.pid,
                                title: item.ptitle,
                                //将可选择的答案进行分离，通过符号“&”分开放入数组
                                pchoiceAnswer: item.pchoiceAnswer.split("&"),
                                prightAnswer: item.prightAnswer,
                                pscore: item.pscore,
                            })
                        } else if (item.ptype === '多选题') {
                            showMChoiceDetail.push({
                                key: item.pid,
                                title: item.ptitle,
                                pchoiceAnswer: item.pchoiceAnswer.split("&"),
                                prightAnswer: item.prightAnswer.split("&"),
                                pscore: item.pscore,
                            })
                        } else if (item.ptype === '简答题') {
                            showSAnswerDetail.push({
                                key: item.pid,
                                title: item.ptitle,
                                prightAnswer: item.prightAnswer,
                                pscore: item.pscore,
                            })
                        } else if (item.ptype === '填空题') {
                            showCompletionDetail.push({
                                key: item.pid,
                                title: item.ptitle,
                                prightAnswer: item.prightAnswer,
                                pscore: item.pscore,
                            })
                        }
                    });
                    this.setState({
                        showSChoice: showSChoiceDetail,
                        showMChoice: showMChoiceDetail,
                        showCompletion: showCompletionDetail,
                        showSAnswer: showSAnswerDetail,
                    })
                })
            }
        })
    }

    handleSubmit = e => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const ObjName = Object.keys(values)
                const ObjValue = Object.values(values)
                const a = []
                let getSid = this.state.Student.Sid
                console.log("sid", getSid)
                const { eid } = this.props.location.state
                for (let i = 0; i < ObjName.length; i++) {
                    let b = ''
                    //判断是否为数组
                    if (ObjValue[i] instanceof Array) {
                        b = ObjValue[i].join('&')
                    } else {
                        b = ObjValue[i]
                    }
                    a.push({
                        Sid: getSid,
                        Pid: ObjName[i],
                        Eid: eid,
                        AyourAnswer: b
                    })
                }
                const useTime = this.a.StopExam()
                console.log(useTime);
                const TotalPersonExam = {
                    UseTime: useTime
                }
                axios({
                    baseURL: 'http://localhost:8080/OnlineEducation',
                    method: 'post',
                    url: '/AnswerPersonController/insertAnswerPerson',
                    data: a,
                    params: TotalPersonExam
                }).then(resp => {
                    if (resp.data === 'a') {
                        message.success('提交成功')
                        this.props.history.push('/student/FinishPaper')
                    }
                }).catch(err => message.error(err.message))
            }
        })
        this.setState({
            visible: false,
        });
    }

    render() {
        const { showSChoice, showMChoice, showSAnswer, showCompletion, Etitle, Etime, startVisible } = this.state
        const { getFieldDecorator } = this.props.form;
        let getSCtotalPscore = 0
        let getMCtotalPscore = 0
        let getCompletionPscore = 0
        let getSAnswerPscore = 0
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <div>
                <Modal
                    title='请注意：'
                    visible={startVisible}
                    onCancel={() => this.props.history.push('/show')}
                    onOk={() => this.props.history.push('/show')}
                    okText='确认'
                >
                    <p>该试卷你已经做过了！！！</p>
                </Modal>
                <Form {...formItemLayout}>
                    <PageHeader
                        style={{
                            border: '1px solid rgb(235, 237, 240)',
                        }}
                        //onBack={() => null}
                        title={Etitle}
                        // subTitle={"完成时间：" + Etime + " min"}
                        subTitle={Etime ? <CountDown onRef={c => this.a = c} Etime={Etime} ></CountDown> : ''}
                    />
                    <Divider orientation="left" >单选题({showSChoice.length}道，{
                        showSChoice.forEach((item) => {
                            getSCtotalPscore = item.pscore + getSCtotalPscore
                        })
                    }<Tag color="blue">单选题总分：{getSCtotalPscore}分</Tag>)</Divider>
                    {
                        showSChoice.map((item) => {
                            return (
                                <div key={item.key}>
                                    <Form.Item >
                                        <p>{item.title}</p>
                                        {getFieldDecorator(`${item.key}`, {
                                            rules: [{ required: true }],
                                        })(
                                            <Radio.Group>
                                                {item.pchoiceAnswer.map((value) => {
                                                    return <Radio key={value} value={value}>{value}</Radio>
                                                })}
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                    <br />
                                    <Tag color="blue">分值：{item.pscore}</Tag>
                                    <Divider dashed="true" />
                                </div>
                            )
                        })
                    }
                    <Divider orientation="left" >多选题({showMChoice.length}道，{
                        showMChoice.forEach((item) => {
                            getMCtotalPscore = item.pscore + getMCtotalPscore
                        })
                    }<Tag color="blue">多选题总分：{getMCtotalPscore}分</Tag>)</Divider>
                    {
                        showMChoice.map((item) => {
                            return (
                                <div key={item.key}>
                                    <Form.Item >
                                        <p>{item.title}</p>
                                        {getFieldDecorator(`${item.key}`, {
                                            rules: [{ required: true }],
                                        })(
                                            <Checkbox.Group >
                                                {
                                                    item.pchoiceAnswer.map((value, index) => {
                                                        return <Checkbox key={value + index} value={value}>{value}</Checkbox>
                                                    })
                                                }
                                            </Checkbox.Group>
                                        )}
                                        <br />
                                        <Tag color="blue">分值：{item.pscore}</Tag>
                                    </Form.Item>
                                    <Divider dashed="true" />
                                </div>
                            )
                        })
                    }
                    <Divider orientation="left">填空题({showCompletion.length}道，{
                        showCompletion.forEach((item) => {
                            getCompletionPscore = item.pscore + getCompletionPscore
                        })
                    }<Tag color="blue">填空题总分：{getCompletionPscore}分</Tag>)</Divider>
                    {
                        showCompletion.map((item) => {
                            return (
                                <div key={item.key}>
                                    <Form.Item >
                                        <p>{item.title}</p>
                                        {getFieldDecorator(`${item.key}`, {
                                            rules: [{ required: true }],
                                        })(
                                            <Input placeholder="请输入你的答案"></Input>
                                        )}
                                        <br />
                                        <Tag color="blue">分值：{item.pscore}</Tag>
                                    </Form.Item>
                                    <Divider dashed="true" />
                                </div>
                            )
                        })
                    }
                    <Divider orientation="left">简答题({showSAnswer.length}道，{
                        showSAnswer.forEach((item) => {
                            getSAnswerPscore = item.pscore + getSAnswerPscore
                        })
                    }<Tag color="blue">简答题总分：{getSAnswerPscore}分</Tag>)</Divider>
                    {
                        showSAnswer.map((item) => {
                            return (
                                <div key={item.key}>
                                    <Form.Item >
                                        <p>{item.title}</p>
                                        {getFieldDecorator(`${item.key}`, {
                                            rules: [{ required: true }],
                                        })(
                                            <TextArea placeholder="请输入你的答案"></TextArea>
                                        )}
                                        <br />
                                        <Tag color="blue">分值：{item.pscore}</Tag>
                                    </Form.Item>
                                    <Divider dashed="true" />
                                </div>
                            )
                        })
                    }
                    <Divider orientation='center'>END</Divider>
                    <Form.Item {...formItemLayout}>
                        <Button type="primary" htmlType="submit" className="SCquestion-form-button" ghost onClick={() => this.setState({ visible: true })}>提交</Button>
                    </Form.Item>
                    <Modal
                        title="Basic Modal"
                        visible={this.state.visible}
                        onOk={this.handleSubmit}
                        onCancel={() => this.setState({ visible: false })}
                    >
                        <p>你确定要提交试卷吗?提交后你将无法修改答案！</p>
                    </Modal>
                    <Tag color="blue">本卷总分：{getSCtotalPscore + getMCtotalPscore + getCompletionPscore + getSAnswerPscore}分</Tag>
                </Form>
            </div >
        )
    }
}
export default Form.create()(takeTheExam)