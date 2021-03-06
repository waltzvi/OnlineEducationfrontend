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
    //????????????????????????????????????????????????
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
            console.log("resp??????", resp)
            console.log("resp.data??????", resp.data)
            console.log("resp.data????????????", resp.data[1].ptitle)

            let getData = []
            //??????forEach?????????
            resp.data.forEach(item => {
                getData.push({
                    key: item.pid,
                    title: item.ptitle,
                    type: item.ptype,
                    detail: { ID: item.pid }
                })
            });
            //??????map?????????
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
                    console.log("??????????????????", this.state)
                })
        })
    }
    //????????????????????????id???
    getID = item => {
        return () => {
            this.setState({ visible: true })
            console.log("item??????", item.ID)
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
                console.log("??????????????????resp??????", resp.data)
                let getchoiceAnswer = resp.data.pchoiceAnswer
                console.log(getchoiceAnswer)
                let get = getchoiceAnswer.split('&')
                let getright = resp.data.prightAnswer
                console.log("getright", getright)
                let getMCRiget = []
                // ??????search???????????????????????????????????????????????????????????????&???????????????????????????-1?????????????????????????????????-1???????????????????????????????????????
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
                title: '??????',
                render: value => <span className="LeftTransfer_title">{value}</span>,
            },
            {
                dataIndex: 'type',
                title: '??????',
                render: type => <Tag>{type}</Tag>,
            },
            {
                dataIndex: 'detail',
                title: '??????',
                render: (item) => {
                    // ????????????getID???????????????pid??????
                    return <Button type="link" onClick={this.getID(item)}>
                        ????????????
                    </Button>
                }
            },
        ];
        const rightTableColumns = [
            {
                dataIndex: 'title',
                title: '??????',
                render: value => <span className="LeftTransfer_title">{value}</span>,
            },
            {
                dataIndex: 'type',
                title: '??????',
                render: type => <Tag>{type}</Tag>,
            },
        ];

        return (
            <div>

                <h1>??????????????????</h1>
                <Form onSubmit={this.handleSubmit}>

                    <TableTransfer
                        dataSource={problemData}
                        //targetKeys??????????????????????????? key ??????
                        targetKeys={targetKeys}
                        //showSearch???????????????
                        showSearch={showSearch}
                        //onChange?????????????????????????????????????????????
                        onChange={this.onChange}
                        //?????? inputValue option ?????????????????? option ????????????????????????????????? true?????????????????? false
                        //????????????
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
                            <Link to={{ pathname: '/teacher/publishExam', state: { PidArry: targetKeys } }}>????????????</Link>
                        </Button>
                    </Form.Item>
                </Form>
                <Modal
                    title="??????????????????"
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
                        <Text disabled>?????????</Text>
                        {
                            problemDataDetail.ptype === '?????????' ? (
                                <Radio.Group value={RightAnswerS}>
                                    {
                                        getChoiceDetail.map((value, index) => {
                                            return <Radio key={value + index} value={value}>{value}</Radio>
                                        })
                                    }
                                </Radio.Group>
                            ) : (
                                problemDataDetail.ptype === '?????????' ? (
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
                        <Tag color="blue">?????????{problemDataDetail.pscore}???</Tag>
                    </div>
                    <br />
                </Modal>

            </div>
        )
    }
}
export default Form.create()(publishPapers)

