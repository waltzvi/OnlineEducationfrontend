import { Tag, Modal } from 'antd'
import React, { Component } from 'react'

export default class showUserInfo extends Component {
    state = {
        visible: false,
        UserID: '',
    }
    componentDidMount() {
        console.log('===================', this.props.visible, this.props.UserID);
        this.setState({ visible: this.props.visible, UserID: this.props.UserID })

    }
    render() {
        const { visible, UserID } = this.state
        return (
            <div>
                <Modal
                    title='您的账号'
                    visible={visible}
                    onCancel={() => this.props.history.push('/show')}
                    onOk={() => {
                        Modal.confirm({
                            title: '已记住账号ID?',
                            onOk: () => this.props.history.push('/show')
                        })
                    }}
                    okText='确认'
                >
                    <p>您的账号ID为:</p>
                    <Tag color="geekblue">{UserID}</Tag>
                </Modal>
            </div>
        )
    }
}
