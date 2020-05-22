const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router_manage_system = require('./router_manage_system'),
      router_app_client = require('./router_app_client');
const cookieParser = require('cookie-parser');


app.all('*', function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    response.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (request.method == 'OPTIONS') {
        response.send(200);
    } else {
        next();
    }
});
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', require('express-art-template'));
app.use(router_manage_system);
app.use(router_app_client);
app.use('/static', express.static('./static'));


               // 服务器私网地址、端口。
app.listen(8080, '0.0.0.0', function () {
    console.log('running...');
});
