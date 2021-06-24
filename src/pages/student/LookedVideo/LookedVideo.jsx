import axios from 'axios'
import React, { Component } from 'react'
import { Input, List, Icon, Avatar, Tag } from 'antd';
import { Link } from 'react-router-dom'
import memoryUtils from '../../../utils/memoryUtils'

const { Search } = Input;
export default class LookedVideo extends Component {
    state = {
        Student: memoryUtils.User,
        FindedVideo: []
    }
    componentDidMount() {
        const StudentVideo = {
            Sid: this.state.Student.Sid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/StudentVideoController/findBySid',
            params: StudentVideo
        }).then(resp => {
            console.log(resp.data);
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
            this.setState({ FindedVideo: getVideoData })
        })
    }
    render() {
        const { FindedVideo } = this.state,
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
                    onSearch={value => console.log(value)}
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
                    dataSource={FindedVideo}
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
                                title={<Tag ><Link to={{ pathname: '/student/LookedVideoDetail', state: { ...item } }}>{item.vtitle}</Link></Tag>}
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
