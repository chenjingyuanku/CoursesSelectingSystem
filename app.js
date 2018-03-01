var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var mysql = require("mysql");
var index = require("./routes/index");
var users = require("./routes/users");
var login = require("./routes/login");
var teacher = require("./routes/teacher");

var app = express();
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "*****",
  database: "*****",
  port: 3306
});
connection.connect();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret",
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 10
    }
  })
);
app.use("/", index);
app.use("/users", users);
app.use("/login", login);
app.use("/teacher", teacher);

/**
 * 更改密码
 */
app.post("/change_password", function(req, res, next) {
  var sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
  var queryCmd = "";
  if (sess.isLogin) {
    switch (sess.userType) {
      case "student":
      queryCmd = 
      "UPDATE user SET password='"
      + req.body.new + 
      "' WHERE account='"
      + sess.userID +
      "' AND password='"
      + req.body.old +
      "'";
        break;
      case "teacher":
      queryCmd = 
      "UPDATE teacher SET teacher_password='"
      + req.body.new + 
      "' WHERE teacher_id='"
      + sess.userID +
      "' AND teacher_password='"
      + req.body.old +
      "'";
        break;
      case "admin":
        
        break;
    
      default:
        break;
    }
    connection.query(queryCmd,function(error, results, fields) {
      //console.log("result",results);
        if (error){
          res.send("error");
          res.end();
          throw error;
          return ;
        }
        if(results.affectedRows == 1){
          //验证更新成功
          res.send("success");
        }else{
          res.send("failed");
        }
        res.end();
      }
    );
  }else{
    res.send("error");
    res.end();
  }
});
/**
 * 获取课程
 */
app.post("/get_courses", function(req, res, next) {
  var sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
  if (sess.isLogin) {
    //已经登录，正常显示
    connection.query("SELECT course_id,course_name FROM course", function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      res.send(JSON.stringify(results));
      res.end();
    });
  }
});
/**
 * 设置最新的选课数据
 */
app.post("/set_my_courses", function(req, res, next) {
  var sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
  if (sess.isLogin) {
    var courseList = "(" + req.body.new_courses.toString() + ")";
    var queryCmd = "";
    if(req.body.new_courses.length == 0){
      queryCmd = "SELECT * FROM course WHERE 0";
    }else{
      queryCmd = "SELECT * FROM course WHERE course_id IN " + courseList;
    }
    connection.query(
      queryCmd,
      function(error, results, fields) {
        if (error) throw error;
        var col = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var min,max;
        //遍历7天
        for (let i = 0; i < 7; i++) {
          //一天12节课
          col = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          //遍历所有课程
          //判断每门课的时间是否冲突
          for (let j = 0; j < results.length; j++) {
            switch (i) {
              case 0:
                if(results[j].course_monday != "0-0"){
                  min = parseInt(results[j].course_monday.split("-")[0]);
                  max = parseInt(results[j].course_monday.split("-")[1]);
                  for (let k = min; k <= max; k++) {
                    if(col[k-1] != 1){
                      col[k-1] = 1;
                    }
                    else{
                      res.send("error");
                      res.end();
                      return;
                    }
                  }
                }
                break;
              case 1:
              if(results[j].course_tuesday != "0-0"){
                min = parseInt(results[j].course_tuesday.split("-")[0]);
                max = parseInt(results[j].course_tuesday.split("-")[1]);
                for (let k = min; k <= max; k++) {
                  if(col[k-1] != 1){
                    col[k-1] = 1;
                  }
                  else{
                    res.send("error");
                    res.end();
                    return;
                  }
                }
              }
                break;
              case 2:
              if(results[j].course_wednesday != "0-0"){
                min = parseInt(results[j].course_wednesday.split("-")[0]);
                max = parseInt(results[j].course_wednesday.split("-")[1]);
                for (let k = min; k <= max; k++) {
                  if(col[k-1] != 1){
                    col[k-1] = 1;
                  }
                  else{
                    res.send("error");
                    res.end();
                    return;
                  }
                }
              }
                break;
              case 3:
              if(results[j].course_thursday != "0-0"){
                min = parseInt(results[j].course_thursday.split("-")[0]);
                max = parseInt(results[j].course_thursday.split("-")[1]);
                for (let k = min; k <= max; k++) {
                  if(col[k-1] != 1){
                    col[k-1] = 1;
                  }
                  else{
                    res.send("error");
                    res.end();
                    return;
                  }
                }
              }
                break;
              case 4:
              if(results[j].course_friday != "0-0"){
                min = parseInt(results[j].course_friday.split("-")[0]);
                max = parseInt(results[j].course_friday.split("-")[1]);
                for (let k = min; k <= max; k++) {
                  if(col[k-1] != 1){
                    col[k-1] = 1;
                  }
                  else{
                    res.send("error");
                    res.end();
                    return;
                  }
                }
              }
                break;
              case 5:
              if(results[j].course_saturday != "0-0"){
                min = parseInt(results[j].course_saturday.split("-")[0]);
                max = parseInt(results[j].course_saturday.split("-")[1]);
                for (let k = min; k <= max; k++) {
                  if(col[k-1] != 1){
                    col[k-1] = 1;
                  }
                  else{
                    res.send("error");
                    res.end();
                    return;
                  }
                }
              }
                break;
              case 6:
              if(results[j].course_sunday != "0-0"){
                min = parseInt(results[j].course_sunday.split("-")[0]);
                max = parseInt(results[j].course_sunday.split("-")[1]);
                for (let k = min; k <= max; k++) {
                  if(col[k-1] != 1){
                    col[k-1] = 1;
                  }
                  else{
                    res.send("error");
                    res.end();
                    return;
                  }
                }
              }
                break;

              default:
                break;
            }
          }
        }
        connection.query("DELETE FROM student_course WHERE account="+sess.userID,function (err, result) {
            if(err){
              console.log('[DELETE ERROR] - ',err.message);
              return;
            }
            var values = "";
            for (let i = 0; i < req.body.new_courses.length; i++) {
              values += "('"+req.body.new_courses[i]+"','"+sess.userID+"'),";
            }
            //新列表为空时不添加课程
            if(values != "")
            {
              values = values.substring(0,values.length-1);
              console.log(values);
              connection.query("INSERT INTO student_course(course_id, account) VALUES " + values,function (err, result) {
                if(err){
                  console.log('[INSERT ERROR] - ',err.message);
                  return;
                }
                res.send("success");
                res.end();
              });
            }else{
              res.send("success");
              res.end();
            }
          });
      }
    );
  }
});
/**
 * 获取当前的选课数据
 */
