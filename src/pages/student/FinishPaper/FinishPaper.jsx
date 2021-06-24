import React, { Component } from 'react'
import { List, Avatar, Tag, Divider } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios'
import memoryUtils from '../../../utils/memoryUtils';

export default class FinishPaper extends Component {
    state = {
        getHadFinishExam: '',
        Student: memoryUtils.User
    }
    componentDidMount() {
        console.log('componentDidMount-----------------');
        const data = {
            Sid: this.state.Student.Sid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/TotalPersonExamController/findDoneBySid',
            params: data
        }).then(resp => {
            let getDoneExam = []
            resp.data.forEach(item => {
                getDoneExam.push({
                    key: item.eid,
                    title: item.ename,
                    examid: item.eid,
                })
            });
            this.setState({
                getHadFinishExam: getDoneExam,
            })
        })
    }
    render() {
        return (
            <div>
                <Divider >已做过习题</Divider>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.getHadFinishExam}
                    renderItem={item => (
                        <List.Item >
                            <List.Item.Meta
                                avatar={<Avatar src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2233604842,3327046487&fm=26&gp=0.jpg" />}
                                title={<Tag ><Link to={{ pathname: '/student/PersonPaperDetail', state: { eid: item.examid, etitle: item.title } }}>{item.title}</Link></Tag>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />,
            </div>
        )
    }
}
