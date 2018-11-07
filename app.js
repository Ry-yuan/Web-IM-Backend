const app = require('express')();
const server = require('http').Server(app);
// websocket工具
const io = require('socket.io')(server);
const socketMessage = require('./config/websocket-connect');
const Router = require('./router');
// 端口
const PORT = process.env.PORT || 8000;
// 解析post数据
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// express-session
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const connectMongodb = require('./config/db-connect');
app.use(session({
    secret: 'sid',
    resave: false,
    store: new FileStore(),
    saveUninitialized: true,
    cookie: {
        maxAge: 10 * 60 * 1000 // 有效期，单位是毫秒
    }
}));
// 引入路由
app.use('/api', Router);
// 数据库连接
connectMongodb();
// socket连接
socketMessage(io);

server.listen(PORT, () => {
    console.log(`Server Start at  ${PORT} port`);
});