import React, { Component } from 'react'
import { Table, Button, Modal, Badge, Icon, Statistic, Card, Row, Col, Tag } from 'antd';
import axios from 'axios'
import memoryUtils from '../../../../utils/memoryUtils';


export default class Papers extends Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        visible: false,
        detail: '',
        getExamData: [],
        excellent: '',//优
        good: '',//良
        pass: '',//及格
        fail: '',//不及格
        Teacher: memoryUtils.User,
        Eid: ''
    };

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    };

    ShowDetail = detail => {
        return () => {
            console.log("detail的值", detail.ID);
            this.setState({ visible: true, detail })
            const getTotalPersonExam = {
                Eid: detail.ID
            }
            this.setState({ Eid: detail.ID })
            axios({
                baseURL: 'http://localhost:8080/OnlineEducation',
                method: 'get',
                url: '/TotalPersonExamController/findByEid',
                params: getTotalPersonExam
            }).then(resp => {
                let personPaperScore = []
                let excellent = 0
                let good = 0
                let pass = 0
                let fail = 0
                resp.data.forEach(item => {
                    personPaperScore.push({
                        YourScore: item.yourTotalScore,
                        ExamScore: item.etotalScore,
                    })
                    if (((item.yourTotalScore) / (item.etotalScore)) >= 0.9) {
                        console.log("优秀");
                        excellent++;
                    } else if (((item.yourTotalScore) / (item.etotalScore)) >= 0.8 && ((item.yourTotalScore) / (item.etotalScore)) <= 0.9) {
                        console.log("良好");
                        good++;
                    } else if (((item.yourTotalScore) / (item.etotalScore)) >= 0.6 && ((item.yourTotalScore) / (item.etotalScore)) <= 0.8) {
                        console.log("及格");
                        pass++;
                    } else if (((item.yourTotalScore) / (item.etotalScore)) <= 0.6) {
                        console.log("不及格");
                        fail++;
                    }
                    this.setState({
                        excellent, good, pass, fail
                    })
                    console.log("item", item);
                })
            })
        }
    }
    componentDidMount() {
        const findData = {
            Tid: this.state.Teacher.Tid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/ExamController/findByTid',
            params: findData
        }).then(resp => {
            console.log("resp的值", resp)
            console.log("resp.data的值", resp.data)
            let getPapersData = []
            resp.data.ExamList.forEach((item, index) => {
                getPapersData.push({
                    key: item.eid,
                    title: item.ename,
                    detail: { ID: item.eid, Badge: resp.data.BadgeList[index] },

                })
            });
            console.log(getPapersData);
            this.setState({ getExamData: getPapersData })
        })

    }
    findTheDetail = () => {
        this.setState({ visible: false })
        this.props.history.push({
            pathname: '/teacher/markWork',
            state: { Eid: this.state.Eid }
        })
    }
    render() {
        const { loading, selectedRowKeys, getExamData, excellent, good, pass, fail } = this.state;
        const all = excellent + good + pass + fail
        const exe = (excellent / all) * 100
        const go = (good / all) * 100
        const pa = (pass / all) * 100
        const fa = (fail / all) * 100
        const rowSelection = {
            selectedRowKeys,
            onChange: () => { this.setState({ selectedRowKeys }) },
        };
        const hasSelected = selectedRowKeys.length > 0;

        const columns = [
            {
                title: '试卷',
                dataIndex: 'title',
            },

            {
                title: '详情',
                dataIndex: 'detail',
                render: detail => {
                    return (
                        <div>
                            <Badge count={detail.Badge}>
                                <Button onClick={this.ShowDetail(detail)}>
                                    <Icon type="line-chart" />
                                    答卷详情
                                </Button>
                            </Badge>
                        </div>
                    )
                }
            },

        ];

        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading} ghost>
                        删除
                    </Button>

                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>

                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={getExamData} />
                <Modal
                    width='800px'
                    title="答卷详情"
                    visible={this.state.visible}
                    onOk={this.findTheDetail}
                    onCancel={() => this.setState({ visible: false })}
                    okText="查看未评信息"
                    cancelText="取消"
                >
                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Row gutter={19}>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="优秀"
                                        value={exe}
                                        precision={2}
                                        valueStyle={{ color: '#3f8600' }}
                                        // prefix={<Icon type="arrow-up" />}
                                        suffix="%"
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="良好"
                                        value={go}
                                        precision={2}
                                        valueStyle={{ color: '#cf1322' }}
                                        // prefix={<Icon type="arrow-down" />}
                                        suffix="%"
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="及格"
                                        value={pa}
                                        precision={2}
                                        valueStyle={{ color: '#3f8600x' }}
                                        // prefix={<Icon type="arrow-down" />}
                                        suffix="%"
                                    />
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Statistic
                                        title="不及格"
                                        value={fa}
                                        precision={2}
                                        valueStyle={{ color: '#cf1322' }}
                                        // prefix={<Icon type="arrow-down" />}
                                        suffix="%"
                                    />
                                </Card>
                            </Col>
                        </Row>

                    </div>
                    <br />
                    <Tag>优秀：总分的90%以上</Tag>
                    <Tag>良好：总分的80%~90%</Tag>
                    <Tag>及格：总分的60%~80%</Tag>
                    <Tag>不及格：总分的低于60%</Tag>
                </Modal>

            </div >
        );
    }
}
