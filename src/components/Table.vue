

<template>
    <Table :row-class-name="rowClassName" :columns="columns1" :data="data1"></Table>
</template>

<script>
export default ({
    setup() {
        return {
            columns1: [
                {
                    title: '顺序',
                    key: 'id',
                    width: 70
                },
                {
                    title: '车次',
                    key: 'carNo'
                },
                {
                    title: '股道',
                    key: 'track'
                },
                {
                    title: '自触',
                    key: 'touch',
                    //生成勾选框
                    render: (h, params) => {
                        return h('i-switch', {
                            props: {
                                value: params.row.touch,
                                size: 'small'
                            },
                            on: {
                                'on-change': (value) => {
                                    params.row.touch = value;
                                }
                            }
                        })
                    }
                },
                {
                    title: '类型',
                    key: 'type'
                },
                {
                    title: '状态',
                    key: 'status'
                },
                {
                    title: '开始时间',
                    key: 'startTime'
                },
                {
                    title: '计划时间',
                    key: 'planTime'
                },
                {
                    title: '方向',
                    key: 'direction',
                    tooltip: true
                },
                {
                    title: '进路序列描述',
                    key: 'description'
                }
            ],
            data1: [
                {
                    id: 1,
                    carNo: "G2203",
                    track: "24G",
                    type: "接车",
                    status: "等待",
                    startTime: "11:23",
                    planTime: "10:23",
                    direction: "阿芳宫->西安北大西场",
                    description: "SC-X24"
                },
                {
                    id: 2,
                    carNo: "G2203",
                    track: "24G",
                    type: "接车",
                    status: "等待",
                    startTime: "11:23",
                    planTime: "10:23",
                    direction: "阿芳宫->西安北大西场",
                    description: "SC-X24"
                },
                {
                    id: 3,
                    carNo: "G2203",
                    track: "24G",
                    type: "接车",
                    status: "等待",
                    startTime: "11:23",
                    planTime: "10:23",
                    direction: "阿芳宫->西安北大西场",
                    description: "SC-X24"
                },
                {
                    id: 4,
                    carNo: "G2203",
                    track: "24G",
                    type: "接车",
                    status: "等待",
                    startTime: "11:23",
                    planTime: "10:23",
                    direction: "阿芳宫->西安北大西场",
                    description: "SC-X24"
                },
                {
                    id: 5,
                    carNo: "G2203",
                    track: "24G",
                    type: "接车",
                    status: "等待",
                    startTime: "11:23",
                    planTime: "10:23",
                    direction: "阿芳宫->西安北大西场",
                    description: "SC-X24"
                }
            ]
        }
    },
    methods: {
        rowClassName(row, index) {
            return 'demo-table-error-row';
        }
    }
})
</script>

<style lang="less" scoped>
.ivu-table .demo-table-info-row td {
    background-color: #2db7f5;
    color: #fff;
}

.ivu-table .demo-table-error-row td {
    background-color: #ff6600;
    color: #fff;
}

.ivu-table td.demo-table-info-column {
    background-color: #2db7f5;
    color: #fff;
}

.ivu-table .demo-table-info-cell-name {
    background-color: #2db7f5;
    color: #fff;
}

.ivu-table .demo-table-info-cell-age {
    background-color: #ff6600;
    color: #fff;
}

.ivu-table .demo-table-info-cell-address {
    background-color: #187;
    color: #fff;
}
</style>