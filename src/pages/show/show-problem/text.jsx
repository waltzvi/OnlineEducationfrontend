import React, { Component } from 'react'
import { Input, List, Icon, Avatar, Tag } from 'antd';
import { Link } from 'react-router-dom'
import axios from 'axios'
import './text.css'

const { Search } = Input;

export default class text extends Component {
    state = {
        AllExam: [],
    }
    componentDidMount() {
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/ExamController/findAllExam',
        }).then(resp => {
            console.log("resp的值", resp)
            console.log("resp.data的值", resp.data)
            let getPapersData = []
            resp.data.forEach(item => {
                console.log("时间：", item.etotalTime)
                getPapersData.push({
                    id: item.eid,
                    title: item.ename,
                    totalTime: item.etotalTime,
                })
            });
            this.setState({ AllExam: getPapersData })
        })

    }
    searchText = value => {

        const exam = {
            Ename: value
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/ExamController/findByEname',
            params: exam
        }).then(resp => {
            let getSearch = []
            //console.log('模糊查询', resp.data);
            resp.data.forEach(item => {
                getSearch.push({
                    id: item.eid,
                    title: item.ename,
                    totalTime: item.etotalTime,
                })
            })
            this.setState({ AllExam: getSearch })
        })
    }
    render() {
        const { AllExam } = this.state
        const IconText = ({ type, text }) => (
            <span>
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
            </span>
        );
        return (
            <div className='text-box'>
                <Search className="text-search"
                    placeholder="请输入搜索内容"
                    onSearch={value => this.searchText(value)}
                />
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 8,
                    }}
                    dataSource={AllExam}
                    footer={
                        <div>
                            <b>ant design</b> footer part
                        </div>
                    }
                    renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <IconText type="star-o" text="190" key="list-vertical-star-o" />,
                                <IconText type="like-o" text="156" key="list-vertical-like-o" />,
                                <IconText type="message" text="2" key="list-vertical-message" />,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2233604842,3327046487&fm=26&gp=0.jpg" />}
                                title={<Tag ><Link to={{ pathname: '/show/takeTheExam', state: { eid: item.id, etitle: item.title, etime: item.totalTime } }}>{item.title}</Link></Tag>}

                            />
                        </List.Item>
                    )}
                />,
            </div>
        )
    }
}
