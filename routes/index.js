var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  var sess = req.session; //用这个属性获取session中保存的数据，而且返回的JSON数据
  if (sess.isLogin) {     //已经登录，正常显示
    if(sess.userType == "student"){
      console.log("index: /");
        res.render("index", { 
          title: "土豆选课系统",
          myName: sess.userName,
          mySex: sess.userSex,
          myClass: sess.userClass,
          myID: sess.userID,
          image: sess.userSex == "男" ? "images/hg.jpg" : "images/xyjy.jpg"
      });
    } else if(sess.userType == "teacher"){
        console.log("index: teacher");
        res.redirect("/teacher");
      }
      else if(sess.userType == "admin"){
        console.log("index: admin");
        res.redirect("/admin");
      }
      else{
        console.log("index: login type");
        sess.isLogin   = false;
        sess.userName  = "";
        sess.userID    = "";
        sess.userType  = "";
        sess.userSex   = "";
        sess.userClass = "";
        res.redirect("/login");
      }
  } else {                //未登录，初始化session，然后跳转到login
    console.log("index: login");
    sess.isLogin   = false;
    sess.userName  = "";
    sess.userID    = "";
    sess.userType  = "";
    sess.userSex   = "";
    sess.userClass = "";
    sess.userCollege = "";
    res.redirect("/login");
  }
  res.end();
});

module.exports = router;


