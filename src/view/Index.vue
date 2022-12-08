<template>
    <div class="full" :style="`transform:scale(${data.scale.x},${data.scale.y})`">

        <el-container class="common-layout">
            <el-row>
                <el-col :span="24">
                    <el-header class="common-layout-header">
                        <el-menu class="el-menu-demo" mode="horizontal">
                            <el-sub-menu index="1">
                                <template #title>区段选择</template>
                                <el-menu-item index="1-1">item one</el-menu-item>
                                <el-menu-item index="1-2">item two</el-menu-item>
                                <el-menu-item index="1-3">item three</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="2">
                                <template #title>车站选择</template>
                                <el-menu-item index="2-1">item one</el-menu-item>
                                <el-menu-item index="2-2">item two</el-menu-item>
                                <el-menu-item index="2-3">item three</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="3">
                                <template #title>视图</template>
                                <el-menu-item index="3-1">item one</el-menu-item>
                                <el-menu-item index="3-2">item two</el-menu-item>
                                <el-menu-item index="3-3">item three</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="4">
                                <template #title>显示选项</template>
                                <el-menu-item index="4-1">item one</el-menu-item>
                                <el-menu-item index="4-2">item two</el-menu-item>
                                <el-menu-item index="4-3">item three</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="5">
                                <template #title>缩放</template>
                                <el-menu-item index="5-1">item one</el-menu-item>
                                <el-menu-item index="5-2">item two</el-menu-item>
                                <el-menu-item index="5-3">item three</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="6">
                                <template #title>帮助</template>
                                <el-menu-item index="6-1">item one</el-menu-item>
                                <el-menu-item index="6-2">item two</el-menu-item>
                                <el-menu-item index="6-3">item three</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="7">
                                <template #title>退出系统</template>
                                <el-menu-item index="7-1">退出系统</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="8">
                                <template #title>功能</template>
                                <el-menu-item index="8-1">item one</el-menu-item>
                                <el-menu-item index="8-2">item two</el-menu-item>
                                <el-menu-item index="8-3">item three</el-menu-item>
                            </el-sub-menu>
                        </el-menu>
                    </el-header>
                </el-col>
            </el-row>

            <!-- <el-header class="common-layout-header">Header</el-header> -->

            <el-container class="common-layout-container">
                <el-aside width="150px" class="aside">
                    <el-button size="large">咸阳北</el-button>
                </el-aside>
                <el-main class="mian">
                    <canvas id="canvas" width="4000" height="4000"></canvas>
                </el-main>
            </el-container>
            <el-footer class="common-layout-footer">
                <el-container class="common-layout-container">
                    <el-aside width="200px" class="footer-aside" style="padding: 10px">
                        <el-card shadow="always">
                            <div v-for="(item, index) in data.bottomMuen" :key="index">
                                <el-button style="margin: 10px;" :type="item.type">{{ item.name }}</el-button>
                            </div>
                        </el-card>
                    </el-aside>
                    <el-main width="1300px" class="footer-mian" style=" padding: 10px;">
                        <el-card shadow="always">
                            <el-tabs v-model="activeName" class="demo-tabs">
                                <div style="height: 300px;overflow: auto;">
                                    <el-tab-pane label="列车进路" name="table">
                                        <TableCompoent />
                                    </el-tab-pane>
                                    <el-tab-pane label="调车进路(只读)" name="second"></el-tab-pane>
                                </div>
                            </el-tabs>
                        </el-card>
                    </el-main>
                    <el-aside width="420px" class="footer-aside" style="padding: 10px">
                        <el-card shadow="always">
                            <el-input v-model="textarea" :autosize="{ minRows: 9, maxRows: 9 }" type="textarea" />
                        </el-card>
                    </el-aside>
                </el-container>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
import { compile, reactive, ref } from "vue";
// import TableCompoent from '../components/Table.vue'
export default ({
    components: {
        // TableCompoent
    },
    setup() {
        const activeName = ref('table');
        const textarea = ref('');
        const data = reactive({
            scale: {
                x: document.body.clientWidth / 1920,
                y: document.body.clientHeight / 1080
            },
            bottomMuen: [
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
            ]
        })
        function handleResize() {
            const scale = {
                x: document.body.clientWidth / 1920,
                y: document.body.clientHeight / 1080,
            };
            data.scale = scale;
        }
        return {
            data,
            textarea,
            activeName,
            handleResize
        }
    },
    methods: {
        createCanvas() {

        }
    },
    mounted() {
        this.createCanvas()
        this.handleResize();
        window.onresize = () => window.requestAnimationFrame(this.handleResize);
    }
})
</script>

<style lang="less" scoped>
.full {
    width: 1920px;
    transform-origin: top left;
    background-size: 100% 100%;

    .common-layout {
        width: 1920px;
        height: 1080px;

        .common-layout-header {
            height: 30px;
            padding: 0;

            .el-menu-demo {
                width: 1920px;
                height: 30px;
            }

        }

        .common-layout-container {
            height: 770px;

            .aside {
                .asdie-card {
                    height: 800px;
                    width: 150px;
                }
            }

            .mian {
                height: 800px;
                width: 1770px;
                overflow: auto;
                background: black;
            }
        }

        .common-layout-footer {
            display: flex;
            height: 250px;

            .footer-container {
                height: 250px;
                overflow-y: scroll;

                .footer-aside {}

                .footer-mian {}

                .footer-right {}
            }
        }
    }
}
</style>
