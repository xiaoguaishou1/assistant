//只绘制单站
import _ from 'loadsh';
import Bus from './EventBus'
//绘制文字
export function drawText(ctx, text, x, y, color, font, id) {
    if (id % 2 !== 0) {
        ctx.beginPath();
        ctx.font = font;
        ctx.fillStyle = color;
        //增加border属性
        ctx.strokeStyle = '#000';
        ctx.fillText(text, x, y);
        ctx.closePath();
    }
}

//绘制绝缘节
export function drawInsulator(ctx, ele1, ele2, lineWidth, color = '#999', id) {
    if (id % 2 !== 0) {
        //第一个点
        let [x1, y1] = ele1;
        //第二个点
        let [x2, y2] = ele2;
        //绘制绝缘节
        let path = new Path2D();
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.stroke(path);
    }
}

//绘制信号灯
export function drawSignal(ctx, Name, NameCoord, Coord, color = '#999', id) {
    if (id % 2 !== 0) {
        //信号的状态 0:灰色 熄灭  1:绿色 常亮 2:黄色 闪烁
        //绘制信号灯名称 
        let [x1, y1] = NameCoord;
        let [x2, y2] = Coord;
        //缩短文字和信号灯的距离 y轴方向
        drawText(ctx, Name, x1, y1 - 7, '#fff', '12px Arial');

        //绘制信号灯 如果信号灯是灰色正常绘制 如果是黄色正常绘制
        let path = new Path2D();
        path.arc(x2, y2, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill(path);
    }
}

// 矩形
export function drawRect(ctx, Name, NameCoord, Coord, id) {
    if (id % 2 !== 0) {
        //绘制描述
        drawText(ctx, Name, NameCoord[0], NameCoord[1], '#fff', '12px Arial');
        let [x1, y1] = Coord[0];
        let [x2, y2] = Coord[1];
        //绘制矩形
        let path = new Path2D();
        path.rect(x1, y1, x2, y2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#fff';
        ctx.stroke(path);
    }

}

//绘制股道
export function drawTrack(ctx, Name, NameCoord, Coord, id) {
    if (id % 2 !== 0) {
        //绘制描述 y轴坐标增加
        drawText(ctx, Name, NameCoord[0], NameCoord[1], '#fff', '12px Arial');
        //绘制股道
        const path = new Path2D();
        Coord.forEach((item, index) => {
            let [x, y] = item;
            if (index === 0) {
                path.moveTo(x, y);
            } else {
                path.lineTo(x, y);
            }
        })
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00f';
        ctx.stroke(path);

        //绘制6个矩形 重叠在股道上
        let pathRectList = [];
        for (let i = 0; i < 6; i++) {
            let pathRect = new Path2D();
            pathRectList.push(pathRect);
            pathRect.rect(1584, 560 + 86 * i, 300, 20);
            ctx.fillStyle = "#fff";
            ctx.fill(pathRect);
        }

        //节流  
        let throttle = _.throttle(function (e) {
            let x = e.clientX;
            let y = e.clientY;
            for (let i = 0; i < pathRectList.length; i++) {
                if (ctx.isPointInPath(pathRectList[i], x, y)) {
                    Bus.emit('showTrack');
                } else {
                    Bus.emit('clearTrack')
                }
            }
        }, 100);

        //注册事件
        window.addEventListener('mousemove', throttle)

        //右键点击 
        window.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            let x = e.offsetX;
            let y = e.offsetY;
            for (let i = 0; i < pathRectList.length; i++) {
                if (ctx.isPointInPath(pathRectList[i], x, y)) {
                    createMenu(x, y, i);
                }
            }
        })
    }
}

//绘制轨道
export function drawRail(ctx, Name, NameCoord, Coord, id) {
    if (id % 2 !== 0) {
        //绘制描述
        drawText(ctx, Name, NameCoord[0], NameCoord[1] - 5, '#fff', '12px Arial');
        //绘制轨道
        let [x1, y1] = Coord[0];
        let [x2, y2] = Coord[1];
        let path = new Path2D();
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00f';
        ctx.stroke(path);
    }
}

