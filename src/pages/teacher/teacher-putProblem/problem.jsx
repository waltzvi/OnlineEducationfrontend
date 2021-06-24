import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'antd';

class problem extends Component {
    render() {
        return (
            <div>
                <Link to="/scquestion">单选题</Link>
                <Link to="/mcquestion">多选题</Link>
                <Link to="/completion">填空题</Link>
                <Link to="/saquestion">简答题</Link>
            </div>
        )
    }
}
export default Form.create()(problem)
