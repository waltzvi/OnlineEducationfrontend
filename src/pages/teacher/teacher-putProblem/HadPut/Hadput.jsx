import React, { Component } from 'react'
import { Typography, Checkbox, Table, Button, Modal, Radio, Tag, Form, Input, InputNumber, Icon } from 'antd';
//Radio, Text, Checkbox 
import axios from 'axios'
import memoryUtils from '../../../../utils/memoryUtils'
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';

const { Text } = Typography;
const { TextArea } = Input;
class Hadput extends Component {

    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        visible: false,
        confirmLoading: false,
        RightAnswerS: '',
        RightAnswerM: [],
        problemData: [],
        detail: '',
        // value: '1',
        getProblemData: '',
        getChoiceDetail: [],
        Updatevisible: false,
        UpdateconfirmLoading: false,
        inputVal: '',
        Pid: '',
        Teacher: memoryUtils.User,
        searchText: '',
        searchedColumn: '',
        isloading: false         //是否加载中
    };

    //dataIndex也就是每一个列名
    getColumnSearchProps = dataIndex => ({
        //自定义筛选菜单
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
            return (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => { this.searchInput = node }}         //回调函数形式的ref
                        placeholder={`Search ${dataIndex}`}         //文字提示
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    {/* 搜索按钮 */}
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    {/* 清除过滤器 */}
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </div>
            )
        },
        //filtered表示是否处于过滤状态，如果是，那么就在表头的搜索图标展现出高亮效果
        filterIcon: filtered => (<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />),

        //value就是搜索框输入的值，record就是每一个数据对象
        //toLowerCase就是把字符串都转换成小写； includes就是是否含有搜索框输入的值
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),

        //搜索时为true，关闭时为false，不知道有啥用
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        //展示一个高亮效果
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}           //高亮与搜索框的文字相同的文字
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    // 点击确定按钮进行搜索
    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    //清除过滤效果
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    start = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    };

    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    };

    //将对应老师上传的题目全部展示出来
    componentDidMount() {
        console.log('this.state.Teacher', this.state.Teacher);
        const TeacherData = {
            Tid: this.state.Teacher.Tid
        }
        axios({
            baseURL: 'http://localhost:8080/OnlineEducation',
            method: 'post',
            url: '/ProblemController/findAllByTid',
            params: TeacherData
        }).then(resp => {
            console.log("resp.data的值", resp.data)
            // console.log("resp.data里面的值", resp.data[1].ptitle)
            console.log(TeacherData);
            let getData = []
            //采用forEach的写法
            resp.data.forEach(item => {
                getData.push({
                    key: item.pid,
                    title: item.ptitle,
                    type: item.ptype,
                    detail: { ID: item.pid }
                })
            });
            //采用map的写法
            // let a = resp.data.map(item => {
            //     return {
            //         key: item.pid,
            //         title: item.ptitle,
            //         type: item.ptype
            //     }
            // })
            // console.log(a);

            console.log(getData);
            this.setState({ problemData: getData })
        })
    }

    //获取到每一道题的id值
    getID = item => {
        return () => {
            this.setState({ visible: true })
            console.log("item的值", item.ID)
            let findPid = { Pid: item.ID }
            this.setState({ Pid: item.ID })
            axios({
                baseURL: 'http://localhost:8080/OnlineEducation',
                method: 'get',
                url: '/ProblemController/findByPid',
                params: findPid
            }).then(resp => {
                console.log("最新接受到的resp的值", resp.data)
                let getchoiceAnswer = resp.data.pchoiceAnswer
                console.log(getchoiceAnswer)
                let getright = resp.data.prightAnswer
                let get = []
                if (resp.data.ptype === '单选题') {
                    get = getchoiceAnswer.split('&')
                    console.log("getright", getright)
                    this.setState({ RightAnswerS: getright })
                } else if (resp.data.ptype === '多选题') {
                    get = getchoiceAnswer.split('&')
                    console.log("getright", getright)
                    let getMCRiget = getright.split("&")
                    this.setState({ RightAnswerM: getMCRiget })
                } else {
                    this.setState({ RightAnswerS: getright })
                }
                this.setState({
                    getProblemData: resp.data,
                    getChoiceDetail: get
                })
            })
        }

    }
    handleSubmit = e => {
        //阻止事件的默认行为
        e.preventDefault();
        //对所有表单字段进行检验
        this.props.form.validateFields((err, values) => {
            if (!err) {

                console.log(values)
                let answer = values.answer
                let title = values.Ptitle
                let score = values.Pscore
                let UpdateData = {}
                console.log(values.answer, title, score)
                if (Object.keys(values).length !== 3) {
                    //一开始获取到的values的值有：Ptitle、answer、Pscore、以及可选答案（可选答案的形式是 {原来选项内容：现在选项内容}
                    //此处删除了题目、正确答案以及分值，剩下的就是所有的可选答案（呈现形式是【属性（原来选项内容）：元素（现在选项内容）】
                    delete values.Ptitle;
                    delete values.answer;
                    delete values.Pscore;
                    //此处获取到所有的原来选项内容
                    let getRightKey = Object.keys(values)
                    //此处获取到所有的现在选项内容
                    let newChoice = Object.values(values)
                    let newChoiceArray = []
                    let index
                    let indexArray = []
                    let newRightAnswerArray = []
                    let newRightAnswer = ''
                    let newChoiceAnswer = ''
                    //将所有的正确答案放于数组newChoiceArray中
                    for (let i = 0; i < newChoice.length; i++) {
                        newChoiceArray.push(newChoice[i])
                    }
                    //找到原来的正确答案在对象中的索引值
                    if (Array.isArray(answer)) {
                        //console.log("是数组")
                        for (let m = 0; m < getRightKey.length; m++) {
                            for (let n = 0; n < answer.length; n++) {
                                if (getRightKey[m] === answer[n]) {
                                    indexArray.push(m)
                                }
                            }
                        }
                        for (let k = 0; k < indexArray.length; k++) {
                            let RightAnswerArray = newChoice[k]
                            newRightAnswerArray.push(RightAnswerArray)
                        }
                        newRightAnswer = newRightAnswerArray.join("&")
                    } else {
                        for (let i = 0; i < getRightKey.length; i++) {
                            if (getRightKey[i] === answer) {
                                index = i
                            }
                        }
                        newRightAnswer = newChoice[index]
                    }

                    //根据索引值找到现在正确答案的具体内容（此处是为了防止正确答案的内容也被修改）
                    //let newRightAnswer = newChoice[index]
                    //将所有的现在的选项内容通过&形成一个字符串
                    newChoiceAnswer = newChoiceArray.join("&")
                    //进行题目的更新
                    UpdateData = {
                        Pid: this.state.Pid,
                        Ptitle: title,
                        PchoiceAnswer: newChoiceAnswer,
                        PrightAnswer: newRightAnswer,
                        Pscore: score,
                    }
                } else {
                    UpdateData = {
                        Pid: this.state.Pid,
                        Ptitle: title,
                        PchoiceAnswer: '',
                        PrightAnswer: answer,
                        Pscore: score,
                    }
                }
                console.log(UpdateData)             //这个是修改后的数据，形式上与你显示的数据形式一样吗
                axios({
                    baseURL: 'http://localhost:8080/OnlineEducation',
                    method: 'post',
                    url: '/ProblemController/UpdateProblem',
                    params: UpdateData
                }).then(resp => {
                    console.log(resp)
                    if (resp.data.arg1 === '修改成功') {
                        //增加一个加载过渡的效果
                        this.setState({ isloading: true, Updatevisible: false }, () => {
                            this.time = setInterval(
                                () => {
                                    const { problemData } = this.state
                                    //在problemData中查找到正在修改的数据，并修改题目
                                    problemData[problemData.findIndex(item => item.key === UpdateData.Pid)].title = UpdateData.Ptitle
                                    this.setState({ isloading: false })
                                    this.props.form.resetFields()           //重置Form所有组件的状态
                                    clearInterval(this.time)
                                }, Math.random() * 500 + 800)
                        })
                    }
                }).catch(err => console.log(err))
            } else {
                console.log(err);
            }
            this.setState({ Updatevisible: false })
        })
    }

    render() {
        const { isloading, RightAnswerS, RightAnswerM, loading, selectedRowKeys, visible, confirmLoading, problemData, getProblemData, getChoiceDetail, Updatevisible, UpdateconfirmLoading } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys })
            }
        };
        const hasSelected = selectedRowKeys.length > 0
        const columns = [
            {
                title: '题目',
                dataIndex: 'title',
                width: 700,
                key: 'title',
                ...this.getColumnSearchProps('title'),

            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                ...this.getColumnSearchProps('type'),
            },
            {
                title: '详情',
                dataIndex: 'detail',
                render: (item) => {
                    // 此处调用getID方法获取到pid的值
                    return <Button type="link" onClick={this.getID(item)}>
                        详细信息
                    </Button>
                }
            },

        ];
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" disabled={!hasSelected} loading={loading} ghost>
                        <Link to={{ pathname: '/teacher/publishExam', state: { PidArry: selectedRowKeys } }}>生成试卷</Link>
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={problemData} loading={isloading} />
                <Modal
                    title="查看试卷详情"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ visible: false, })}
                    keyboard={true}
                    confirmLoading={confirmLoading}
                >
                    <div>
                        <p>{getProblemData.ptitle}</p>
                        <Tag color="blue">{getProblemData.ptype}</Tag>
                        <br />
                        <br />
                        <Text>答案：</Text>
                        {
                            getProblemData.ptype === '单选题' ? (
                                <Radio.Group value={RightAnswerS}>
                                    {
                                        getChoiceDetail.map((value, index) => {
                                            return <Radio key={value + index} value={value}>{value}</Radio>
                                        })
                                    }
                                </Radio.Group>
                            ) : (
                                getProblemData.ptype === '多选题' ? (
                                    <Checkbox.Group value={RightAnswerM}>
                                        {
                                            getChoiceDetail.map((value, index) => {
                                                return <Checkbox key={value + index} value={value}>{value}</Checkbox>
                                            })
                                        }
                                    </Checkbox.Group>
                                ) : (
                                    <Text code>{RightAnswerS}</Text>
                                )
                            )
                        }
                        <br />
                        <br />
                        <Tag color="blue">分值：{getProblemData.pscore}分</Tag>
                    </div>
                    <br />
                    <Button onClick={() => this.setState({ Updatevisible: true, visible: false })}>修改</Button>
                </Modal>

                <Modal
                    title="修改试卷信息"
                    visible={Updatevisible}
                    onOk={this.handleSubmit}
                    keyboard={true}
                    confirmLoading={UpdateconfirmLoading}
                    onCancel={() => this.setState({ Updatevisible: false, })}
                    okText="确认修改"
                    cancelText="取消"
                >
                    <div>
                        <Form>
                            <Form.Item label="题目">
                                {getFieldDecorator('Ptitle', {
                                    initialValue: getProblemData.ptitle,
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Title can not be empty!',
                                        },
                                    ],
                                })(<TextArea />)}
                            </Form.Item>
                            <Form.Item label="选项 答案">
                                {(
                                    getProblemData.ptype === '单选题' ? (
                                        getFieldDecorator('answer', {
                                            initialValue: RightAnswerS,
                                            rules: [{
                                                require: true,
                                            },
                                            ],
                                        })(
                                            <Radio.Group>
                                                {
                                                    getChoiceDetail.map((value, index) => {
                                                        return (
                                                            <Radio key={value + index} value={value}>
                                                                <Form.Item>
                                                                    {getFieldDecorator(`${value}`, {
                                                                        initialValue: value,
                                                                        rules: [{ required: true }],
                                                                    })(<Input />)}
                                                                </Form.Item>
                                                            </Radio>
                                                        )
                                                    })
                                                }
                                            </Radio.Group>)
                                    ) : (
                                        getProblemData.ptype === '多选题' ?
                                            (
                                                getFieldDecorator('answer', {
                                                    initialValue: RightAnswerM,
                                                    // rules: [{ require: true }],
                                                })(
                                                    <Checkbox.Group >
                                                        {
                                                            getChoiceDetail.map((value, index) => {
                                                                return (
                                                                    <Checkbox key={value + index} value={value}>
                                                                        {getFieldDecorator(`${value}`, {
                                                                            initialValue: value,
                                                                            rules: [{ required: true }],
                                                                        })(<Input />)}
                                                                    </Checkbox>
                                                                )
                                                            })
                                                        }
                                                    </Checkbox.Group>
                                                )) : (
                                                getFieldDecorator('answer', {
                                                    initialValue: RightAnswerS,
                                                    rules: [{
                                                        require: true,
                                                    }],
                                                })(<TextArea rows={8}></TextArea>
                                                )

                                            )
                                    )
                                )
                                }
                            </Form.Item>
                            <Form.Item label="分值：">
                                {getFieldDecorator('Pscore', {
                                    initialValue: getProblemData.pscore,
                                    rules: [{
                                        required: true,
                                        message: 'score can not be empty!',
                                    }],
                                })(<InputNumber min={1} max={50} />)}
                            </Form.Item>
                        </Form>
                    </div>

                </Modal>
            </div >
        );
    }
}
export default Form.create()(Hadput)