import React, { Component } from 'react';
import { Steps, Button } from 'antd';
import FirstStep from './FirstStep/FirstStep'
import SecondStep from './SecondStep/SecondStep'
import PubSub from 'pubsub-js'
import './index.css'

const { Step } = Steps;

class UpdatePwd extends Component {

    state = { current: 0, Sid: '' }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    componentDidMount() {
        this.token = PubSub.subscribe('current', (_, current) => { this.setState({ current }) })
        this.token2 = PubSub.subscribe('Sid', (_, Sid) => this.setState({ Sid }))
    }

    componentWillUnmount() { PubSub.unsubscribe(this.token); PubSub.unsubscribe(this.token2) }

    render() {
        const { current, Sid } = this.state
        // console.log(Sid);
        const steps = [
            {
                title: 'ID验证',
                content: <FirstStep />,
            },
            {
                title: '重置密码',
                content: Sid === '' ? '' : <SecondStep Sid={Sid} />,
            },
            {
                title: '完成',
                content: <span style={{ fontSize: '40px' }}><center><strong>修改成功!</strong></center></span>,
            },
        ];

        return (
            <div className='UpdatePwd-MaxBox'>
                <section className="register-section-findPwd">
                    <div className='UpdatePwd-MinBox'>
                        <h1>找回密码</h1>
                        <Steps current={current}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                        <div className="steps-content">{steps[current].content}</div>
                        <div className="steps-action">
                            <p style={{ textAlign: 'end' }}>
                                {current > 0 && current !== steps.length - 1 && (
                                    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                        Previous
                                    </Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button type="link" onClick={() => this.props.history.push('/login')}>
                                        返回登录
                                    </Button>
                                )}
                            </p>
                        </div>
                    </div>
                </section>
            </div >
        );
    }
}

export default UpdatePwd;