//绘制功能按钮
export function drawButton(ctx, Name, NameCoord, Coord, id) {
    if (id % 2 !== 0) {
        //绘制描述
        drawText(ctx, Name, NameCoord[0], NameCoord[1], '#fff', '12px Arial');
        let x = Coord[0];
        let y = Coord[1];
        const circle = new Path2D();
        circle.rect(x - 20, y, 20, 20);
        ctx.fillStyle = '#fff';
        ctx.fill(circle);

        let path = new Path2D();
        path.rect(x - 30, y - 30, 30, 20);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ff0';
        ctx.stroke(path);

        //监听点击事件
        window.addEventListener('click', function (event) {
            if (ctx.isPointInPath(circle, event.offsetX, event.offsetY)) {
                this.alert('点中了' + Name)
            }
        });

        //监听鼠标右键
        window.addEventListener('contextmenu', function (event) {
            if (ctx.isPointInPath(circle, event.offsetX, event.offsetY)) {
                event.preventDefault();
                console.log('点中了', Name)
            }
        })

        //监听鼠标移动事件
        let throttle = _.throttle(function (event) {
            //通过鼠标运动轨迹判断是否在绘制的图形内
            if (ctx.isPointInPath(circle, event.offsetX, event.offsetY)) {
                circle.rect(x - 20, y, 20, 20);
                ctx.fillStyle = '#ff0';
                ctx.fill(circle);
                console.log('移入了', Name)
            } else {
                circle.rect(x - 20, y, 20, 20);
                ctx.fillStyle = '#fff';
                ctx.fill(circle);
                console.log('移出了', Name)
            }
        }, 300);
        window.addEventListener('mousemove', throttle)
    }
}

//绘制信号机
export function drawLamp(ctx, Name, NameCoord, VLineCoord, id) {
    if (id % 2 !== 0) {
        //绘制描述
        drawText(ctx, Name, NameCoord[0], NameCoord[1], '#fff', '12px Arial');
        //坐标位置 VLineCoord 
        //todo
    }
}

//绘制站台
export function drawStation(ctx, Coord, id) {
    if (id % 2 !== 0) {
        //坐标位置
        let path = new Path2D();
        let [x1, y1] = Coord[0];
        path.moveTo(x1, y1);
        for (let i = 0; i < Coord.length; i++) {
            if (i + 1 >= Coord.length) return
            let [x, y] = Coord[i + 1];
            path.lineTo(x, y);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#f0f';
            ctx.stroke(path);
        }
    }
}

