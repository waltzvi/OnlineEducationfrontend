import axios from 'axios';
import React, { Component } from 'react'
import { Player } from 'video-react';
import "../../../../../node_modules/video-react/dist/video-react.css";
import memoryUtils from '../../../../utils/memoryUtils'


// const url = 'data:video/mp4;base64,W2rWdBIFAD4KHRNfaU50lmEI45JCQQhWV5ss4i4xkdMIDSj27OJCfGEf4iIlhMcoy2P7TzOOdSVIIG/T0o+5FoOkgkYcaPEprYy7qnUYZ/LSNJ3kzUmwgRhrPxVfDoJwKyzs+6sE0XvOL8LE0JbmMKqFA+rr3p8HDasOiebWR9U+IVQhynJ1VyfwBRand92haGNIhDzFgCfHAf8DXUqYaAL6Btc49DovTq24VzpacOkM62U4rRnq1NKMuyzflyivBtyMhnfePtQ/+NlV0IXfxXLrlrO3kutPkkwJ4JgXj3OeyuLkFl33yvSK1wxzOmY1SzMqHt+VUL08lXoy96IOhDZhzQKZeNkB50bZRKEi9Be1w4+p3eJ9dhrlf9otjXqEIGK2kKnIXnTxE1DEG8wbxA0mYjDXt/w817NPeDUnbKFlc0SrCQEg8hEUWITche/RyK2PZmde/0IHmsSVIAHDxH+4CpTV+UYQ+f6VeK1jId1C9YNKe1i9ajYpR0wuTxpgkOVyLdk53WZOt5ej4VUrXVGelWLDzWWBh/B1uJ3sDJ97opQ92sGLYcFmD3nVtv67fuZghnsXU9ZS07BfRknbdoWC7Pf7br5XX1h1tbqKr3KCKwJb4yqt2bjZa8vNN7Vfrf9RFY3wMemXnKE7uD4/tFxPwVGHWM1iqGpuMbBwNbjdOyYXdb/no+RX9bLAH94AHhk3+YOpqIV8fqsOXnBjFmDm7t188bbeoYQjp+RPyBM+dqYeJ0/R/RZvRCaYEPF6i7IkAo0x9Urc0L9nxd+HtUo/gksYefjmCEQ4CdC1R302NTT5gcGK7WqrYMSdIBJFrmC+rHMDCd26QHNVJdsBGw6AxHp4Gfe93O8QQCMlnZZuUFzaQP96PGfPFJInCRnryXR8LdaGRgl4lodlYxQz2ZoU9DRTRG3jY80pF+P06ODiXLPtdCcxV7itgkDiNFJK1xIZ14OdIcyqRIWYMZn3Clkt1in1ouOQJVKayn3a/F2h+TR2koJWCIhvhjUs/1PksEo85Jb9HA2AGkbV3Qdiuvf26M2BQ0qSnV8rREgYyvxL55nVFfzBPcD3pv7yHqRZWvej785pxZ98Xi5HIdO2um5fQBGKw1DVarwixc65fdkBbHgmQ24zvCloip5SqdjpHl7xsV3Aj+oWjpAf0IgipbQinslzKvAo9FQC0jiKceXiFiByvMqVwrgbIBGRg473U3kyYICw36nKb3ahkZk4E2JFGQHe0dPSzmUfv74+F3qvlqYIMBXGvlqXfdR6Rb5l1A1gYMuyJveClOPFEzvJ2jZUrW002LKlRg1AeGFRhAJSf9bCVpzobewFRDVFC10doaLFZSFQNIMEtGHvhIzywg=='
export default class VideoDetail extends Component {
    state = {
        videoPath: '',
        Student: memoryUtils.User,
    }
    componentDidMount() {
        const { key } = this.props.location.state
        console.log("key的值", key);
        const StudentVideo = {
            Vid: key,
            Sid: this.state.Student.Sid,
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/StudentVideoController/insertStudentVideo',
            params: StudentVideo
        }).then(resp => {
            console.log("添加成功");
        })
    }


    render() {
        const { vpath } = this.props.location.state
        console.log(vpath);
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
        )
    }
}
