import React, { Component } from 'react'
import { List, Avatar, Tag, Divider, Button, Modal, message } from 'antd';
import { Link } from 'react-router-dom'
import axios from 'axios'
import memoryUtils from '../../../../utils/memoryUtils';


export default class handfinishPaper extends Component {

    state = {
        getExamData: [],
        Teacher: memoryUtils.User
    }
    componentDidMount() {
        const data = {
            Tid: this.state.Teacher.Tid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/ExamController/findExamByTid',
            params: data
        }).then(resp => {
            let getAllExamData = []
            resp.data.forEach(item => {
                getAllExamData.push({
                    key: item.eid,
                    title: item.ename,
                    examid: item.eid,
                })
            });
            console.log(getAllExamData);
            this.setState({
                getExamData: getAllExamData,
            })
        })
    }
    deleteExam = (eid) => {

        return () => {
            const data = { Eid: eid }
            // const { getExamData } = this.state

            Modal.confirm({
                title: '确定删除吗？',
                onOk: () => {
                    axios({
                        baseURL: 'http://localhost:8080/OnlineEducation',
                        method: 'post',
                        url: '/ExamController/deleteByEid',
                        params: data
                    }).then(resp => {
                        if (resp.data.arg1 === '删除成功') {
                            message.success('删除成功')
                            const getExamData = this.state.getExamData
                            getExamData.splice(getExamData.findIndex(item => item.examid === eid), 1)
                            this.setState({ getExamData })
                        } else {
                            message.error('删除失败')
                        }
                    })
                },
                // onCancel: () => Modal.destroyAll,
                okText: '确定',
                cancelText: '取消',
                maskClosable: true
            })
        }
    }

    render() {
        return (
            <div>
                <Divider >已发布试卷</Divider>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.getExamData}
                    renderItem={item => (
                        <List.Item actions={[<Button type='danger' onClick={this.deleteExam(item.examid)}>删除</Button>]}>
                            <List.Item.Meta
                                avatar={<Avatar src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2233604842,3327046487&fm=26&gp=0.jpg" />}
                                title={<Tag ><Link to={{ pathname: '/teacher/PaperDetail', state: { eid: item.examid, etitle: item.title } }}>{item.title}</Link></Tag>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                            {/* <Button>修改</Button> */}
                        </List.Item>
                    )}
                />,
            </div>
        )
    }
}
