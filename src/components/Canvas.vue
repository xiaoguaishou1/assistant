<template>
    <div id="stage">
        <canvas id="c" :width="data.width" :height="data.height"></canvas>
        <canvas id="b" :width="data.width" :height="data.height"></canvas>
    </div>
</template>

<script>
import { reactive } from 'vue';
import json from '../json/station.json';
import _ from 'loadsh';
import Bus from '../utils/EventBus'
import { drawText, drawInsulator, drawSignal, drawRect, drawTrack, drawRail, drawButton, drawRailTurnout, drawLamp, drawStation, drawArrow, drawDockingLine, drawNoElecAreas, drawRtBtns, drawLine } from '../utils/index.js'
export default ({
    name: "xyStation",
    setup() {
        const data = reactive({
            ctxC: null,
            ctxB: null,
            //宽
            width: 3250,
            //高
            height: 2000,
            //站台json数据
            json: json,
            isDraw: false,
            Track: {
                timer1: null,
                timer2: null
            }
        })
        return {
            data
        }
    },
    mounted() {
        this.formatJson().then(() => {
            this.createStation();
        })
        this.createCanvasB();

        Bus.on('showTrack', (data) => {
        })

        Bus.on('clearTrack', (data) => {
        })

        //股道封锁
        Bus.on('blockTrack', (data) => {
            let _this = this;
            function fn() {
                return new Promise(function (reslove, reject) {
                    _this.data.Track.timer1 = setInterval(() => {
                        let xPath2D = new Path2D();
                        xPath2D.moveTo(1479, 571);
                        xPath2D.lineTo(1990, 571);
                        _this.data.ctxB.lineWidth = 8;
                        _this.data.ctxB.strokeStyle = '#ff00ff';
                        _this.data.ctxB.stroke(xPath2D);
                        reslove();
                    }, 1000)
                })
            }
            fn().then(() => {
                //每隔一秒钟 清除一次
                _this.data.Track.timer2 = setInterval(() => {
                    //清空
                    _this.data.ctxB.clearRect(1479, 560, 511, 20);
                }, 2000)
            })
        })


        //股道解锁
        Bus.on('unblockTrack', (data) => {
            clearInterval(this.data.Track.timer1);
            clearInterval(this.data.Track.timer2);
            this.data.ctxB.clearRect(1479, 560, 511, 20);
        })
    },
    methods: {
        createStation() {
            //创建一个画布
            let canvas = document.getElementById('c');
            let ctx = canvas.getContext('2d');
            this.data.ctxC = ctx;
            //绘制站台名称
            let { json } = this.data;
            json.StaNames.map(ele => {
                drawText(ctx, ele.Name, ele.NameCoord[0], ele.NameCoord[1], '#fff', 'bold 30px Arial', ele.Id);
            });
            json.Labels.map(ele => {
                drawText(ctx, ele.Name, ele.NameCoord[0], ele.NameCoord[1], '#fff', 'bold 30px Arial', ele.Id)
            })
            //绘制绝缘节 
            json.JYJs.map(ele => {
                drawInsulator(ctx, ele.Coord[0], ele.Coord[1], 2, "#fff", ele.Id);
            })
            //绘制信号灯
            json.LampCtrlModes.map(ele => {
                drawSignal(ctx, ele.Name, ele.NameCoord, ele.Coord, ele.Id);
            })
            //包围框
            json.OrtRects.map(ele => {
                drawRect(ctx, ele.Name, ele.NameCoord, ele.Coord, ele.Id)
            })
            //绘制股道
            json.RailInSta.map(ele => {
                drawTrack(ctx, ele.Name, ele.NameCoord, ele.Coord, ele.Id)
            })
            //绘制轨道
            json.RailSecs.map(ele => {
                drawRail(ctx, ele.Name, ele.NameCoord, ele.Coord, ele.Id)
            })
            //绘制道岔
            json.RailTurnouts.map(ele => {
                drawRailTurnout(ctx, ele)
            })
            //绘制功能按钮
            json.OprBtns.map((ele, index) => {
                // OprCountCoord Coord
                drawButton(ctx, ele.Name, ele.NameCoord, ele.OprCountCoord, ele.Id, `btn${index}`);
            })
            //绘制信号机
            json.Lamp.map(ele => {
                drawLamp(ctx, ele.Name, ele.NameCoord, ele.VLineCoord, ele.Id)
            })
            //绘制站台
            json.Platforms.map(ele => {
                drawStation(ctx, ele.Coord, ele.Id)
            })
            //绘制箭头
            json.OrtArrows.map(ele => {
                drawArrow(ctx, ele.Name, ele.NameCoord, ele.Coord, ele.Id)
            })
            //绘制停靠线
            json.RailEndTypes.map(ele => {
                drawDockingLine(ctx, ele.Name, ele.NameCoord, ele.Coord, ele.Id)
            })
            //绘制NoElecAreas 无电区限
            json.NoElecAreas.map(ele => {
                drawNoElecAreas(ctx, ele.Coord, ele.Id)
            })
            //绘制信号机按钮
            json.RtBtns.map(ele => {
                drawRtBtns(ctx, ele.RectCoord, ele.Id, ele.Name, ele.Type)
            })
            //自定义绘制1
            drawLine(ctx)
        },
        //格式化json数据
        formatJson() {
            let { StaNames, JYJs, LampCtrlModes, Labels, OrtRects, RailInSta, RailSecs, RailTurnouts, RailEndTypes, OprBtns, OrtArrows, Lamp, RtBtns, Platforms, NoElecAreas } = this.data.json
            return new Promise((reslove, reject) => {
                //站台名称
                StaNames.map(ele => {
                    ele.NameCoord = ele.NameCoord.split(',')
                });

                //文字
                Labels.map(ele => {
                    ele.NameCoord = ele.NameCoord.split(',')
                })

                //绝缘节
                JYJs.map(ele => {
                    ele.Coord = ele.Coord.map(item => {
                        return item.split(',')
                    })
                })

                //信号灯
                LampCtrlModes.map(ele => {
                    ele.NameCoord = ele.NameCoord.split(',')
                    ele.Coord = ele.Coord.split(',')
                })

                //包围框
                OrtRects.map(ele => {
                    ele.NameCoord = ele.NameCoord.split(',')
                    ele.Coord = ele.Coord.map(item => {
                        return item.split(',')
                    })
                })

                //股道
                RailInSta.map(ele => {
                    ele.NameCoord = ele.NameCoord.split(',')
                    ele.Coord = ele.Coord.map(item => {
                        return item.split(',')
                    })
                })

                //轨道
                RailSecs.map(ele => {
                    ele.NameCoord = ele.NameCoord.split(',');
                    ele.NameCoord[1] = Number(ele.NameCoord[1]) + 30
                    ele.Coord = ele.Coord.map(item => {
                        return item.split(',')
                    })
                })

                //道岔
                RailTurnouts.map(ele => {
                    if (ele.Id % 2 !== 0) {
                        ele.NameCoord = ele.NameCoord.split(',');
                        //todo 处理道岔坐标 6个点
                        ele.StartRailCoord = ele.StartRailCoord.map(ele => {
                            return ele.split(',')
                        })
                        ele.PositiveRailCoord = ele.PositiveRailCoord.map(ele => {
                            return ele.split(',')
                        })
                        ele.NegativeRailCoord = ele.NegativeRailCoord.map(ele => {
                            return ele.split(',')
                        })
                        ele.PositiveSwitchCoord = ele.PositiveSwitchCoord.map(ele => {
                            return ele.split(',')
                        })
                        ele.NegativeSwitchCoord = ele.NegativeSwitchCoord.map(ele => {
                            return ele.split(',')
                        })
                        ele.StartSwitchCoord = ele.StartSwitchCoord.map(ele => {
                            return ele.split(',')
                        })
                        //创建一个坐标对象
                        ele.Coord = {
                            Name: ele.Name,
                            StartRailCoord: ele.StartRailCoord,
                            PositiveRailCoord: ele.PositiveRailCoord,
                            NegativeRailCoord: ele.NegativeRailCoord,
                            PositiveSwitchCoord: ele.PositiveSwitchCoord,
                            NegativeSwitchCoord: ele.NegativeSwitchCoord,
                            StartSwitchCoord: ele.StartSwitchCoord
                        }
                    }
                })

                //绘制停靠线
                RailEndTypes.map(ele => {
                    ele.Coord = ele.Coord.map(item => {
                        return item.split(',')
                    })
                    ele.NameCoord = ele.NameCoord.split(',')
                })

                //功能按钮
                OprBtns.map(ele => {
                    ele.OprCountCoord = ele.OprCountCoord.split(',');
                    ele.NameCoord = ele.NameCoord.split(',');
                })

                //箭头
                OrtArrows.map(ele => {
                    ele.Coord = ele.Coord.map(item => {
                        return item.split(',')
                    })
                })

                //信号机
                Lamp.map(ele => {
                    ele.NameCoord = ele.NameCoord.split(',');
                    ele.VLineCoord = ele.VLineCoord.split(',')
                })
                
                //信号机按钮
                RtBtns.map(ele => {
                    ele.RectCoord = ele.RectCoord.split(',')
                })

                //站台
                Platforms.map(ele => {
                    ele.Coord = ele.Coord.map(item => {
                        return item.split(',')
                    })
                })
                //NoElecAreas 无电区限
                NoElecAreas.map(ele => {
                    ele.Coord = ele.Coord.map(item => {
                        return item.split(',')
                    })
                })
                reslove()
            }).catch(err => {
                console.log(err)
            })
        },
        createCanvasB() {
            let canvas = document.getElementById('b');
            let ctx = canvas.getContext('2d');
            this.data.ctxB = ctx;
        },
        showTrack(ctx, data) {
            //只作一次绘制操作
            if (this.data.isDraw) {
                return
            }
            this.data.isDraw = true
            let path = new Path2D();
            path.rect(1594, 555, 280, 36);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([3, 3]);
            ctx.stroke(path);
        },
        clearTrack(ctx, data) {

        }
    }
})
</script>

<style scoped>
#stage {
    position: relative;

}

canvas {
    position: absolute;

}

#b {
    /* background: black; */
    z-index: 2;
}

#c {
    z-index: 1;
    background: black;
}
</style>