import { Layout, Menu, Icon, Modal, message } from 'antd';
import React from 'react';
import { Link, Route, Redirect } from 'react-router-dom'
import mcquestion from './teacher-putProblem/Mutiple-choice-questions/MCquestions2'
import completion from './teacher-putProblem/Completion/completion'
import saquestion from './teacher-putProblem/Short-answer-question/SAquestion'
import hadput from './teacher-putProblem/HadPut/Hadput'
import papers from './papers/teacher-markPapers/markPapers'
import scquestion2 from './teacher-putProblem/Single-choice-questions/SCquestion2'
import publishPapers from './papers/publishPapers/publishPapers'
import handfinishPaper from './papers/hadfinishPaper/handfinishPaper'
import PaperDetail from './papers/hadfinishPaper/PaperDetail/PaperDetail'
import PublishExam from './teacher-putProblem/HadPut/PublishExam/PublishExam'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import publishVideo from './video/publishVideo'
import HadPutVideo from './video/HadPutVideo/HadPutVideo'
import markWork from './papers/teacher-markPapers/markWork/markWork'
import watchVideo from './video/watchVideo/watchVideo';


import './teacher.css'
import axios from 'axios';


const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

class teacher extends React.Component {
    state = {
        collapsed: false,
        Teacher: memoryUtils.User,
        Tname: ''
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    removeStudent = () => {
        Modal.confirm({
            content: '确认退出吗',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                memoryUtils.User = {};
                storageUtils.removeUser();
                this.props.history.replace('/login')
            }
        });
    }
    componentDidMount() {
        const teacher = {
            Tid: this.state.Teacher.Tid,
            type: 'Teacher'
        }
        console.log(teacher);
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/TeacherController/findByTid',
            params: teacher
        }).then(resp => {
            resp.data.tid && this.setState({ Tname: resp.data.tname })
        }).catch(err => message.error(err))
    }
    render() {
        if (!memoryUtils.User || !memoryUtils.User.Tid) {
            return <Redirect to='/login' />
        }
        const { Tname } = this.state
        return (
            <div className='teacher-box'>
                <Layout style={{ height: '100%', width: '100%' }}>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed} theme="dark">
                        <div className="logo" >欢迎您，{Tname}</div>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <SubMenu
                                key="1"
                                title={
                                    <span>
                                        <Icon type="file-text" />
                                        <span>发布题目</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="5"><Link to="/teacher/scquestion2">单选题</Link></Menu.Item>
                                <Menu.Item key="6"><Link to="/teacher/mcquestion">多选题</Link></Menu.Item>
                                <Menu.Item key="7"><Link to="/teacher/completion">填空题</Link></Menu.Item>
                                <Menu.Item key="8"><Link to="/teacher/saquestion">简答题</Link></Menu.Item>
                                <Menu.Item key="9"><Link to="/teacher/hadput">已发布</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="2"
                                title={
                                    <span>

                                        <Icon type="check-square" />
                                        <span>试卷</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="10"><Link to="/teacher/papers">评卷</Link></Menu.Item>
                                <Menu.Item key="11"><Link to="/teacher/publishPapers">发布试卷</Link></Menu.Item>
                                <Menu.Item key="12"><Link to="/teacher/handfinishPaper">已发布试卷</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu
                                key="3"
                                title={
                                    <span>
                                        <Icon type="video-camera" />
                                        <span>视频</span>
                                    </span>
                                }>
                                <Menu.Item key="13">
                                    <Link to="/teacher/publishVideo">
                                        <span>发布视频</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="14">
                                    <Link to="/teacher/HadPutVideo">
                                        <span>已发布视频</span>
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                            <Menu.Item key='15'>
                                <Icon type="user-delete" />
                                <span onClick={this.removeStudent}>注销账号</span>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#001529', padding: 0 }}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                background: '#fff',
                                minHeight: 2000,
                            }}
                        >
                            <Route path="/teacher/scquestion2" component={scquestion2}></Route>
                            <Route path="/teacher/mcquestion" component={mcquestion}></Route>
                            <Route path="/teacher/completion" component={completion}></Route>
                            <Route path="/teacher/saquestion" component={saquestion}></Route>
                            <Route path="/teacher/hadput" component={hadput}></Route>
                            <Route path="/teacher/papers" component={papers}></Route>
                            <Route path="/teacher/publishPapers" component={publishPapers}></Route>
                            <Route path="/teacher/handfinishPaper" component={handfinishPaper}></Route>
                            <Route path="/teacher/PaperDetail" component={PaperDetail}></Route>
                            <Route path="/teacher/publishExam" component={PublishExam}></Route>
                            <Route path="/teacher/publishVideo" component={publishVideo}></Route>
                            <Route path="/teacher/HadPutVideo" component={HadPutVideo}></Route>
                            <Route path="/teacher/markWork" component={markWork}></Route>
                            <Route path="/teacher/watchVideo" component={watchVideo}></Route>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default teacher