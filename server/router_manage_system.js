var express = require('express');
var router = express.Router();
const md5 = require('md5-node');
const mysql = require('mysql');



const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dfihezg3',
    database: 'study_room'
});
con.connect();

function access(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

router.get('/', (request, response) => {
    console.log("GET: / " + new Date());
    response.render('404.html');
});

router.get('/login', (request, response) => {
    if(request.cookies.username == undefined) {
        response.render('login.html');
    } else {
        response.redirect('/manage');
    }
});

router.get('/manage', (request, response) => {
    if(request.cookies.username == undefined) {
        response.redirect('/login');
    } else {
        response.render('manage.html');
    }
});

router.get("/test", (request, response) => {
    console.log("GET: /test " + new Date());
    response.json({
        msg: "软工课题小组",
        data: "收到数据：" + JSON.stringify(request.body)
    });
});

router.post("/test", (request, response) => {
    console.log("POST: /test " + new Date());
    response.json({
        msg: "软工课题小组",
        data: "收到数据：" + JSON.stringify(request.body)
    });
});

router.post('/mgrlogin', (request, response) => {
    var name = request.body.name;
    var passwd = request.body.passwd;
    console.log(request.body);
    access("select buildingID,COUNT(id) as num,name from manager where name='" + name + "' and password='" + passwd + "' GROUP BY buildingID;")
        .then(res => {
            console.log(res[0]);
            if (res[0].num == 1) {
                console.log(res[0].name)
                response.cookie('username', res[0].name);
                response.cookie('buildingID', res[0].buildingID);
                response.json({
                    data: "登录成功",
                    code: 0
                });
            } else {
                response.json({
                    data: "账号或密码错误",
                    code: 1
                });
            }
        });
});

router.post('/mgrlogout', (request, response) => {
    response.clearCookie('username');
    response.clearCookie('buildingID');
    response.redirect('/login');
});

router.post('/cusomerinfo', (request, response) => {
    console.log('/cusomerinfo', request.body);
    var id = request.body.buildingid;
    access('select distinct `customer`.name,`order`.phone,age,sex,`e-mail` as email from customer,building,`order` where `order`.`building-id`='+id+' and `order`.phone=customer.phone;')
    .then(res => {
        response.json({
            length: res.length,
            value: res
        });
    });
});

router.post('/orderlist', (request, response) => {
    console.log('/orderlist');
    var id = request.body.buildingid;
    access('select id,`start-time` as starttime,`end-time` as endtime,`pay-time` as paytime,price,handle,phone,type,roomid from `order` where `building-id`='+id+" ORDER BY handle='已支付' DESC;")
    .then(res => {
        response.json({
            length: res.length,
            value: res
        });
    });
});

router.post('/roominfo', (request, response) => {
    console.log('/roominfo', request.body);
    var id = request.body.buildingid;
    access('select `room-id` as room_number,type,price,state,detail from room where `build-id`='+id+" ORDER BY state DESC;")
    .then(res => {
        response.json({
            length: res.length,
            value: res
        });
    });
});

router.post('/refundinfo', (request, response) => {
    console.log('/refundinfo', request.body);
    var id = request.body.buildingid;
    access('select refund.id,refund.state,refund.applytime,`pay-time` as paytime,`price`,phone,type from refund,`order` where `order`.`building-id`='+id+' and refund.id=`order`.id AND state="未处理"')
    .then(res => {
        response.json({
            length: res.length,
            value: res
        });
    });
});

router.post('/allocate', (request, response) => {
    console.log('/allocate', request.body);
    var roomNumber = request.body.roomid;
    var bid = request.body.buildingid;
    var id = request.body.id;
    access("UPDATE room SET state='已预定' WHERE `build-id`="+bid+" and `room-id`="+roomNumber+" and state='未预定';")
    .then(res => {
        if(res.affectedRows == 1) {
            access('UPDATE `order` SET `handle`="已处理", roomid='+roomNumber+' WHERE id='+id+';')
            .then(res => {
                if(res.affectedRows == 1) {
                    response.json({
                        msg: "处理成功",
                        code: 0
                    });
                } else {
                    response.json({
                        msg: "处理订单时出错",
                        code: -2
                    });
                }
            });
        } else {
            response.json({
                msg: "预定失败",
                code: -1
            });
        }
    });
});

router.post('/setroominfo', (request, response) => {
    console.log('/setroominfo', request.body);
    var buildID = request.body.buildingid;
    var roomID = request.body.roomID;
    var type = request.body.type;
    var price = request.body.price;
    var detail = request.body.detail;

    access("UPDATE room SET type='"+type+"',price="+price+",detail='"+detail+"' where `room-id`="+roomID+" and `build-id`="+buildID+";")
    .then(res => {
        if(res.affectedRows == 1) {
            response.json({
                code: 0,
                msg: "房间信息保存成功"
            });
        } else {
            response.json({
                code: -1,
                msg: "服务器错误"
            });
        }
    });
});

router.post('/setrefund', (request, response) => {
    console.log('/setrefund', request.body);
    var id = request.body.id;
    access("UPDATE refund SET state='已处理' WHERE id="+id+";").then(res => {
        if(res.affectedRows == 1) {
            response.json({
                code: 0,
                msg: "订单已受理"
            });
        } else {
            response.json({
                code: -1,
                msg: "服务器错误"
            });
        }
    });
});

router.post('/getNotice', (request, response) => {
    var id = request.body.buildingID;
    var result = {};
    access("select COUNT(id) as newOrder from `order` where `building-id`="+id+" AND handle='已支付';")
    .then(res => {
        result.new_order = res[0].newOrder;
        access("select COUNT(refund.id) as newRefund from refund,`order` where refund.id=`order`.id AND `order`.`building-id`="+id+" AND state='未处理';")
        .then(res => {
            result.new_refund = res[0].newRefund;
            response.json(result);
        });
    });
});

router.post('/setroomstate', (request, response) => {
    var buildingID = request.body.buildingID;
    var roomID     = request.body.roomID;
    var orderID    = request.body.orderID;
    console.log(`RESET ${buildingID}-${roomID}`)
    access("UPDATE room SET state='未预定' WHERE `room-id`="+roomID+" AND `build-id`="+buildingID+";")
    .then(res => {
        access("UPDATE `order` SET `handle`='待评价' WHERE `id`="+orderID+";").then(res => {
            response.json({
                msg: "成功！",
                code: 0
            });
        });
    });
});

module.exports = router;
