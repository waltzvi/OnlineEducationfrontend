import React, { Component } from 'react'
import { Input, List, Icon, Avatar, Tag } from 'antd';
import { Link } from 'react-router-dom'
import axios from 'axios'
import memoryUtils from '../../../utils/memoryUtils';
import "./video.css"

const { Search } = Input;
export default class video extends Component {
    state = {
        StudentInfo: memoryUtils.User,
        AllVideo: []
    }
    componentDidMount() {
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/VideoController/findAllVideoTextPage',
            params: { Sid: this.state.StudentInfo.Sid }
        }).then(resp => {
            console.log("resp的值", resp)
            console.log("resp.data的值", resp.data)
            let getVideoData = []
            resp.data.forEach(item => {
                console.log("时间：", item.etotalTime)
                getVideoData.push({
                    key: item.vid,
                    vtitle: item.vname,
                    vdiscription: item.vdiscription,
                    vpath: item.vpath,
                })
            });
            this.setState({ AllVideo: getVideoData })
        })
    }
    searchVideo = value => {
        const video = {
            Vname: value
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/VideoController/findByVname',
            params: video
        }).then(resp => {
            let getSearch = []
            //console.log('模糊查询', resp.data);
            resp.data.forEach(item => {
                getSearch.push({
                    key: item.vid,
                    vtitle: item.vname,
                    vdiscription: item.vdiscription,
                    vpath: item.vpath,
                })
            })
            this.setState({ AllVideo: getSearch })
        })

    }
    render() {
        const { AllVideo } = this.state,
            IconText = ({ type, text }) => (
                <span>
                    <Icon type={type} style={{ marginRight: 8 }} />
                    {text}
                </span>
            );
        return (
            <div>
                <Search className="video-search"
                    placeholder="请输入搜索内容"
                    onSearch={value => this.searchVideo(value)}      //按下回车键后调用的方法
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
                    dataSource={AllVideo}
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
                                avatar={<Avatar src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=451101835,1433166221&fm=26&gp=0.jpg" />}
                                title={<Tag ><Link to={{ pathname: '/show/VideoDetail', state: { ...item } }}>{item.vtitle}</Link></Tag>}
                                description={item.description}
                            />
                            {console.log("视频编号", item.key)}
                            {item.content}

                        </List.Item>
                    )}
                />,
            </div>
        )
    }
}
