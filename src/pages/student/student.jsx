import { Layout, Menu, Icon, Modal } from 'antd';
import { Link, Route, Redirect } from 'react-router-dom'
import React from 'react';
import FinishPaper from './FinishPaper/FinishPaper'
import LookedVideo from './LookedVideo/LookedVideo'
import PersonPaperDetail from './FinishPaper/PersonPaperDetail/PersonPaperDetail'
import LookdeVideoDetail from './LookedVideo/LookedVideoDetail/LookedVideoDetail'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import './student.css'


const { Header, Sider, Content } = Layout;

export default class student extends React.Component {
    state = {
        collapsed: false,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    state = { visible: false };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
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

    render() {
        console.log(memoryUtils.User);
        if (!memoryUtils.User || !memoryUtils.User.Sid) {
            return <Redirect to='/login' />
        }
        return (
            <div className='student-box'>
                <Layout style={{ height: '100%', width: '100%' }}>
                    <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                        <div className="logo" />
                        {/* <div><Icon type="copy" /></div> */}
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                                <Link to="/show">
                                    <Icon type="arrow-left" />
                                    <span>返回首页</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/student/FinishPaper">
                                    <Icon type="copy" />
                                    <span>已做试卷</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/student/LookedVideo">
                                    <Icon type="youtube" />
                                    <span>已看视频</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Icon type="user-delete" />
                                <span onClick={this.removeStudent}>注销用户</span>
                            </Menu.Item>

                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#001529', padding: 0 }} >
                            <div >
                                <div>
                                    <Icon
                                        className="trigger"
                                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                        onClick={this.toggle}
                                    />

                                </div>
                            </div>
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                background: '#fff',
                                minHeight: 2000,
                            }}
                        >
                            <Route path="/student/FinishPaper" component={FinishPaper} />
                            <Route path="/student/LookedVideo" component={LookedVideo} />
                            <Route path="/student/PersonPaperDetail" component={PersonPaperDetail} />
                            <Route path="/student/LookedVideoDetail" component={LookdeVideoDetail} />
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}