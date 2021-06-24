import { Form, Button, Transfer, Switch, Table, Tag, Checkbox, Modal, Radio, Typography } from 'antd'
import React, { Component } from 'react'
import axios from 'axios'
import difference from 'lodash/difference';
import memoryUtils from '../../../../utils/memoryUtils'
import './index.css'
import { Link } from 'react-router-dom';

const { Text } = Typography;
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer {...restProps} showSelectAll={false}>
        {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;
            const rowSelection = {
                getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .filter(item => !item.disabled)
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    style={{ pointerEvents: listDisabled ? 'none' : null }}
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                            if (itemDisabled || listDisabled) return;
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                />
            );
        }}
    </Transfer>
);



// const originTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);
class publishPapers extends Component {

    state = {
        targetKeys: [],
        disabled: false,
        showSearch: false,
        problemData: [],

        // selectedRowKeys: '', // Check here to configure the default column
        loading: false,
        visible: false,
        confirmLoading: false,
        RightAnswerS: '',
        RightAnswerM: [],
        problemDataDetail: [],
        detail: '',
        value: 1,
        getProblemData: '',
        getChoiceDetail: [],
        inputVal: '',
        Pid: '',

        Teacher: memoryUtils.User
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
            console.log("resp的值", resp)
            console.log("resp.data的值", resp.data)
            console.log("resp.data里面的值", resp.data[1].ptitle)

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
            this.setState({ problemData: getData },
                () => {
                    console.log("当前的状态：", this.state)
                })
        })
    }
    //获取到每一道题的id值
    getID = item => {
        return () => {
            this.setState({ visible: true })
            console.log("item的值", item.ID)
            let findPid = {
                Pid: item.ID
            }
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
                let get = getchoiceAnswer.split('&')
                let getright = resp.data.prightAnswer
                console.log("getright", getright)
                let getMCRiget = []
                // 采用search的方法寻找答案中的字符串，如果找到了字符串&，那么返回的数不是-1，如果找不到的话就返回-1，此时说明改题目是非多选题
                if (getright.search("&") === -1) {
                    this.setState({ RightAnswerS: getright })
                } else {
                    getMCRiget = getright.split("&")
                    this.setState({ RightAnswerM: getMCRiget })
                }
                this.setState({
                    problemDataDetail: resp.data,
                    getChoiceDetail: get
                })
            })
        }

    }

    onChange = nextTargetKeys => {
        this.setState({ targetKeys: nextTargetKeys });
    };
    triggerShowSearch = showSearch => {
        this.setState({ showSearch });
    };
    render() {
        const { targetKeys, showSearch, problemData, RightAnswerS, RightAnswerM, visible, confirmLoading, problemDataDetail, getChoiceDetail } = this.state;

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const leftTableColumns = [
            {
                dataIndex: 'title',
                title: '题目',
                render: value => <span className="LeftTransfer_title">{value}</span>,
            },
            {
                dataIndex: 'type',
                title: '类型',
                render: type => <Tag>{type}</Tag>,
            },
            {
                dataIndex: 'detail',
                title: '详情',
                render: (item) => {
                    // 此处调用getID方法获取到pid的值
                    return <Button type="link" onClick={this.getID(item)}>
                        详细信息
                    </Button>
                }
            },
        ];
        const rightTableColumns = [
            {
                dataIndex: 'title',
                title: '题目',
                render: value => <span className="LeftTransfer_title">{value}</span>,
            },
            {
                dataIndex: 'type',
                title: '类型',
                render: type => <Tag>{type}</Tag>,
            },
        ];

        return (
            <div>

                <h1>请编辑试卷：</h1>
                <Form onSubmit={this.handleSubmit}>

                    <TableTransfer
                        dataSource={problemData}
                        //targetKeys显示在右侧框数据的 key 集合
                        targetKeys={targetKeys}
                        //showSearch显示搜索框
                        showSearch={showSearch}
                        //onChange选项在两栏之间转移时的回调函数
                        onChange={this.onChange}
                        //接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false
                        //用于搜索
                        filterOption={(inputValue, option) => option.title.indexOf(inputValue) !== -1 || option.type.indexOf(inputValue) !== -1} // 
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                    />

                    <Switch
                        unCheckedChildren="showSearch"
                        checkedChildren="showSearch"
                        checked={showSearch}
                        onChange={this.triggerShowSearch}
                        style={{ marginTop: 16 }}
                    />
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" className="SCquestion-form-button" ghost>
                            <Link to={{ pathname: '/teacher/publishExam', state: { PidArry: targetKeys } }}>生成试卷</Link>
                        </Button>
                    </Form.Item>
                </Form>
                <Modal
                    title="查看试卷详情"
                    visible={visible}
                    onOk={() => this.setState({ visible: false, })}
                    onCancel={() => this.setState({ visible: false, })}
                    keyboard={true}
                    confirmLoading={confirmLoading}

                >
                    <div>
                        <p>{problemDataDetail.ptitle}</p>
                        <Tag color="blue">{problemDataDetail.ptype}</Tag>
                        <br />
                        <br />
                        <Text disabled>答案：</Text>
                        {
                            problemDataDetail.ptype === '单选题' ? (
                                <Radio.Group value={RightAnswerS}>
                                    {
                                        getChoiceDetail.map((value, index) => {
                                            return <Radio key={value + index} value={value}>{value}</Radio>
                                        })
                                    }
                                </Radio.Group>
                            ) : (
                                problemDataDetail.ptype === '多选题' ? (
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
                        <Tag color="blue">分值：{problemDataDetail.pscore}分</Tag>
                    </div>
                    <br />
                </Modal>

            </div>
        )
    }
}
export default Form.create()(publishPapers)

