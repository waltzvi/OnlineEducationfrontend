import React, { Component } from 'react'
import { Input, List, Icon, Avatar, Tag } from 'antd';
import { Link } from 'react-router-dom'
import memoryUtils from '../../../../utils/memoryUtils'
import axios from 'axios'

const { Search } = Input;
export default class HadPutVideo extends Component {
    state = {
        AllVideo: [],
        Teacher: memoryUtils.User
    }
    componentDidMount() {
        const data = {
            Tid: this.state.Teacher.Tid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'get',
            url: '/VideoController/findVideoByTid',
            params: data
        }).then(resp => {
            console.log("resp的值", resp)
            console.log("resp.data的值", resp.data)
            let getVideoData = []
            resp.data.forEach(item => {
                getVideoData.push({
                    key: item.vid,
                    vtitle: item.vname,
                    vdiscription: item.vdiscription,
                    vpath: item.vpath,
                })
                console.log(item);
            });
            this.setState({ AllVideo: getVideoData })
        })

    }
    searchVideo = value => {
        const video = {
            Vname: value,
            Tid: this.state.Teacher.Tid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/VideoController/TfindByVname',
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
                    placeholder="input search text"
                    onSearch={value => this.searchVideo(value)}
                />
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
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
                                title={<Tag ><Link to={{ pathname: '/teacher/watchVideo', state: { ...item } }}>{item.vtitle}</Link></Tag>}
                                description={item.description}
                            />
                            {console.log("视频编号", item)}
                            {item.content}
                        </List.Item>
                    )}
                />,
            </div>
        )
    }
}
