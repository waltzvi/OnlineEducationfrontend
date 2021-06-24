import { Button } from 'antd'
import React, { Component } from 'react'
import { withRouter } from 'react-router'

class CountDown extends Component {

    state = {
        minute: '',
        second: '',
        useTime: 0,                 //答题时间（s）
    }

    StopExam = () => {
        clearInterval(this.time)
        return this.state.useTime
    }

    componentDidMount() {
        this.props.onRef(this);
        const { Etime } = this.props
        // const minute = TotalTime.indexOf('分') === -1 ? '00' : TotalTime.substring(0, TotalTime.indexOf('分'))
        // const second = TotalTime.indexOf('秒') === -1 ? '00' : TotalTime.substring(TotalTime.indexOf('分') + 1, TotalTime.indexOf('秒'))
        let AllSecond = Etime * 60
        this.time = setInterval(() => {
            if (AllSecond === 0) this.props.history.replace('/login')
            let minute = Math.floor(AllSecond / 60)
            let second = AllSecond % 60
            if (minute < 10) minute = `0${minute}`;
            if (second < 10) second = `0${second}`;
            AllSecond--
            this.setState({ minute, second, useTime: this.state.useTime + 1 })
        }, 1000)
    }

    componentWillUnmount() { clearInterval(this.time) }

    render() {

        const { minute, second } = this.state
        return (
            <div>
                <div>
                    <div>{`${minute}:${second}`}</div>
                    <Button type='danger' onClick={this.StopExam}>结束考试</Button>
                </div>
            </div>
        )
    }
}
export default withRouter(CountDown)
