var express = require('express');
var router = express.Router();
const md5 = require('md5-node');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const myDate = require('./static/js/ComparableDate');
const Alipay = require('alipay-node-sdk');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dfihezg3',
    database: 'study_room'
});
const multer = require('multer');
con.connect();


function access(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

router.post('/register', (request, response) => {
    var phone = request.body.phone;
    var passwd = request.body.password;
    access("select COUNT(phone) as num from customer where phone='" + phone + "';")
        .then(res => {
            if (res[0].num == 0) {
                access("INSERT INTO `study_room`.`customer`(`phone`, `password`) VALUES ('" + phone + "', '" + passwd + "');")
                    .then(res => {
                        fs.mkdirSync('./static/users/' + phone);

                        readable = fs.createReadStream('./static/images/fig.jpg');
                        writable = fs.createWriteStream('./static/users/' + phone + '/fig.jpg');
                        readable.pipe(writable);

                        response.json({
                            data: "注册成功",
                            code: 0
                        });
                    });
            } else {
                response.json({
                    data: "该手机号已存在",
                    code: 1
                });
            }
        });
});

router.post('/login', (request, response) => {
    var phone = request.body.phone;
    var passwd = request.body.password;
    access("select COUNT(phone) as num from customer where phone='" + phone + "' and password='" + passwd + "';")
        .then(res => {
            if (res[0].num == 1) {
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

router.post('/information', (request, response) => {
    var phone = request.body.telphone;
    console.log('POST /information --->' + phone);
    access("select `name`,`phone`,`age`,`sex`,`e-mail` from customer where phone='" + phone + "';")
        .then(res => {
            response.json({
                path: "http://120.27.208.220/static/users/" + phone + "/fig.jpg",
                info: res[0]
            });
        });
});

router.post('/setuserinfo', (request, response) => {
    if (Object.keys(request.body) == 0) {
        let upload = multer({
            dest: './static/users/tmp'
        }).single('photo');
        upload(request, response, function (err) {
            let phone = request.body.u_phone;
            console.log(request.file);
            fs.renameSync(request.file.path, './static/users/' + phone + "/fig.jpg");
            response.json({
                path: "http://120.27.208.220/static/users/" + phone + "/fig.jpg"
            });
        });
    } else {
        console.log('POST /setuserinfo --->' + request.body);
        var name = request.body.my_name;
        var age = request.body.my_age;
        var sex = request.body.my_sex;
        var email = request.body.my_email;
        var phone = request.body.my_phone;
        access("UPDATE customer SET name='" + name + "', age=" + age + ", sex='" + sex + "', `e-mail`='" + email + "' WHERE phone='" + phone + "';")
            .then(res => {
                response.json({
                    msg: "修改完成",
                    code: 0
                });
            });
    }
});

router.post('/changepassword', (request, response) => {
    var phone = request.body.telphone;
    var oldpass = request.body.old;
    var newpass = request.body.new;
    access("select COUNT(phone) as num from customer where phone='" + phone + "' and password='" + oldpass + "';")
        .then(res => {
            if (res[0].num == 1) {
                access("UPDATE customer SET password='" + newpass + "' WHERE phone='" + phone + "';")
                    .then(res => {
                        if (res.affectedRows) {
                            response.json({
                                msg: "修改完成",
                                code: 0
                            });
                        } else {
                            response.json({
                                msg: "修改失败",
                                code: -2
                            });
                        }
                    });
            } else {
                response.json({
                    msg: "原密码输入错误",
                    code: -1
                });
            }
        });
});

router.post('/comment', (request, response) => {
    console.log('POST /comment --->' + request.body);
    var orderID = request.body.id;
    var score = Number(request.body.score);
    var text = request.body.value.views;
    var anonymous = request.body.anonymous;

    access("UPDATE `study_room`.`order` SET comment='" + text + "',score=" + score + ",anonymous='" + anonymous + "',handle='已评价' WHERE id=" + orderID + ";")
        .then(res => {
            access('select COUNT(id) as num, AVG(score) as avg from `order` where `building-id` in (select `building-id` from `order` where id=' + orderID + ') and handle="已评价";')
                .then(res => {
                    var new_score = res[0].avg;
                    var new_count = res[0].num;
                    access('UPDATE building SET score=' + new_score + ',comment_acc=' + new_count + ' where id in (select `building-id` from `order` where id=' + orderID + ');')
                        .then(res => {
                            console.log(res);
                            response.json({
                                code: 0,
                                msg: '评价成功'
                            });
                        });
                });
        });

});

router.post('/order', (request, response) => {
    console.log('POST /order --->' + request.body.telphone);
    var phone = request.body.telphone;
    access("select distinct `order`.id,name,address,`order`.type,`start-time`,`end-time`,`order`.`price`,handle,roomid from `order`,building,room where `order`.`phone`=" + phone + " and handle<>'退款' and `order`.`building-id`=`building`.`id`  and `order`.`type`=`room`.`type`;")
        .then(res => {
            console.log(res);
            response.json(res);
        });
});

router.post('/history', (request, response) => {
    var history = request.body.arr;
    console.log('POST /history --->' + history);

    var sql = "select id,name,address,`open-time` from building where id IN (";
    for (let i in history) {
        sql += history[i] + ",";
    }
    sql += ")";
    sql = sql.replace(',)', ');');
    access(sql).then(res => {
        for (let i in res) {
            res[i].imgPath = 'http://120.27.208.220/static/studyroom/' + res[i].id + "/image.jpg";
        }
        console.log(res);
        response.json(res);
    });
});
router.post('/my', (request, response) => {
    var phone = request.body.phone;
    access("select name from customer where phone='" + phone + "';")
        .then(res => {
            response.json({
                figPath: "http://120.27.208.220/static/users/" + phone + "/fig.jpg",
                username: res[0].name
            });
        });
});

router.post('/search', (request, response) => {
    var query = request.body.query.replace(/自习室/, '自习');
    if (typeof request.body.extra != 'undefined') {
        console.log(request.body.extra);
        var sort = request.body.extra.sort,
            buildingName = request.body.extra.buildingName,
            facility = request.body.extra.facility,
            openTime = request.body.extra.openTime;

        var flag = false;
        var sql = "select id,name,address,`open-time`,score,comment_acc from building where";
        var sql_optime = " `open-time`=" + openTime;
        var sql_facility = " id IN (select `build-id` from room where detail LIKE " + facility.join(' or detail like ') + ")";
        var sql_name1 = " name LIKE '%" + query + "%' or";
        var sql_name2 = " name IN(" + buildingName.join(',') + ") and";
        var sql_addr = " address like '%" + query + "%'";
        var sql_sort = " ORDER BY " + sort + " DESC;";
        if (openTime.length != 0) {
            sql += sql_optime;
            flag = true;
        }
        if (facility.length != 0) {
            if (flag) sql += " and";
            sql += sql_facility;
            flag = true;
        }
        if (buildingName != 0) {
            if (flag) sql += " and";
            sql += sql_name2;
        } else {
            if (flag) sql += " and";
            sql += sql_name1;
        }
        if (sort != "") {
            sql += (sql_addr + sql_sort);
        } else {
            sql += sql_addr + ';';
        }

        console.log(sql);
        access(sql).then(res => {
            for (let i in res) {
                res[i].imgPath = `http://120.27.208.220/static/studyroom/${res[i].id}/image.jpg`;
            }
            response.json({
                data: res,
                size: res.length
            });
        });
    } else {
        access("select id,`name`,`address`,`open-time`,`score`,`comment_acc` from building where name LIKE '%" + query + "%' or address like '%" + query + "%';")
            .then(res => {
                for (let i in res) {
                    res[i].imgPath = `http://120.27.208.220/static/studyroom/${res[i].id}/image.jpg`;
                }
                response.json({
                    data: res,
                    size: res.length
                });
            });
    }

});

router.post('/getrefundorder', (request, response) => {
    // 退款记录
    var phone = request.body.phone;
    var sql1 = "select `building`.`name`,`refund`.`state`,`order`.`price`,`refund`.`applytime`,`order`.`type`,`refund`.`id` ";
    var sql2 = "from `refund`,`building`,`order` where `order`.phone='" + phone + "' and `refund`.`id`=`order`.`id` and `order`.`building-id`=`building`.`id`;";
    access(sql1 + sql2).then(res => {
        console.log(res);
        response.json({
            length: res.length,
            value: res
        });
    });
});

router.post('/getfavorite', (request, response) => {
    var ids = request.body.idlist;
    var sql = 'select id,name,`open-time`,address from building where id IN(';
    for (let i in ids) {
        sql += ids[i] + ",";
    }
    sql += ")";
    sql = sql.replace(',)', ');');
    access(sql).then(res => {
        for (let i in res) {
            res[i].imgPath = 'http://120.27.208.220/static/studyroom/' + res[i].id + "/image.jpg";
        }
        response.json(res);
    });
});

router.post('/detailinfo', (request, response) => {
    var id = request.body.id;
    var result = {};
    access("select phone from building where building.id=" + id + ";")
        .then(res => {
            res[0].imgPath = 'http://120.27.208.220/static/studyroom/' + id + "/image.jpg";
            result.buildingInfo = res[0];

            access('select distinct type,detail,price from room where `build-id`=' + id + ';')
                .then(res => {
                    for (let i in res) {
                        res[i].imgPath = `http://120.27.208.220/static/studyroom/${id}/${res[i].type}.jpg`;
                    }
                    result.roomInfo = res;
                    access('select anonymous,comment,name,`order`.phone from `order`,customer where `building-id`=' + id + ' and `order`.phone=customer.phone and handle="已评价";')
                        .then(res => {
                            for (let i in res) {
                                res[i].figPath = "http://120.27.208.220/static/users/" + res[i].phone + "/fig.jpg";
                            }
                            result.comments = res;
                            response.json(result);
                        });
                });
        });
});

router.post('/orderinfo', (request, response) => {
    var id = request.body.id;
    var phone = request.body.phone;
    var result = {};
    access("select name,address,phone from building where id=" + id + ";")
        .then(res => {
            result.buildinfo = res;
            access("select name from customer where customer.phone='" + phone + "';")
                .then(res => {
                    result.name = res[0].name;
                    response.json(result);
                });
        });
});

router.post('/refund', (request, response) => {
    var id = request.body.id;
    var currentDate = (function () {
        var d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`;
    })();
    access('select `start-time` as stime from `order` where id=' + id + ';').then(res => {
        var stime = new myDate(res[0].stime);
        if ((new myDate(currentDate)).earlyThan(stime)) {
            access("INSERT INTO refund(id,state,applytime) VALUES (" + id + ",'未处理', '" + currentDate + "')")
                .then(res => {
                    access("UPDATE `order` SET `handle`='退款' WHERE `id`=" + id + ";")
                        .then(res => {
                            console.log(res);
                            response.json({
                                code: 0,
                                msg: "已发起退款"
                            });
                        });
                });
        } else {
            response.json({
                code: 1,
                msg: "预定时间已过，无法退款"
            });
        }
    });
});

router.post('/creatorder', (request, response) => {
    console.log('order created')
    var stime = request.body.startTime;
    var etime = request.body.endTime;
    var d = new Date();
    var ptime = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
    var price = request.body.price;
    var phone = request.body.phone;
    var buildingID = request.body.buildingID;
    var type = request.body.type;
    access("INSERT INTO `order`(`start-time`,`end-time`,`pay-time`,price,handle,phone,`building-id`,type) VALUES ('" + stime + "','" + etime + "','" + ptime + "'," + price + ",'已支付'," + phone + "," + buildingID + ",'" + type + "')")
        .then(res => {
            console.log(res);
            response.json({
                msg: "订单创建成功",
                code: 0
            });
        })
});








router.post('/pay', async (request, response) => {
    let outTradeId = Date.now().toString();
    var ali = new Alipay({
        appId: '2016102400752734',
        notifyUrl: 'http://120.27.208.220/paycallback',
        rsaPrivate: path.resolve('./pem/private-key.pem'),
        rsaPublic: path.resolve('./pem/public-key.pem'),
        sandbox: true,
        signType: 'RSA2'
    });


    var params = ali.appPay({
        subject: request.body.body,
        body: request.body.body,
        outTradeId: outTradeId,
        timeout: '10m',
        amount: request.body.money,
        goodsType: '0'
    });
    console.log(params);
    response.json({
        orderInfo: params
    });
});

router.post('/paycallback', (request, response) => {
    var data = request.body;
    console.log(request.body);
    console.log('付款...');
    if (data.trade_status === "TRADE_SUCCESS") {
        let res = request.body;
        console.log('完成...');
        response.json({
            msg: 'success'
        });
    }
});

router.post('/paysuccess', (request, response) => {
    response.json({ msg: '支付成功' });
});


module.exports = router;
