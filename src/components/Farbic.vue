<template>
    <div>
        <canvas id="farbic" :width="data.width" :height="data.height"></canvas>
    </div>
</template>

<script>
import { fabric } from 'fabric';
import json from '../json/station.json';
import { reactive, ref } from 'vue';
import _ from 'loadsh';
import ContextMenu from '@imengyu/vue3-context-menu'

export default ({
    setup() {
        const data = reactive({
            ctx: null,
            width: 3250,
            height: 2000,
            startX: 0,
            startY: 0,
            timer: null,
        })
        const json = ref(null);
        return {
            data,
            json
        }
    },
    mounted() {
        const init = () => {
            return new Promise((resolve, reject) => {
                this.json = json;
                this.handleJson();
                resolve();
            })
        }
        init().then(() => {
            this.createCanvas();
        })
    },
    methods: {
        createCanvas() {
            let canvas = document.getElementById('farbic');

            this.data.ctx = new fabric.Canvas(canvas, {
                fireRightClick: true, // 启用右键，button的数字为3
                stopContextMenu: true, // 禁止默认右键菜单
                selection: false
            });
            // 拖动画布的逻辑

            //鼠标按下
            this.data.ctx.on('mouse:down', (e) => {
                // 获取鼠标按下时的坐标
                this.data.startX = e.e.clientX;
                this.data.startY = e.e.clientY;

                //鼠标移动
                this.data.ctx.on('mouse:move', (e) => {
                    // 获取鼠标移动时的坐标
                    let currentX = e.e.clientX;
                    let currentY = e.e.clientY;

                    // 计算鼠标移动的距离
                    let dx = currentX - this.data.startX;
                    let dy = currentY - this.data.startY;

                    // 根据鼠标移动的距离来移动画布
                    this.data.ctx.relativePan({ x: dx, y: dy });

                    // 更新鼠标按下时的坐标
                    this.data.startX = currentX;
                    this.data.startY = currentY;
                });
            });

            //鼠标抬起 停止拖动
            this.data.ctx.on('mouse:up', (e) => {
                //解绑mouse:move 事件
                this.data.ctx.off('mouse:move');
            });

            //鼠标滚轮缩放
            this.data.ctx.on('mouse:wheel', (e) => {
                // 计算缩放因子
                let delta = e.e.deltaY;
                let zoom = this.data.ctx.getZoom();
                zoom *= 0.999 ** delta;
                // 缩放画布
                this.data.ctx.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, zoom);
                // 更新画布
                this.data.ctx.renderAll();
            });

            //绘制站台
            this.json.StaNames.map(ele => {
                if (ele.Id % 2 == 0) return
                let [x, y] = ele.NameCoord;
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y,
                    fontSize: 50,
                    fill: '#fff',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    selectable: false
                });
                this.data.ctx.add(text);
            })

            //包围框
            json.OrtRects.map((ele, index) => {
                if (ele.id % 2 == 0) return;
                //绘制名称
                let [x, y] = ele.NameCoord;
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y,
                    fontSize: 20,
                    fill: '#fff',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    selectable: false
                });
                this.data.ctx.add(text);

                //绘制矩形
                let [x1, y1] = ele.Coord[0];
                let [x2, y2] = ele.Coord[1];
                let rect = new fabric.Rect({
                    left: x1,
                    top: y1,
                    fill: 'rgba(0,0,0,0)',
                    width: x2,
                    height: y2,
                    stroke: '#fff',
                    strokeWidth: 2,
                    selectable: false
                });
                this.data.ctx.add(rect);
            })

            //绘制绝缘节
            this.json.JYJs.map(ele => {
                if (ele.Id % 2 == 0) return
                //绘制线段
                let [x, y] = ele.Coord[0];
                let [x1, y1] = ele.Coord[1];
                let line = new fabric.Line([x, y, x1, y1], {
                    fill: '#fff',
                    stroke: '#fff',
                    strokeWidth: 2,
                    selectable: false
                });
                this.data.ctx.add(line);
            })

            //绘制无电区限
            json.NoElecAreas.map(ele => {
                if (ele.Id % 2 == 0) return
                ele.Coord.forEach((item, index) => {
                    let [x, y] = item;
                    if (index == 0) {
                        //绘制线段
                        let [x1, y1] = ele.Coord[1];
                        let line = new fabric.Line([x, y, x1, y1], {
                            fill: '#fff',
                            stroke: '#fff',
                            strokeWidth: 2,
                            selectable: false
                        });
                        this.data.ctx.add(line);
                    } else {
                        //绘制线段
                        let [x1, y1] = ele.Coord[0];
                        let line = new fabric.Line([x, y, x1, y1], {
                            fill: '#fff',
                            stroke: '#fff',
                            strokeWidth: 2,
                            selectable: false
                        });
                        this.data.ctx.add(line);
                    }
                })
            })

            //绘制文本描述
            json.Labels.map(ele => {
                if (ele.Id % 2 == 0) return;
                let [x, y] = ele.NameCoord;
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y,
                    fontSize: 20,
                    fill: '#fff',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    selectable: false
                });
                this.data.ctx.add(text);
            })

            // 绘制股道
            json.RailInSta.map(ele => {
                if (ele.Id % 2 == 0) return;
                let lines = null;
                let [x, y] = ele.NameCoord;
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y + 10,
                    fontSize: 20,
                    fill: '#fff',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    selectable: false
                });
                this.data.ctx.add(text);

                // ele.Coord.forEach((item, index) => {
                //     // console.log(item.length)
                //     if (index !== 0) {
                //         let [x, y] = item;
                //         let [x1, y1] = ele.Coord[index - 1];
                //         lines = new fabric.Line([x, y, x1, y1], {
                //             fill: '#fff',
                //             stroke: '#fff',
                //             strokeWidth: 2,
                //             selectable: false
                //         });
                //         this.data.ctx.add(lines);
                //     }
                // })

                if (ele.Coord.length == 2) {
                    ele.Coord.forEach((item, index) => {
                        // let [x,y] = item; 解构赋值
                        let x = item[0];
                        let y = item[1];
                        if (index !== 0) {
                            let [x1, y1] = ele.Coord[index - 1];
                            lines = new fabric.Line([x, y, x1, y1], {
                                fill: 'red',
                                stroke: 'red',
                                strokeWidth: 2,
                                selectable: false
                            });
                            this.data.ctx.add(lines);
                        }
                    })
                } else if (ele.Coord.length == 3) {
                    ele.Coord.forEach((item, index) => {
                        // let [x,y] = item; 解构赋值
                        let [x, y] = item;
                        console.log(x, y, 'item')

                        if (index !== 0) {
                            let [x1, y1] = ele.Coord[index - 1];
                            lines = new fabric.Line([x, y, x1, y1], {
                                fill: '#fff',
                                stroke: '#fff',
                                strokeWidth: 2,
                                selectable: false
                            });
                            this.data.ctx.add(lines);
                        }
                    })
                }

                lines.on('mouseover', (e) => {
                    console.log('e', e)
                })

                return


                //鼠标移入 lines
                let redLine = null;
                lines.on('mouseover', () => {
                    // lines.x1, lines.y1, lines.x2, lines.y2
                    //line 绘制
                    redLine = new fabric.Line([lines.x1, lines.y1, lines.x2, lines.y2], {
                        fill: 'red',
                        stroke: 'red',
                        strokeWidth: 4,
                        selectable: false
                    });
                    this.data.ctx.add(redLine);
                })
                //鼠标移出lines 移除
                lines.on('mouseout', () => {
                    this.data.ctx.remove(redLine);
                })

                //在name  5G 3G IG IIG 4G 6G 的股道上 绘制 矩形 400*20
                let rect = null;
                if (ele.BizName == '5G' || ele.BizName == '3G' || ele.BizName == 'IG' || ele.BizName == 'IIG' || ele.BizName == '4G' || ele.BizName == '6G') {
                    let [x, y] = ele.Coord[0];
                    //灰色
                    rect = new fabric.Rect({
                        left: x + 50,
                        top: y - 6,
                        width: 400,
                        height: 13,
                        fill: '#ccc',
                        stroke: '#ccc',
                        strokeWidth: 2,
                        selectable: false
                    });
                    this.data.ctx.add(rect);
                }

                let timer = null;
                let pinkLine = null;
                //rect 添加点击事件
                rect && rect.on('mousedown', (e) => {
                    //右键
                    let x = e.e.clientX;
                    let y = e.e.clientY;
                    if (e.button == 3) {
                        ContextMenu.showContextMenu({
                            x: x,
                            y: y,
                            items: [
                                {
                                    label: "锁定",
                                    onClick: () => {
                                        pinkLine = new fabric.Line([lines.x1, lines.y1, lines.x2, lines.y2], {
                                            //紫色
                                            fill: '#FF00FF',
                                            stroke: '#FF00FF',
                                            strokeWidth: 4,
                                            selectable: false
                                        });
                                        this.data.ctx.add(pinkLine);
                                        timer = setInterval(() => {
                                            pinkLine.set('visible', !pinkLine.get('visible'));
                                            this.data.ctx.renderAll();
                                        }, 500);
                                    }
                                },
                                {
                                    label: "解锁",
                                    onClick: () => {
                                        window.clearInterval(timer);
                                        this.data.ctx.remove(pinkLine);
                                    }
                                },
                            ]
                        })
                    }
                })

                rect && rect.on('mouseover', () => {
                    redLine = new fabric.Line([lines.x1, lines.y1, lines.x2, lines.y2], {
                        fill: 'red',
                        stroke: 'red',
                        strokeWidth: 4,
                        selectable: false
                    });
                    this.data.ctx.add(redLine);
                })

                rect && rect.on('mouseout', () => {
                    this.data.ctx.remove(redLine);
                })
            })

            //绘制道岔
            json.RailTurnouts.map(ele => {
                if (ele.Id % 2 == 0) return;
                let [x, y] = ele.NameCoord;
                //绘制文本
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y,
                    fontSize: 20,
                    fill: '#0f0',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    selectable: false
                });
                this.data.ctx.add(text);

                //绘制道岔
                let StartRailCoord = null;
                let PositiveSwitchCoord = null;
                let NegativeSwitchCoord = null;
                let StartSwitchCoord = null;
                let line = null;
                let center = null;
                const drawLine = (arr, key, color = '#00f') => {
                    if (arr.length == 0) return;
                    arr.forEach((item, index) => {
                        if (index !== 0) {
                            let [x, y] = item;
                            let [x1, y1] = arr[index - 1];
                            if (key == 'StartRailCoord' || key == 'PositiveRailCoord' || key == 'NegativeRailCoord') {
                                StartRailCoord = new fabric.Line([x, y, x1, y1], {
                                    fill: color,
                                    stroke: color,
                                    strokeWidth: 2,
                                    selectable: false
                                });
                                this.data.ctx.add(StartRailCoord);
                            }

                            if (key == 'PositiveSwitchCoord') {
                                PositiveSwitchCoord = new fabric.Line([x, y, x1, y1], {
                                    fill: color,
                                    stroke: color,
                                    strokeWidth: 2,
                                    selectable: false
                                });
                                line = PositiveSwitchCoord;

                                center = new fabric.Circle({
                                    left: PositiveSwitchCoord.left - 10,
                                    top: PositiveSwitchCoord.y1 - 20,
                                    radius: 20,
                                    fill: '#00000000',
                                    stroke: '#00000000',
                                    selectable: false
                                });
                                this.data.ctx.add(PositiveSwitchCoord, center);
                            }
                            if (key == 'NegativeSwitchCoord') {
                                NegativeSwitchCoord = new fabric.Line([x, y, x1, y1], {
                                    fill: color,
                                    stroke: color,
                                    strokeWidth: 2,
                                    selectable: false
                                });
                                this.data.ctx.add(NegativeSwitchCoord);
                                NegativeSwitchCoord.set('visible', false);
                            }
                            if (key == 'StartSwitchCoord') {
                                StartSwitchCoord = new fabric.Line([x, y, x1, y1], {
                                    fill: color,
                                    stroke: color,
                                    strokeWidth: 2,
                                    selectable: false
                                });
                                this.data.ctx.add(StartSwitchCoord);
                            }
                        }
                    })
                }


                // key:PositiveSwitchCoord  key:NegativeSwitchCoord  key:StartSwitchCoord
                // 绘制岔心. 如果key PositiveSwitchCoord NegativeSwitchCoord StartSwitchCoord 
                // }
                for (let key in ele.Coord) {
                    if (key == 'StartRailCoord' || key == 'PositiveRailCoord' || key == 'NegativeRailCoord') {
                        drawLine(ele.Coord[key], key)
                    }

                    if (key == 'PositiveSwitchCoord') {
                        // 水平线缺口
                        drawLine(ele.Coord[key], key)
                    }

                    if (key == 'NegativeSwitchCoord') {
                        drawLine(ele.Coord[key], key, 'red');
                    }

                    if (key == 'StartSwitchCoord') {
                        drawLine(ele.Coord[key], key)
                    }
                }

                // 绘制岔心的方法
                const drawCenter = () => {
                    console.log('drawCenter')
                    NegativeSwitchCoord.set('visible', true);
                    NegativeSwitchCoord.set('stroke', 'red');
                    StartSwitchCoord.set('stroke', 'red');
                    NegativeSwitchCoord.set('stroke', 'red');
                    PositiveSwitchCoord.set('stroke', 'red');
                    this.data.ctx.renderAll();
                }

                // 清除岔心的方法
                const clearCenter = () => {
                    NegativeSwitchCoord.set('visible', false);
                    NegativeSwitchCoord.set('stroke', '#00f');
                    StartSwitchCoord.set('stroke', '#00f');
                    NegativeSwitchCoord.set('stroke', '#00f');
                    PositiveSwitchCoord.set('stroke', '#00f');
                    this.data.ctx.renderAll();
                }

                //text 鼠标移入
                center.on('mouseover', () => {
                    // 显示 NegativeSwitchCoord    //红色
                    drawCenter()
                })

                //鼠标移出
                center.on('mouseout', () => {
                    // 隐藏 NegativeSwitchCoord
                    clearCenter()
                })


                //text 添加鼠标单击事件
                let circle = null;
                //获取当前画布的缩放大小
                let zoom = 1;
                center.on('mousedown', (e) => {
                    drawCenter();
                    // 解绑事件mouseout
                    center.off('mouseout');
                    if (e.button == 3) {
                        ContextMenu.showContextMenu({
                            x: e.e.clientX,
                            y: e.e.clientY,
                            items: [
                                {
                                    label: "单锁",
                                    onClick: () => {

                                        const fn = () => {
                                            return new Promise((resolve, reject) => {
                                                let { left, y1 } = line;
                                                circle = new fabric.Circle({
                                                    left: left - 10,
                                                    top: y1 - 10,
                                                    radius: 10,
                                                    fill: 'rgba(0,0,0,0)',
                                                    stroke: '#0f0',
                                                    selectable: false
                                                });
                                                this.data.ctx.add(circle)
                                                resolve();
                                            })
                                        }

                                        fn().then(() => {
                                            clearCenter();
                                        })
                                    }
                                },
                                {
                                    label: "单解",
                                    onClick: () => {
                                        this.data.ctx.remove(circle);
                                    }
                                },
                                {
                                    label: '定操',
                                    onClick: () => {
                                        //显示
                                        PositiveSwitchCoord.set('visible', true);
                                        this.data.ctx.renderAll();
                                    }
                                },
                                {
                                    label: '反操',
                                    onClick: () => {
                                        PositiveSwitchCoord.set('visible', false);
                                        this.data.ctx.renderAll();
                                    }
                                },
                                {
                                    label: '放大画布',
                                    onClick: () => {
                                        console.log('放大画布');
                                        zoom += 0.5;
                                        this.data.ctx.setZoom(zoom);
                                    }
                                }
                            ]
                        })
                    }
                })
            })

            //绘制轨道
            json.RailSecs.map(ele => {
                if (ele.Id % 2 == 0) return;
                let [x, y] = ele.NameCoord;
                //绘制文本
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y,
                    fontSize: 20,
                    fill: '#fff',
                    fontFamily: 'Microsoft YaHei',
                    fontWeight: 'bold',
                    selectable: false
                });
                this.data.ctx.add(text);

                //绘制线段
                ele.Coord.forEach((item, index) => {
                    if (index === 0) {
                        let [x, y] = item;
                        let [x1, y1] = ele.Coord[index + 1];
                        let line = new fabric.Line([x, y, x1, y1], {
                            fill: '#00f',
                            stroke: '#00f',
                            strokeWidth: 2,
                            selectable: false
                        });
                        this.data.ctx.add(line);
                    }
                })

            })

            //绘制按钮
            this.json.OprBtns.map((ele, index) => {
                let [x, y] = ele.Coord;
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y + 50,
                    fontSize: 12,
                    fill: '#fff',
                });
                let rect = new fabric.Rect({
                    left: x,
                    top: y,
                    //白色
                    fill: '#fff',
                    width: 30,
                    height: 30,
                    lockMovementX: true,
                    lockMovementY: true,
                    selectable: false
                });

                // 鼠标移入
                rect.on('mouseover', (e) => {
                    rect.set('fill', '#ff0');
                    this.data.ctx.renderAll();
                })
                //鼠标移出
                rect.on('mouseout', (e) => {
                    rect.set('fill', '#fff');
                    this.data.ctx.renderAll();
                })

                //点击事件
                rect.on('mousedown', (e) => {
                    // console.log(e.target, ele.Name);
                    alert('我点击了按钮' + ele.Name);
                    //解绑
                    this.data.ctx.off('mouse:move');
                })

                this.data.ctx.add(rect, text);
            })

            this.json.LampCtrlModes.map((ele, index) => {
                if (ele.Id % 2 == 0) return;
                let [x, y] = ele.NameCoord;

                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y,
                    fontSize: 12,
                    fill: '#fff',
                    selectable: false,
                });
                //以x,y为中心点绘制圆 10*10
                let circle = new fabric.Circle({
                    left: x + 10,
                    top: y - 30,
                    radius: 10,
                    fill: '#fff',
                    selectable: false
                });
                this.data.ctx.add(circle, text);

                //模拟信号灯闪烁
                // if (ele.Name == '分散自律' || ele.Name == '中心通信') {
                //     setInterval(() => {
                //         if (circle.fill === 'green') {
                //             circle.set('fill', 'white');
                //         } else {
                //             circle.set('fill', 'green');
                //         }
                //         this.data.ctx.renderAll();
                //     }, 500);
                // }
                //常亮信号灯
                if (ele.Name == '主电源' || ele.Name == '副电源') {
                    circle.set('fill', '#0f0');
                    this.data.ctx.renderAll();
                }
            })

            //停靠线
            this.json.RailEndTypes.map(ele => {
                if (ele.Id % 2 == 0) return;
                let [x, y] = ele.NameCoord;
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y,
                    fontSize: 12,
                    fill: '#fff',
                    selectable: false,
                });
                this.data.ctx.add(text);

                //绘制线段
                let line = null;
                ele.Coord.forEach((item, index) => {
                    let [x, y] = item;
                    if (index === 0 || index === 2) {
                        let [x1, y1] = ele.Coord[index + 1];
                        line = new fabric.Line([x, y, x1, y1], {
                            //蓝色
                            fill: '#fff',
                            stroke: '#fff',
                            strokeWidth: 2,
                            selectable: false
                        });
                        this.data.ctx.add(line);
                    }
                    if (index === 5 || index == 6 || index === 7) {
                        let [x1, y1] = ele.Coord[index + 1];
                        line = new fabric.Line([x, y, x1, y1], {
                            //蓝色
                            fill: '#fff',
                            stroke: '#fff',
                            strokeWidth: 2,
                            selectable: false
                        });
                        this.data.ctx.add(line);
                    }
                })
            })

            //箭头
            this.json.OrtArrows.map(ele => {
                if (ele.Id % 2 == 0) return;
                let line = null;
                ele.Coord.forEach((item, index) => {
                    let [x, y] = item;
                    if (index !== 0) {
                        let [x1, y1] = ele.Coord[index - 1];
                        line = new fabric.Line([x, y, x1, y1], {
                            fill: '#fff',
                            stroke: '#fff',
                            strokeWidth: 2,
                            selectable: false
                        });
                        //首尾相连
                        if (index === ele.Coord.length - 1) {
                            let [x2, y2] = ele.Coord[0];
                            line = new fabric.Line([x, y, x2, y2], {
                                fill: '#fff',
                                stroke: '#fff',
                                strokeWidth: 2,
                                selectable: false
                            });
                        }
                        this.data.ctx.add(line);
                    }
                })

            })

            //站台
            this.json.Platforms.map(ele => {
                if (ele.Id % 2 == 0) return;
                ele.Coord.forEach((item, index) => {
                    let [x, y] = item;
                    if (index !== 0) {
                        let [x1, y1] = ele.Coord[index - 1];
                        let line = new fabric.Line([x, y, x1, y1], {
                            fill: 'pink',
                            stroke: 'pink',
                            strokeWidth: 2,
                            selectable: false
                        });
                        this.data.ctx.add(line);
                    }
                })
            })

            this.json.RtBtns.map(ele => {
                if (ele.Id % 2 == 0) return;
                let [x, y] = ele.RectCoord;
                if (ele.Type == 4) {
                    //绘制一个圆形按钮银色带过渡
                    let circleButton = new fabric.Circle({
                        left: x,
                        top: y,
                        radius: 10,
                        fill: '#fff',
                        stroke: '#fff',
                        strokeWidth: 2,
                        selectable: false,
                        lockMovementX: true,
                        lockMovementY: true,
                    });
                    this.data.ctx.add(circleButton);
                    circleButton.on('mousedown', () => {
                        console.log(ele.Name)
                    })
                }
                //绘制绿色按钮矩形

                if (ele.Type == 0 || ele.Type == 1) {
                    let greenButton = new fabric.Rect({
                        left: x,
                        top: y,
                        width: 20,
                        height: 20,
                        //白色

                        fill: '#0f0',
                        stroke: '#0f0',
                        strokeWidth: 2,
                        selectable: false,
                    });
                    this.data.ctx.add(greenButton);

                    greenButton.on('mousedown', () => {
                        console.log(ele.Name)
                    })
                }

                if (ele.Type == 2) {
                    let buleButton = new fabric.Rect({
                        left: x,
                        top: y,
                        width: 20,
                        height: 20,
                        fill: '#00f',
                        stroke: '#00f',
                        strokeWidth: 2,
                        selectable: false,
                    })
                    this.data.ctx.add(buleButton);
                    buleButton.on('mousedown', (e) => {
                        console.log(ele.Name)
                        //右键
                        if (e.button == 3) {
                            //取消鼠标移动事件
                            ContextMenu.showContextMenu({
                                x: e.e.clientX,
                                y: e.e.clientY,
                                items: [{
                                    label: '模拟按钮对闪烁',
                                    onClick: () => {
                                        this.data.ctx.off('mouse:move');
                                        //this.json.RtBtns中找到 Name == 'XFJ' Name== 'XJ' 的两个按钮
                                        let btnList = []
                                        this.json.RtBtns.find(
                                            item => {
                                                if (item.Name == 'XFJ' || item.Name == 'XJ') {
                                                    btnList.push(item)
                                                }
                                            }
                                        )

                                        let rectList = [];
                                        btnList.map(item => {
                                            let [x1, y1] = item.RectCoord;
                                            let rect = this.data.ctx.getObjects().find(item => item.left == x1 && item.top == y1);
                                            rectList.push(rect)
                                        })

                                        let timer = setInterval(() => {
                                            rectList.map(ele => {
                                                if (ele.fill == '#0f0') {
                                                    ele.set('fill', '#fff');
                                                    ele.set('stroke', '#fff');
                                                } else {
                                                    ele.set('fill', '#0f0');
                                                    ele.set('stroke', '#0f0');
                                                }
                                                this.data.ctx.renderAll();

                                            })
                                            if (buleButton.fill == '#00f') {
                                                buleButton.set('fill', '#fff');
                                                buleButton.set('stroke', '#fff');
                                            } else {
                                                buleButton.set('fill', '#00f');
                                                buleButton.set('stroke', '#00f');
                                            }
                                            this.data.ctx.renderAll();
                                        }, 1000);
                                    }
                                }]
                            })
                        }
                        this.data.ctx.off('mouse:move');
                    })
                }
            });

            //信号灯
            this.json.Lamp.map(ele => {
                if (ele.Id % 2 == 0) return;
                let [x, y] = ele.NameCoord;
                let text = new fabric.Text(ele.Name, {
                    left: x,
                    top: y - 10,
                    fontSize: 12,
                    fill: '#fff',
                    selectable: false
                });
                this.data.ctx.add(text);

                //x,y+10为信号灯中心点 绘制两个圆
                let circle1 = new fabric.Circle({
                    left: x - 10,
                    top: y - 25,
                    radius: 5,
                    fill: '#f00',
                    selectable: false
                });
                let circle2 = new fabric.Circle({
                    left: x + 5,
                    top: y - 25,
                    radius: 5,
                    //蓝色
                    fill: '#00f',
                    selectable: false
                });
                this.data.ctx.add(circle1, circle2);
                //以圆心为中心点 在圆的上面 绘制一个x
                let line1 = new fabric.Line([x - 10, y - 25, x - 5, y - 20], {
                    //黑色#000
                    fill: '#fff',
                    stroke: '#fff',
                    strokeWidth: 2,
                    selectable: false
                });
                let line2 = new fabric.Line([x - 10, y - 20, x - 5, y - 25], {
                    fill: '#fff',
                    stroke: '#fff',
                    strokeWidth: 2,
                    selectable: false
                });
                let line3 = new fabric.Line([x + 5, y - 25, x + 10, y - 20], {
                    fill: '#fff',
                    stroke: '#fff',
                    strokeWidth: 2,
                    selectable: false
                });
                let line4 = new fabric.Line([x + 5, y - 20, x + 10, y - 25], {
                    fill: '#fff',
                    stroke: '#fff',
                    strokeWidth: 2,
                    selectable: false
                });
                this.data.ctx.add(line1, line2, line3, line4);

                //x,y+10 为信号灯中心点 绘制一个矩形 10*10 层级最高
                let rect = new fabric.Rect({
                    left: x - 10,
                    top: y - 25,
                    width: 25,
                    height: 10,
                    fill: 'rgba(0,0,0,0)',
                    stroke: 'rgba(0,0,0,0)',
                    strokeWidth: 2,
                    selectable: false
                });
                this.data.ctx.add(rect);

                //封锁按钮的定时器
                let rectTimer = [];
                rect.on('mousedown', (e) => {
                    //右键
                    if (e.button === 3) {
                        console.log('我点击了右键');
                        //生成菜单 
                        ContextMenu.showContextMenu({
                            x: e.e.clientX,
                            y: e.e.clientY,
                            items: [
                                {
                                    label: '点灯',
                                    onClick: () => {
                                        //删除线段
                                        setTimeout(() => {
                                            this.data.ctx.remove(line1, line2, line3, line4);
                                        }, 800)
                                    }
                                },
                                {
                                    label: '灭灯',
                                    onClick: () => {
                                        //添加线段
                                        //如果已经存在线段 则不添加
                                        if (this.data.ctx.contains(line1)) {
                                            alert('当前是灭灯状态');
                                            return
                                        }
                                        setTimeout(() => {
                                            this.data.ctx.add(line1, line2, line3, line4);
                                        }, 800)
                                    }
                                },
                                {
                                    label: "信号机封锁",
                                    onClick: () => {
                                        // XFJ  XF_Y  XFTA
                                        //遍历RtBtns 找到对应的按钮
                                        this.json.RtBtns.map(item => {
                                            if (item.Name == 'XFJ' || item.Name == 'XF_Y' || item.Name == 'XFTA') {
                                                //获取按钮的坐标
                                                let [x, y] = item.RectCoord;
                                                //通过按钮的坐标找到绘制的按钮
                                                let btn = this.data.ctx.getObjects().find(ele => {
                                                    return ele.left == x && ele.top == y
                                                })
                                                //按钮每隔一秒闪烁一次
                                                //获取按钮的颜色
                                                let color = btn.fill;
                                                let timer = setInterval(() => {
                                                    btn.set('fill', btn.fill == color ? 'pink' : color);
                                                    this.data.ctx.renderAll();
                                                }, 1000)
                                                rectTimer.push(timer);
                                            }
                                        })
                                    }
                                },
                                {
                                    label: '信号机解锁',
                                    onClick: () => {
                                        console.log('我点击了解锁', rectTimer);
                                        //遍历rectTimer 清除定时器
                                        rectTimer.map(item => {
                                            clearInterval(item);
                                        })
                                        //按钮恢复原来的颜色
                                        this.json.RtBtns.map(item => {
                                            if (item.Name == 'XFJ' || item.Name == 'XF_Y' || item.Name == 'XFTA') {
                                                //获取按钮的坐标
                                                let [x, y] = item.RectCoord;
                                                //根据item.Type重绘按钮
                                                let btn = this.data.ctx.getObjects().find(ele => {
                                                    return ele.left == x && ele.top == y
                                                })
                                                // 0 1  绿色 2 蓝色
                                                btn.set('fill', item.Type == 1 || item.Type == 0 ? '#0f0' : '#00f');
                                                this.data.ctx.renderAll();
                                            }
                                        })

                                    },

                                },
                                {
                                    label: '办理进路',
                                    onClick: () => {

                                    }
                                }
                            ]
                        })
                    }
                })

                let [x1, y1] = ele.VLineCoord;
                //绘制垂直线段
                let line = new fabric.Line([x1, y1, x1, y1 + 20], {
                    fill: '#00f',
                    stroke: '#00f',
                    strokeWidth: 2,
                    selectable: false
                });
                this.data.ctx.add(line);
            })
        },
        //处理json数据
        handleJson() {
            let { StaNames, JYJs, LampCtrlModes, Labels, OrtRects, RailInSta, RailSecs, RailTurnouts, RailEndTypes, OprBtns, OrtArrows, Lamp, RtBtns, Platforms, NoElecAreas } = this.json
            //功能按钮
            OprBtns.map(ele => {
                ele.Coord = ele.Coord.split(',').map(item => {
                    return Number(item)
                });
                ele.NameCoord = ele.NameCoord.split(',').map(item => {
                    return Number(item)
                });
            })
            //站台
            StaNames.map(ele => {
                ele.NameCoord = ele.NameCoord.split(',').map(item => {
                    return Number(item)
                });
            });
            JYJs.map(ele => {
                ele.Coord = ele.Coord.map(item => {
                    return item.split(',').map(ele => Number(ele))
                })
            });

            //无电区限
            NoElecAreas.map(ele => {
                ele.Coord = ele.Coord.map(item => {
                    return item.split(',').map(ele => Number(ele))
                })
            })

            //文本
            Labels.map(ele => {
                ele.NameCoord = ele.NameCoord.split(',').map(ele => Number(ele))
            })


            //包围框
            OrtRects.map(ele => {
                ele.NameCoord = ele.NameCoord.split(',').map(ele => Number(ele))
                ele.Coord = ele.Coord.map(item => {
                    return item.split(',').map(ele => Number(ele))
                })
            })

            //股道
            RailInSta.map(ele => {
                ele.NameCoord = ele.NameCoord.split(',').map(ele => Number(ele))
                ele.Coord = ele.Coord.map(item => {
                    return item.split(',').map(ele => Number(ele))
                })
            })

            //道岔
            RailTurnouts.map(ele => {
                ele.NameCoord = ele.NameCoord.split(',').map(ele => Number(ele));
                //todo 处理道岔坐标 6个点
                ele.StartRailCoord = ele.StartRailCoord.map(ele => {
                    return ele.split(',').map(ele => Number(ele));
                })
                ele.PositiveRailCoord = ele.PositiveRailCoord.map(ele => {
                    return ele.split(',').map(ele => Number(ele));
                })
                ele.NegativeRailCoord = ele.NegativeRailCoord.map(ele => {
                    return ele.split(',').map(ele => Number(ele));
                })
                ele.PositiveSwitchCoord = ele.PositiveSwitchCoord.map(ele => {
                    return ele.split(',').map(ele => Number(ele));
                })
                ele.NegativeSwitchCoord = ele.NegativeSwitchCoord.map(ele => {
                    return ele.split(',').map(ele => Number(ele));
                })
                ele.StartSwitchCoord = ele.StartSwitchCoord.map(ele => {
                    return ele.split(',').map(ele => Number(ele));
                })

                ele.Coord = {
                    StartRailCoord: ele.StartRailCoord,
                    PositiveRailCoord: ele.PositiveRailCoord,
                    NegativeRailCoord: ele.NegativeRailCoord,
                    PositiveSwitchCoord: ele.PositiveSwitchCoord,
                    NegativeSwitchCoord: ele.NegativeSwitchCoord,
                    StartSwitchCoord: ele.StartSwitchCoord
                }
            })

            //轨道
            RailSecs.map(ele => {
                ele.NameCoord = ele.NameCoord.split(',').map(ele => Number(ele));
                ele.NameCoord[1] = Number(ele.NameCoord[1])
                ele.Coord = ele.Coord.map(item => {
                    return item.split(',').map(ele => Number(ele))
                })
            })

            //信号灯
            LampCtrlModes.map(ele => {
                ele.NameCoord = ele.NameCoord.split(',').map(ele => Number(ele));
                ele.Coord = ele.Coord.split(',').map(ele => Number(ele));
            })

            //绘制停靠线
            RailEndTypes.map(ele => {
                ele.Coord = ele.Coord.map(item => {
                    return item.split(',').map(ele => Number(ele))
                })
                ele.NameCoord = ele.NameCoord.split(',').map(ele => Number(ele));
            })


            //箭头
            OrtArrows.map(ele => {
                ele.Coord = ele.Coord.map(item => {
                    return item.split(',').map(ele => Number(ele))
                })
            })


            //站台
            Platforms.map(ele => {
                ele.Coord = ele.Coord.map(item => {
                    return item.split(',').map(ele => Number(ele))
                })
            })

            //信号机
            Lamp.map(ele => {
                ele.NameCoord = ele.NameCoord.split(',').map(ele => Number(ele));
                ele.VLineCoord = ele.VLineCoord.split(',').map(ele => Number(ele));
            })

            //信号机按钮
            RtBtns.map(ele => {
                ele.RectCoord = ele.RectCoord.split(',').map(ele => Number(ele));
            })
        }
    }
})
</script>

<style lang="less" scoped>
#farbic {
    background: black;
}

.context-menu {
    height: 300px;
    width: 200px;
    position: absolute;
    z-index: 999;
}
</style>