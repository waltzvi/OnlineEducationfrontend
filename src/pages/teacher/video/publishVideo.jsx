import { Form, Input, Icon, Upload, message, Button } from 'antd'
import axios from 'axios';
import React, { Component } from 'react'
import memoryUtils from '../../../utils/memoryUtils'
import './publishVideo.css'

const { TextArea } = Input;
class publishVideo extends Component {
    state = {
        loading: false,
        Teacher: memoryUtils.User,
        //虚拟的路径
        Vpath: ''
    };

    handleSubmit = e => {
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            //如果数据没有错误，检验成功
            if (!err) {
                console.log(values);
                const data = {
                    Vname: values.videoName,
                    Vdiscription: values.Vdiscription,
                    Tid: this.state.Teacher.Tid,
                    Vpath: this.state.Vpath
                }
                axios({
                    baseURL: 'http://localhost:8080/OnlineEducation',
                    method: 'post',
                    url: '/VideoController/insertVideo',
                    params: data
                }).then(resp => {
                    console.log(resp)
                    if (resp.data.arg1 === '上传成功') {
                        message.success('发布成功!')
                        this.props.history.push('/teacher/HadPutVideo')
                    }
                })
                    .catch(err => console.log(err))
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { Teacher } = this.state
        const props = {
            name: 'UploadVideo',
            action: `http://localhost:8080/OnlineEducation/VideoController/upload?Tid=${Teacher.Tid}`,
            multiple: true,
            method: 'post',
            accept: '.mp4',
            onChange: info => {
                console.log("info", info);
                const { status } = info.file;
                if (status === 'done') {
                    message.success(`${info.file.name} 上传成功!`);
                    const Vpath = info.file.response
                    console.log("Vpath", Vpath)
                    this.setState({ Vpath }, () => console.log(this.state.Vpath))
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败!`);
                }
            },
        }
        return (
            <div>
                <section className="video-section">
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item label="视频名称">
                            {
                                getFieldDecorator('videoName', {
                                    rules: [{ required: true, message: 'Please input the name of video!' }],
                                })(
                                    <Input
                                        prefix={<Icon type="video-camera" />}
                                        placeholder="the name of video"
                                    // defaultValue='1'
                                    />,
                                )
                            }
                        </Form.Item>
                        <Form.Item label="视频简介">
                            {
                                getFieldDecorator('Vdiscription', {
                                    rules: [{ required: true, message: 'Please input the discription of video!' }],
                                })(
                                    <TextArea
                                        placeholder="the discription of video"

                                    />,
                                )
                            }
                        </Form.Item>
                        <Form.Item label="上传视频">
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" /> Click to Upload
                                </Button>
                            </Upload>
                        </Form.Item>
                        <Button htmlType="submit">发布</Button>
                    </Form>
                </section>
            </div >
        )
    }
}
export default Form.create()(publishVideo)