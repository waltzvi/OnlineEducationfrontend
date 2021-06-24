import axios from 'axios'
import React, { Component } from 'react'
import { List, Avatar, Icon, Button, Modal, Tag, Form, InputNumber, message } from 'antd';

class markWork extends Component {
    state = {
        getPid: '',
        getAid: '',
        getSid: '',
        getNoMark: [],
        getProblem: [],
        visible: false,
    }
    componentDidMount() {
        const { Eid } = this.props.location.state

        const ExamProblem = {
            Eid: Eid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/ExamProblemConteoller/findProblemByEid',
            params: ExamProblem
        }).then(resp => {
            let Problem = []
            resp.data.forEach(element => {
                if (element.ptype === '简答题') {
                    Problem.push({
                        key: element.pid,
                        title: element.ptitle,
                        rightAnswer: element.prightAnswer,
                        score: element.pscore
                    })
                }
            });
            this.setState({
                getProblem: Problem
            })
        })
        const AnswerPerson = {
            Eid: Eid,
            IsTrue: 3
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/AnswerPersonController/findByIsTrueAndEid',
            params: AnswerPerson
        }).then(resp => {
            let NoMark = []
            resp.data.forEach(element => {
                NoMark.push({
                    key: element.aid,
                    pid: element.pid,
                    YourAnswer: element.ayourAnswer,
                    Sid: element.sid,
                })
            });
            this.setState({
                getNoMark: NoMark
            })
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { Eid } = this.props.location.state
                let getscore = values.score
                const { getPid, getAid, getSid } = this.state
                const AnswerPerson = {
                    Aid: getAid,
                    Pid: getPid,
                    GetScore: getscore,
                    IsTrue: '2'
                }
                const TotalPersonExam = {
                    Sid: getSid,
                    Eid: Eid,
                }
                axios({
                    baseURL: 'http://localhost:8080/OnlineEducation',
                    method: 'post',
                    url: '/TotalPersonExamController/updatePersonScore',
                    params: TotalPersonExam,
                    data: AnswerPerson
                }).then(resp => {
                    const { getNoMark } = this.state
                    if (resp.data.arg1 === '评分成功') {
                        //如果最后的未评试卷数为0，那么直接跳转到试卷页
                        if (getNoMark.length - 1 === 0) {
                            this.props.history.push('/teacher/papers')
                            message.success('您已评完答卷!')
                        }
                        else this.componentDidMount()

                    } else {
                        console.log('评分失败');
                    }
                })
            }
        })
        this.setState({ visible: false })
    }
    getID = item => {
        return () => {
            this.setState({ visible: true })
            this.setState({ getPid: item.pid, getAid: item.key, getSid: item.Sid })
        }
    }

    render() {
        const listData = [];
        for (let i = 0; i < 23; i++) {
            listData.push({
                href: 'http://ant.design',
                title: `ant design part ${i}`,
                avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                description:
                    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
                content:
                    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
            });
        }

        const IconText = ({ type, text }) => (
            <span>
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
            </span>
        );
        const { getNoMark, getProblem } = this.state
        // console.log(this.props);
        for (let i = 0; i < getNoMark.length; i++) {
            for (let j = 0; j < getProblem.length; j++) {
                if (getNoMark[i].pid === getProblem[j].key) {
                    getNoMark[i] = {
                        key: getNoMark[i].key,
                        Sid: getNoMark[i].Sid,
                        pid: getNoMark[i].pid,
                        YourAnswer: getNoMark[i].YourAnswer,
                        title: getProblem[j].title,
                        rightAnswer: getProblem[j].rightAnswer,
                        score: getProblem[j].score
                    }
                }
            }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={getNoMark}
                    footer={
                        <div>
                            <b>ant design</b> footer part
                        </div>
                    }
                    renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText type="star-o" text="156" key="list-vertical-star-o" />,
                                <IconText type="like-o" text="156" key="list-vertical-like-o" />,
                                <IconText type="message" text="2" key="list-vertical-message" />,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={item.title}
                                description={<Button onClick={this.getID(item)}>评分</Button>}
                            />
                            <Modal
                                width='800px'
                                title="评分"
                                visible={this.state.visible}
                                onOk={this.handleSubmit}
                                onCancel={() => this.setState({ visible: false })}
                                okText="提交"
                                cancelText="取消"
                            >
                                <div>
                                    <p>题目：{item.title}</p>
                                    <Tag color="blue">
                                        <div style={{ whiteSpace: 'normal' }}>参考答案：{item.rightAnswer}</div>
                                    </Tag>

                                    <Tag color="geekblue">本题分值：{item.score}</Tag>
                                    <br />
                                    <p>学生答案：{item.YourAnswer}</p>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Item label="本题得分">
                                            {
                                                getFieldDecorator('score', {
                                                    rules: [{ required: true, message: 'Please input the score!' }],
                                                    initialValue: '0'
                                                })(
                                                    <InputNumber min={0} max={item.score} />
                                                )
                                            }
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Modal>
                            {item.content}
                        </List.Item>
                    )}
                />,
            </div>
        )
    }
}
export default Form.create()(markWork)
