import React, { Component } from 'react'
import axios from 'axios'
import { Radio, Checkbox, Divider, Typography } from 'antd';

const { Text } = Typography;
export default class PaperDetail extends Component {
    state = {
        getSChoiceData: [],
        getMChoiceData: [],
        getCompletionData: [],
        getSAnswerData: [],

    }



    onChange = str => {
        console.log('Content change:', str);
        this.setState({ str });
    };
    componentDidMount() {
        const { eid } = this.props.location.state;
        var getEid = eid
        const EidData = {
            Eid: getEid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/ExamProblemConteoller/findProblemByEid',
            params: EidData
        }).then(resp => {
            console.log("resp的值", resp)
            console.log("resp.data的值", resp.data)
            //console.log("resp.data里面的值", resp.data[1].ptitle)
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
        })
    }

    render() {
        // 接受state参数
        const { eid, etitle } = this.props.location.state;
        const { getSChoiceData, getMChoiceData, getCompletionData, getSAnswerData } = this.state;
        return (
            <div>
                <h1>{etitle}试卷细节</h1>
                <h1>试卷编号：{eid}</h1>
                <Divider orientation="left" >单选题({getSChoiceData.length}道)</Divider>
                {
                    getSChoiceData.map((item, index) => {
                        return (
                            <div key={item.key}>
                                {console.log("item的值：", item, "index的值", index)}
                                <p>{item.title}</p>
                                <Radio.Group value={item.prightAnswer}>
                                    {
                                        item.pchoiceAnswer.map((value, index) => {
                                            return <Radio key={value + index} value={value}>{value}</Radio>
                                        })
                                    }
                                </Radio.Group>
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
                                <p>{item.title}</p>
                                <Checkbox.Group value={item.prightAnswer}>
                                    {
                                        item.pchoiceAnswer.map((value, index) => {
                                            return <Checkbox key={value + index} value={value}>{value}</Checkbox>
                                        })
                                    }
                                </Checkbox.Group>
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
                                <p>{item.title}</p>
                                <Text disabled>答案：</Text>
                                <Text code>{item.prightAnswer}</Text>
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
                                <p>{item.title}</p>
                                <Text disabled>答案：</Text>
                                <p>{item.prightAnswer}</p>
                                <Divider dashed="true" />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
