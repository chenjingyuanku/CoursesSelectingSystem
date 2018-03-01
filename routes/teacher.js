var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  var sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
  if (sess.isLogin) {
    //已经登录，正常显示
    if (sess.userType == "teacher") {
        console.log("teacher: teacher");
      res.render("teacher", {
        title: "土豆选课系统",
        myName: sess.userName,
        mySex: sess.userSex,
        myID: sess.userID,
        myCollege: sess.userCollege,
        image: sess.userSex == "男" ? "images/lyl.jpg" : "images/kt.jpg"
      });
    } else if (sess.userType == "student") {
        console.log("teacher: /");
        res.redirect("/");
      } else if (sess.userType == "admin") {
        console.log("teacher: admin");
        res.redirect("/admin");
      } else {
        console.log("teacher: login type");
        sess.isLogin = false;
        sess.userName = "";
        sess.userID = "";
        sess.userType = "";
        sess.userSex = "";
        sess.userClass = "";
        sess.userCollege = "";
        res.redirect("/login");
      }
  } else {
    //未登录，初始化session，然后跳转到login
    console.log("teacher: login");
    sess.isLogin = false;
    sess.userName = "";
    sess.userID = "";
    sess.userType = "";
    sess.userSex = "";
    sess.userClass = "";
    res.redirect("/login");
  }
  res.end();
});

module.exports = router;
