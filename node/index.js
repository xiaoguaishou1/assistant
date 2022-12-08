//生成express服务
import express from 'express';
import drawjson from '../src/json/station.json'
const app = express()
const port = 3000

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    if (req.method == 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
})

//访问路由 发送json数据
app.get('/drawjson', (req, res) => {
    res.send(drawjson)
})


//监听端口
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})