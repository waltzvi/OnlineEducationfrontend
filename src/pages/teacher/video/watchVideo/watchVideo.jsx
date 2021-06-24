import React, { Component } from 'react';
import axios from 'axios';
import { Player } from 'video-react';
import memoryUtils from '../../../../utils/memoryUtils';

class watchVideo extends Component {
    state = {
        videoPath: '',
        Teacher: memoryUtils.User
    }
    componentDidMount() {
        const { key } = this.props.location.state
        console.log("key的值", key);
        const TeacherVideo = {
            Vid: key,
            Tid: this.state.Teacher.Tid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/VideoController/findVideoByTid',
            params: TeacherVideo
        }).then(resp => {
            console.log("添加成功");
        })
    }
    render() {
        const { vpath } = this.props.location.state
        return (
            <div>
                <div style={{ width: 800, height: 700, margin: 50 }}>
                    <Player
                        playsInline
                    // poster="/assets/poster.png"
                    >
                        <source src={`http://localhost:8080/video/${vpath}`} />
                    </Player>
                </div>
            </div>
        );
    }
}

export default watchVideo;