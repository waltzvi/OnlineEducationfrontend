import React, { Component } from 'react'
import { Layout, Menu, Icon, Avatar } from 'antd';
import { Link, Route, Redirect } from 'react-router-dom'
import video from './show-view/video'
import test from './show-problem/text'
import takeTheExam from './show-problem/takeTheExam/takeTheExam'
import VideoDetail from './show-view/VideoDetail/VideoDetail'
import './show.css'
import memoryUtils from '../../utils/memoryUtils';
import axios from 'axios';

const { Header, Content, Sider } = Layout;
export default class show extends Component {
    state = {
        Student: memoryUtils.User,
        Sname: ''
    }
    componentDidMount() {
        const { Student } = this.state
        const student = {
            Sid: Student.Sid,
            type: 'Student'
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/StudentController/findBySid',
            params: student
        }).then(resp => {
            // console.log(resp.data.tname, '==========');
            this.setState({ Sname: resp.data.sname })
        })
    }
    render() {
        if (!memoryUtils.User || !memoryUtils.User.Sid) {
            return <Redirect to='/login' />
        }
        const { Sname } = this.state
        return (
            <div className="show-box">
                <Layout style={{ height: '100%', width: '100%' }}>
                    <Header className="header" height={900}>
                        <div className="logo" />
                        <h1>
                            <Icon type="read" className="header-read" /> 线上教育系统 <Icon type="read" className="header-read" />
                            <Link to="/student" className="header-user" ><Avatar size={50} icon="user" />{Sname}个人中心</Link>
                        </h1>

                    </Header>
                    <Layout style={{ padding: '24px 24px' }}>
                        <Sider width={200} style={{ background: '#fff' }}>
                            <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                                <Menu.Item key="1">
                                    <Link to="/show/video">
                                        <Icon type="play-circle" />
                                        <span>视频</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to="/show/test">
                                        <Icon type="form" />
                                        <span>习题</span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '0 24px ' }}>

                            <Content
                                style={{
                                    background: '#fff',
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 8000,
                                }}
                            >
                                <Route path="/show/video" component={video} />
                                <Route path="/show/test" component={test} />
                                <Route path="/show/takeTheExam" component={takeTheExam} />
                                <Route path="/show/VideoDetail" component={VideoDetail} />
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>,

            </div >
        )
    }
}
