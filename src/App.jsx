import React, { Component } from 'react'
import student from './pages/student/student'
import teacher from './pages/teacher/teacher'
import login from './pages/login/login'
import register from './pages/register/register'
import problem from './pages/teacher/teacher-putProblem/problem'
import show from './pages/show/show'
import text from './pages/show/show-problem/CountDown/CountDown'
import FindPwd from './pages/FindPwd/FindPwd'

import { Route, Switch, Link } from "react-router-dom"

export default class App extends Component {
    render() {
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <div>
                    <Link to="/student">Student</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/problem">Problem</Link>
                    <Link to="/teacher">Teacher</Link>
                    <Link to="/show">Show</Link>
                </div>

                <div style={{ height: '100%', width: '100%' }}>
                    {/* switch的作用就是：其匹配到了一个路由就不会再匹配了 */}
                    <Switch>
                        <Route path="/login" component={login}></Route>
                        <Route path="/student" component={student}></Route>
                        <Route path="/teacher" component={teacher}></Route>
                        <Route path="/register" component={register}></Route>
                        <Route path="/problem" component={problem}></Route>
                        <Route path="/show" component={show}></Route>
                        <Route path="/text" component={text}></Route>
                        <Route path="/FindPwd" component={FindPwd}></Route>
                    </Switch>
                </div>
            </ div>
        )
    }
}