app.post("/get_my_courses", function(req, res, next) {
  var sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
  if (sess.isLogin) {
    if(sess.userType == "student"){
      connection.query(
        "SELECT DISTINCT * FROM (student_course JOIN course ON course.course_id=student_course.course_id) WHERE account=" +
          sess.userID,
        function(error, results, fields) {
          if (error) throw error;
          res.send(results);
          res.end();
        }
      );
    }
    else if(sess.userType == "teacher"){
      connection.query(
        "SELECT DISTINCT * FROM course WHERE teacher_id=" +
          sess.userID,
        function(error, results, fields) {
          if (error) throw error;
          res.send(results);
          res.end();
        }
      );
    }
    else{
      res.send("error");
      res.end();
    }
  }
});
/**
 * 登陆验证
 */
app.post("/login", function(req, res, next) {
  var sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
  switch (req.body.userType) {
    case "student":
      connection.query(
        "SELECT * FROM user WHERE account=" + req.body.account,
        function(error, results, fields) {
          if (error){
            res.send("error");
            res.end();
            throw error;
            return ;
          }
          if(results.length == 0)
          {
            res.send("error");
            res.end();
            return;
          } else if (
            req.body.account == results[0].account &&
            req.body.password == results[0].password
          ) {
            //登陆成功
            sess.isLogin = true;
            sess.userType = req.body.userType;
            sess.userID = req.body.account;
            sess.userSex = results[0].sex;
            sess.userName = results[0].name;
            sess.userClass = results[0].class;
            sess.userCollege = results[0].student_college;
            res.send("success");
          } else {
            //登录失败
            sess.isLogin = false;
            sess.userType = "";
            sess.userID = "";
            sess.userSex = "";
            sess.userName = "";
            sess.userClass = "";
            sess.userCollege = "";
            res.send("failed");
          }
          res.end();
        }
      );
      break;
    case "teacher":
    connection.query(
      "SELECT * FROM teacher WHERE teacher_id=" + req.body.account,
      function(error, results, fields) {
        if (error){
          res.send("error");
          res.end();
          throw error;
          return ;
        }
        if(results.length == 0)
        {
          res.send("error");
          res.end();
          return;
        } else if (
          req.body.account == results[0].teacher_id &&
          req.body.password == results[0].teacher_password
        ) {
          //登陆成功
          sess.isLogin = true;
          sess.userType = req.body.userType;
          sess.userID = req.body.account;
          sess.userSex = results[0].teacher_sex;
          sess.userName = results[0].teacher_name;
          sess.userCollege = results[0].teacher_college;
          sess.userClass = "";
          res.send("success");
        } else {
          //登录失败
          sess.isLogin = false;
          sess.userType = "";
          sess.userID = "";
          sess.userSex = "";
          sess.userName = "";
          sess.userClass = "";
          res.send("failed");
        }
        res.end();
      }
    );
      break;
    case "admin":
      break;
    default:
      break;
  }
});
/**
 * 注销登录
 */
app.get("/logout", function(req, res, next) {
  res.clearCookie("isLogin");
  res.clearCookie("userName");
  res.clearCookie("userID");
  res.clearCookie("userType");
  res.clearCookie("userSex");
  res.clearCookie("userClass");
  req.session.destroy();
  res.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found " + req.originalUrl);
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
