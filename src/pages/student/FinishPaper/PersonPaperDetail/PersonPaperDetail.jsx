import axios from 'axios';
import React, { Component } from 'react'
import { Radio, Checkbox, Divider, Typography, Form, Tag } from 'antd';
import memoryUtils from '../../../../utils/memoryUtils';

const { Text } = Typography;
export default class PersonPaperDetail extends Component {
    state = {
        Student: memoryUtils.User,
        getSChoiceData: [],
        getMChoiceData: [],
        getCompletionData: [],
        getSAnswerData: [],
        getAnswerPerson: [],
        totalScore: '',
        YourTotalScore: '',
    }

    componentDidMount() {
        const { eid } = this.props.location.state;
        var getEid = eid
        const EidData = {
            Eid: getEid
        }
        const FindStuExam = {
            Eid: getEid,
            Sid: this.state.Student.Sid,
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/TotalPersonExamController/findBySidSndEid',
            params: FindStuExam
        }).then(resp => {
            let EtotalScore = resp.data.etotalScore
            let YourTotalScore = resp.data.yourTotalScore
            this.setState({
                totalScore: EtotalScore,
                YourTotalScore: YourTotalScore
            })
        })
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/AnswerPersonController/findBySidAndEid',
            params: FindStuExam
        }).then(resp => {
            console.log("findBySidAndEid resp的值", resp)
            console.log("findBySidAndEid resp.data的值", resp.data)
            let GetAnswerPerson = []
            resp.data.forEach(item => {
                GetAnswerPerson.push({
                    key: item.pid,
                    AyourAnswer: item.ayourAnswer,
                    GetScore: item.getScore,
                    IsTrue: item.isTrue
                })
                this.setState({ getAnswerPerson: GetAnswerPerson })
            })
        });
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/ExamProblemConteoller/findProblemByEid',
            params: EidData
        }).then(resp => {
            console.log("findProblemByEid resp的值", resp)
            console.log("findProblemByEid resp.data的值", resp.data)
            let getAll = []
            console.log("this.state.getAnswerPerson", this.state.getAnswerPerson)
            resp.data.forEach((item) => {
                this.state.getAnswerPerson.forEach((element) => {
                    if (item.pid === element.key) {
                        getAll.push({
                            key: item.pid,
                            title: item.ptitle,
                            ptype: item.ptype,
                            pchoiceAnswer: item.pchoiceAnswer.split("&"),
                            prightAnswer: item.prightAnswer,
                            pscore: item.pscore,
                            AyourAnswer: element.AyourAnswer,
                            GetScore: element.GetScore,
                            status: element.IsTrue,
                        })
                    }
                })
            })
            console.log("getAll", getAll)
            let getSChoiceData = []
            let getMChoiceData = []
            let getCompletionData = []
            let getSAnswerData = []
            getAll.forEach(element => {
                if (element.ptype === '单选题') {
                    getSChoiceData.push(element)
                } else if (element.ptype === '多选题') {
                    element.AyourAnswer = element.AyourAnswer.split("&")
                    getMChoiceData.push(element)
                } else if (element.ptype === '填空题') {
                    getCompletionData.push(element)
                } else if (element.ptype === '简答题') {
                    getSAnswerData.push(element)
                }
            })
            this.setState({ getSChoiceData, getMChoiceData, getCompletionData, getSAnswerData })
        });
    }
    render() {
        const { eid, etitle } = this.props.location.state;
        const { getSChoiceData, getMChoiceData, getCompletionData, getSAnswerData, totalScore, YourTotalScore } = this.state;
        return (
            <div>
                <h1>试卷名称：{etitle}</h1>
                <h1>试卷ID：{eid}</h1>
                <Tag color="magenta">你的分数：{YourTotalScore}</Tag>
                <Tag>总分：{totalScore}</Tag>
                <Form>
                    <Divider orientation="left" >单选题({getSChoiceData.length}道)</Divider>
                    {
                        getSChoiceData.map((item, index) => {
                            return (
                                <div key={item.key}>
                                    <p>题目：{item.title}</p>
                                    <Text disabled>你的答案：</Text>
                                    <Radio.Group value={item.AyourAnswer}>
                                        {
                                            item.pchoiceAnswer.map((value, index) => {
                                                return <Radio key={value + index} value={value}>{value}</Radio>
                                            })
                                        }
                                    </Radio.Group>
                                    <Text disabled>正确答案：{item.prightAnswer}</Text><br /><br />
                                    <Tag color="blue">你的得分：{item.GetScore}</Tag>
                                    <Divider dashed="true" />
                                </div>
                            )
                        })
                    }
                    <Divider orientation="left">多选题({getMChoiceData.length}道)</Divider>
                    {
                        getMChoiceData.map((item, index) => {
                            return (
                                <div key={item.key}>
                                    <p>题目：{item.title}</p>
                                    <Text disabled>你的答案：</Text>
                                    <Checkbox.Group value={item.AyourAnswer}>
                                        {
                                            item.pchoiceAnswer.map((value, index) => {
                                                return <Checkbox key={value + index} value={value}>{value}</Checkbox>
                                            })
                                        }
                                    </Checkbox.Group>
                                    <Text disabled>正确答案：{item.prightAnswer}</Text><br /><br />
                                    <Tag color="blue">你的得分：{item.GetScore}</Tag>
                                    <Divider dashed="true" />
                                </div>
                            )
                        })
                    }
                    <Divider orientation="left">填空题({getCompletionData.length}道)</Divider>
                    {
                        getCompletionData.map((item, index) => {
                            return (
                                <div key={item.key}>
                                    <p>题目：{item.title}</p>
                                    <Text disabled>你的答案：</Text>
                                    <Tag >{item.AyourAnswer}</Tag><br /><br />
                                    <Text disabled>正确答案：{item.prightAnswer}</Text><br /><br />
                                    <Tag color="blue">你的得分：{item.GetScore}</Tag>
                                    <Divider dashed="true" />
                                </div>
                            )
                        })
                    }
                    <Divider orientation="left" >简答题({getSAnswerData.length}道)</Divider>
                    {
                        getSAnswerData.map((item) => {
                            return (
                                <div key={item.key}>
                                    <p>题目：{item.title}</p>
                                    <Text disabled>你的答案：</Text>
                                    <Tag >{item.AyourAnswer}</Tag><br /><br />
                                    {(
                                        item.status === 3 ? (
                                            <div>
                                                <Text disabled>正确答案：{item.prightAnswer}</Text><br /><br />
                                                <Tag color="magenta">教师还未做出评分</Tag>
                                            </div>
                                        ) : (
                                            <div>
                                                <Text disabled>正确答案：{item.prightAnswer}</Text><br /><br />
                                                <Tag color="blue">你的得分：{item.GetScore}</Tag>
                                            </div>
                                        )
                                    )}
                                    <Divider dashed="true" />
                                </div>
                            )
                        })
                    }
                </Form>
            </div>
        )
    }
}