//绘制箭头
export function drawArrow(ctx, Name, NameCoord, Coord, id) {
    if (id % 2 !== 0) {
        //绘制描述
        if (Name) {
            drawText(ctx, Name, NameCoord[0], NameCoord[1], '#fff', '12px Arial');
        }
        //坐标位置 
        //绘制箭头
        const length = Coord.length;
        const path = new Path2D();
        let [x1, y1] = Coord[0];
        let [x3, y3] = Coord[length - 1];
        path.moveTo(x1, y1);
        path.lineTo(x3, y3);
        path.lineTo(x1, y1);
        for (let i = 0; i < Coord.length; i++) {
            if (i + 1 >= Coord.length) return;
            let [x2, y2] = Coord[i + 1];
            path.lineTo(x2, y2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#fff';
            ctx.stroke(path);
        }
    }
}

//重写绘制道岔的方法drawRailTurnout
export function drawRailTurnout(ctx, Element) {
    const { Coord, Name, NameCoord } = Element;
    //绘制描述
    drawText(ctx, Name, NameCoord[0], Number(NameCoord[1]) + 20, '#0f0', '18px Arial');

    for (let key in Coord) {
        //判断是否是数组
        if (Coord[key] instanceof Array) {
            let arr = Coord[key];
            let path = new Path2D();
            for (let i = 0; i < arr.length; i++) {
                let [x, y] = arr[i];
                if (i == 0) {
                    path.moveTo(x, y)
                } else {
                    path.lineTo(x, y)
                }
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#00f';
                ctx.stroke(path);
            }
        }
    }
}

//绘制停靠线
export function drawDockingLine(ctx, Name, NameCoord, Coord, id) {
    if (id % 2 !== 0) {
        //绘制描述
        drawText(ctx, Name, NameCoord[0], NameCoord[1], '#fff', '12px Arial');
        //坐标位置 
        //遍历Coord 获取每一个坐标点
        let [x1, y1] = Coord[0];
        let [x2, y2] = Coord[1];
        let [x3, y3] = Coord[2];
        let [x4, y4] = Coord[3];
        let [x5, y5] = Coord[4];
        let [x6, y6] = Coord[5];
        let [x7, y7] = Coord[6];
        let [x8, y8] = Coord[7];
        let [x9, y9] = Coord[8];

        //绘制停靠线
        const path = new Path2D();
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke(path);

        //绘制停靠线
        path.moveTo(x3, y3);
        path.lineTo(x4, y4);
        path.lineTo(x5, y5);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke(path);

        //绘制停靠线
        path.moveTo(x6, y6);
        path.lineTo(x7, y7);
        path.lineTo(x8, y8);
        path.lineTo(x9, y9);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke(path);

    }
}

//绘制无电区限
export function drawNoElecAreas(ctx, Coord, id) {
    if (id % 2 !== 0) {
        for (let i = 0; i < Coord.length; i++) {
            let [x1, y1] = Coord[i];
            let [x2, y2] = Coord[Coord.length - 1];
            //绘制
            const path = new Path2D();
            path.moveTo(x1, y1);
            path.lineTo(x2, y2);
            ctx.lineWidth = 4;
            //灰色
            ctx.strokeStyle = '#ccc';
            ctx.stroke(path);
        }
    }
}

//绘制信号机按钮
export function drawRtBtns(ctx, rectCoord, id, Name, type) {
    // type 0 接发车 1 通过 2.引导 3.变通 4.调车
    // 判断type 输出 描述
    let text = '';
    switch (type) {
        case 0:
            text = '接发车';
            break;
        case 1:
            text = '通过';
            break;
        case 2:
            text = '引导接车';
            break;
        case 3:
            text = '变通';
            break;
        case 4:
            text = '调车';
            break;
        default:
            break;
    }

    if (id % 2 !== 0) {
        let [x, y] = rectCoord;
        let path = new Path2D();
        path.rect(x, y, 20, 20);
        ctx.lineWidth = 1;
        ctx.fillStyle = '#0f0';
        ctx.fill(path);
        window.addEventListener('click', _.debounce(function (e) {
            //判断是否点击中了矩形
            if (ctx.isPointInPath(path, e.clientX, e.clientY)) {
                alert('我点击了按钮' + Name + text);
            }
        }), 300)
    }
}

//自定义绘制线段
export function drawLine(ctx) {
    return
    const path = new Path2D();
    path.moveTo(2110, 490);
    path.lineTo(2146, 490);
    path.lineTo(2146, 490);
    path.lineTo(2280, 580);

    ctx.lineWidth = 4;
    //蒂芙尼蓝
    ctx.strokeStyle = '#0ff';
    // ctx.strokeStyle = '#fff';
    ctx.stroke(path);

    path.moveTo(2120, 580);
    path.lineTo(2600, 580);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0ff';
    ctx.stroke(path);
}


//创建菜单组件
//判断是 封锁 还是解锁
let flag = true
export function createMenu(x, y, index) {
    // 创建一个菜单
    if (document.getElementById('menu')) return;
    let menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.width = '100px';
    menu.style.zIndex = 9;
    menu.id = 'menu'

    //2.创建一个ul 用于显示菜单项
    let ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
    ul.style.width = '100%';
    ul.style.height = '100%';
    ul.style.backgroundColor = '#fff';
    ul.style.borderRadius = '5px';

    //3.创建li 用于显示菜单项
    let li1 = document.createElement('li');
    li1.style.width = '100%';
    li1.style.height = '25px';
    li1.style.lineHeight = '25px';
    li1.style.textAlign = 'center';
    li1.style.boxShadow = '0 0 5px #ccc';
    li1.style.cursor = 'pointer';
    li1.style.borderRadius = '5px';
    li1.innerHTML = '封锁(解锁)';

    let li2 = document.createElement('li');
    li2.style.width = '100%';
    li2.style.height = '25px';
    li2.style.lineHeight = '25px';
    li2.style.textAlign = 'center';
    li2.style.boxShadow = '0 0 5px #ccc';
    li2.style.cursor = 'pointer';
    li2.style.marginTop = '2px 0 0 0'
    li2.innerHTML = '总人解';

    let li3 = document.createElement('li');
    li3.style.width = '100%';
    li3.style.height = '25px';
    li3.style.lineHeight = '25px';
    li3.style.textAlign = 'center';
    li3.style.boxShadow = '0 0 5px #ccc';
    li3.style.cursor = 'pointer';
    li3.style.marginTop = '2px 0 0 0';
    li3.innerHTML = '分路不良';

    //4.将li添加到ul中
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);

    //5.将ul添加到div中
    menu.appendChild(ul);
    //6.将div添加到body中
    document.body.appendChild(menu);
    //7.监听鼠标点击事件 重写对应股道的事件  //第一次点击是封锁 第二次点击是解锁
    function click1() {
        document.body.removeChild(menu);
        //封锁股道的操作
        if (flag) {
            console.log('封锁股道的操作', index);
            Bus.emit('blockTrack');
            flag = false;
        } else {
            console.log('解锁股道的操作', index);
            Bus.emit('unblockTrack');
            flag = true;
        }
    }

    function click2() {
        document.body.removeChild(menu);
        console.log('第二股道的操作');
    }



    if (index == 0) {
        li1.addEventListener('click', click1)
    } else if (index == 1) {
        li1.addEventListener('click', click2)
    }


    //根据index 绑定事件
    //判断是否点击了菜单以外的地方
    document.addEventListener('click', function (event) {
        if (event.target !== li1 && event.target !== li2 && event.target !== li3) {
            if (document.body.contains(menu)) {
                document.body.removeChild(menu);
            }
        }
    })
}
