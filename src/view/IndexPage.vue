
<template>
    <div class="layout">
        <Layout :style="{ minHeight: '80vh', height: '80vh' }">
            <Sider style="width: 100px;min-width: 100px;max-width: 100px;flex: 0 0 100px;" collapsible
                :collapsed-width="78" v-model="isCollapsed" class="Layout-Sider">
                <Menu :active-name="activeName" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem name="1-1">
                    <span>咸阳北</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{ background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', height: '30px' }">
                    <div class="menu-list">
                        <Dropdown placement="bottom-start">
                            <a href="javascript:void(0)">
                                区段选择
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <template #list>
                                <DropdownMenu>
                                    <DropdownItem>1</DropdownItem>
                                    <DropdownItem>2</DropdownItem>
                                    <DropdownItem>3</DropdownItem>
                                    <DropdownItem>4</DropdownItem>
                                    <DropdownItem>5</DropdownItem>
                                </DropdownMenu>
                            </template>
                        </Dropdown>
                        <Dropdown placement="bottom-start">
                            <a href="javascript:void(0)">
                                车站选择
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <template #list>
                                <DropdownMenu>
                                    <DropdownItem>1</DropdownItem>
                                    <DropdownItem>2</DropdownItem>
                                    <DropdownItem>3</DropdownItem>
                                    <DropdownItem>4</DropdownItem>
                                    <DropdownItem>5</DropdownItem>
                                </DropdownMenu>
                            </template>
                        </Dropdown>
                        <Dropdown placement="bottom-start">
                            <a href="javascript:void(0)">
                                视图
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <template #list>
                                <DropdownMenu>
                                    <DropdownItem>1</DropdownItem>
                                    <DropdownItem>2</DropdownItem>
                                    <DropdownItem>3</DropdownItem>
                                    <DropdownItem>4</DropdownItem>
                                    <DropdownItem>5</DropdownItem>
                                </DropdownMenu>
                            </template>
                        </Dropdown>
                        <Dropdown placement="bottom-start">
                            <a href="javascript:void(0)">
                                显示选项
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <template #list>
                                <DropdownMenu>
                                    <DropdownItem>1</DropdownItem>
                                    <DropdownItem>2</DropdownItem>
                                    <DropdownItem>3</DropdownItem>
                                    <DropdownItem>4</DropdownItem>
                                    <DropdownItem>5</DropdownItem>
                                </DropdownMenu>
                            </template>
                        </Dropdown>
                        <Dropdown placement="bottom-start">
                            <a href="javascript:void(0)">
                                缩放
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <template #list>
                                <DropdownMenu>
                                    <DropdownItem>1</DropdownItem>
                                    <DropdownItem>2</DropdownItem>
                                    <DropdownItem>3</DropdownItem>
                                    <DropdownItem>4</DropdownItem>
                                    <DropdownItem>5</DropdownItem>
                                </DropdownMenu>
                            </template>
                        </Dropdown>
                        <Dropdown placement="bottom-start">
                            <a href="javascript:void(0)">
                                功能
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <template #list>
                                <DropdownMenu>
                                    <DropdownItem>1</DropdownItem>
                                    <DropdownItem>2</DropdownItem>
                                    <DropdownItem>3</DropdownItem>
                                    <DropdownItem>4</DropdownItem>
                                    <DropdownItem>5</DropdownItem>
                                </DropdownMenu>
                            </template>
                        </Dropdown>
                        <Dropdown placement="bottom-start">
                            <a href="javascript:void(0)">
                                帮助
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <template #list>
                                <DropdownMenu>
                                    <DropdownItem>1</DropdownItem>
                                    <DropdownItem>2</DropdownItem>
                                    <DropdownItem>3</DropdownItem>
                                    <DropdownItem>4</DropdownItem>
                                    <DropdownItem>5</DropdownItem>
                                </DropdownMenu>
                            </template>
                        </Dropdown>
                        <Dropdown placement="bottom-start">
                            <a href="javascript:void(0)">
                                其他
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <template #list>
                                <DropdownMenu>
                                    <DropdownItem>退出系统</DropdownItem>
                                </DropdownMenu>
                            </template>
                        </Dropdown>
                    </div>
                </Header>
                <Content class="station-canvas">
                    <div @contextmenu.prevent="show" class="card-canvas">
                        <CanvasVue></CanvasVue>
                    </div>
                    <div class="operation-manu" style="display:flex">
                        <div>
                            <ButtonGroup size="small" v-for="(item, index) in menubar" :key="index">
                                <Button size="small" :type="item.type">{{ item.name }}</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>

        <Layout :style="{ minHeight: '20vh', height: '20vh', position: 'relative', zIndex: '9999' }">
            <Footer class="layout-footer" style="padding:0px">
                <Content>
                    <Card>
                        <Row>
                            <Col span="3">
                            <div class="layout-footer-button">
                                <Card style="height:150px">
                                    <div v-for="(item, index) in muen " :key="index">
                                        <Button type="primary" size="small" @click="handleClick">{{ item.name
                                        }}</Button>
                                    </div>
                                </Card>
                            </div>
                            </Col>
                            <Col span="18">
                            <div class="layout-footer-table">
                                <Tabs value="name1" type="card">
                                    <TabPane label="列车进路" name="name1" style=" margin-bottom: 0;">
                                        <div class="tab-table">
                                            <TableVue></TableVue>
                                        </div>
                                    </TabPane>
                                    <TabPane label="调车进路(只读)" name="name2">标签二的内容</TabPane>
                                </Tabs>
                            </div>
                            </Col>
                            <Col span="3">
                            <div class="layout-footer-text">
                                <Card style="height:150px;overflow-y: scroll;padding:5px">
                                    <div class="text-card">
                                        [10:23:21]:列车进站
                                        [10:23:21]:列车进站
                                        [10:23:21]:列车进站
                                        [10:23:21]:列车进站
                                        [10:23:21]:列车进站
                                        [10:23:21]:列车进站
                                    </div>
                                </Card>
                            </div>
                            </Col>
                        </Row>
                    </Card>
                </Content>
            </Footer>
        </Layout>
    </div>
</template>
<script>
import TableVue from '../components/Table.vue';
import CanvasVue from '../components/Canvas.vue';
export default {
    components: {
        TableVue,
        CanvasVue
    },
    data() {
        return {
            isCollapsed: false,
            activeName: null,
            columns1: [],
            data1: [],
            muen: [
                {
                    name: "刷新",
                    type: "primary"
                },
                {
                    name: "下行",
                    type: "primary"
                },
                {
                    name: "西安北大西场",
                    type: "primary"
                },
                {
                    name: "西成高铁台",
                    type: "primary"
                }
            ],
            menubar: [
                {
                    name: '进路建立',
                    type: "primary"
                },
                {
                    name: '总取消',
                    type: "primary"
                },
                {
                    name: '引导按钮',
                    type: "primary"
                },
                {
                    name: '引导总锁',
                    type: "primary"
                },
                {
                    name: '总人解',
                    type: "primary"
                },
                {
                    name: '道岔总定',
                    type: "primary"
                },
                {
                    name: '道岔总反',
                    type: "primary"
                },
                {
                    name: '道岔单锁',
                    type: "primary"
                },
                {
                    name: '道岔解锁',
                    type: "primary"
                },
                {
                    name: '封锁按钮',
                    type: "primary"
                },
                {
                    name: '功能按钮',
                    type: "primary"
                },
                {
                    name: '坡道解锁',
                    type: "primary"
                },
                {
                    name: '分路不良',
                    type: "primary"
                },
                {
                    name: '命令清除',
                    type: "primary"
                },
                {
                    name: '命令下达',
                    type: "primary"
                },
                {
                    name: '状态选择',
                    type: "primary"
                },
                {
                    name: '模式转换',
                    type: "primary"
                }
            ]
        };
    },
    watch: {
        isCollapsed() {
            this.activeName = null;
        }
    },
    computed: {
        menuitemClasses: function () {
            return [
                'menu-item',
                this.isCollapsed ? 'collapsed-menu' : ''
            ]
        }
    },
    created() {
        // this.handleContextMenu(e)
    },
    methods: {
        handleClick() {
            this.$Message.info('Click on a button.');
        },
        show() {
            this.$Message.info('右键事件');

            //函数触发的时候 显示一个弹窗


        }
    }
}
</script>


<style lang="scss" scoped>
.layout-footer {
    display: flex;
    height: 300px;

    .layout-footer-button {
        height: 300px;
    }

    .layout-footer-table {
        height: 350px;

        .tab-table {
            height: 130px;
            overflow: auto;
        }
    }

    .layout-footer-text {
        height: 300px;

        .text-card {
            height: 200px;
            text-align: left;
        }
    }

}

.menu-list {
    position: absolute;
    top: -15px;
}

.station-canvas {
    z-index: 9999;
    overflow: auto;

    .card-canvas {
        height: 95%;
    }

    .operation-manu {
        position: fixed;
        height: 5%;
    }

}


.Layout-Sider {
    // 80
    height: 100vh;
    overflow-y: scroll;
}



.layout-con {
    height: 100%;
    width: 100%;
}

.menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
}

.menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
}

.collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
}

.collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
}

.dev-run-preview .dev-run-preview-edit {
    display: none
}
</style>