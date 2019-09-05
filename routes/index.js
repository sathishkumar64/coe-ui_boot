var express = require('express');
var router = express.Router();
const httpClient = require("../services/httpClient");
const constants = require("../utils/constants");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/home');
});

router.get('/home', function (req, res, next) {
  console.log(constants.COUNTRY_HOST + constants.COUNTRY_PORT + constants.COUNTRY_PATH);
  httpClient.get(constants.COUNTRY_HOST, constants.COUNTRY_PORT, constants.COUNTRY_PATH).then(countrys => {
    res.render('index', {
      countrys: countrys
    });
  }).catch(err => {
    res.render('index', {
      countrys: []
    });
  });
});

router.get('/about', function (req, res, next) {
  res.render('about');
});

router.get('/schools', function (req, res, next) {
  var source = req.query.source;
  if(!source){
    source = "top-nav";
  }
  httpClient.get(constants.SCHOOL_HOST, constants.SCHOOL_PORT, constants.PATH_ALL_SCHOOL).then(schools => {
    res.render('schools', {
      data: schools,
      source : source  
    });
  }).catch(err => {
    res.render('schools', {
      data: [] ,
      source : source  
    });
  });
});

router.post("/add-school", function (req, res, next) {
  var schoolId = req.body.sid;
  var schoolname = req.body.sname;
  var eduMode = req.body.eduMode;
  var address = req.body.address;
  var state = req.body.state;
  var city = req.body.city;

  var payload = {
    "schoolId": schoolId,
    "schoolname": schoolname,
    "eduMode": eduMode,
    "address": {
      "address": address,
      "state": state,
      "city": city
    }
  }

  httpClient.post(constants.SCHOOL_HOST, constants.SCHOOL_PORT, constants.PATH_ADD_SCHOOL, JSON.stringify(payload)).then(() => {
    res.redirect('/schools?source=add-school');
  }).catch(err => {
    res.render("error" , {
      message : "Application failed to add school.",
      error : err
    });
  });
});

router.post('/search-school', function (req, res, next) {
  console.log(constants.PATH_SEARCH_SCHOOL_BY_NAME + encodeURI(schoolname));
  var schoolname = req.body.sname;
  httpClient.get(constants.SCHOOL_HOST, constants.SCHOOL_PORT, constants.PATH_SEARCH_SCHOOL_BY_NAME + encodeURI(schoolname)).then(school => {
    res.render('schools', {
      data: [school],
      source: "search-school"
    });
  }).catch(err => {
    res.render('schools', {
      data: [],
      source: "search-school"
    });
  });
});

router.get('/students', function (req, res, next) {
  console.log(constants.STUDENT_HOST + constants.STUDENT_PORT + constants.PATH_ALL_STUDENTS)
  var source = req.query.source;
  if(!source){
    source = "top-nav";
  }
  httpClient.get(constants.STUDENT_HOST, constants.STUDENT_PORT, constants.PATH_ALL_STUDENTS).then(students => {
    res.render('students', {
      data: students,
      source : source,
      studentAppInfo : "",
      jmsMessage : ""
    });
  }).catch(err => {
    res.render('students', {
      data: [],
      source : source,
      studentAppInfo : "",
      jmsMessage : ""
    });
  });
});

router.post("/add-student", function (req, res, next) {
  var studentId = req.body.stuid;
  var studentName = req.body.stuname;
  var className = req.body.className;
  var schoolname = req.body.schName;

  var payload = {
    "studentId": studentId,
    "studentName": studentName,
    "className": className,
    "schoolname": schoolname
  }

  httpClient.post(constants.STUDENT_HOST, constants.STUDENT_PORT, constants.PATH_ADD_STUDENT, JSON.stringify(payload)).then(() => {
    res.redirect('/students?source=add-student');
  }).catch(err => {
    res.render("error" , {
      message : "Application failed to add Student.",
      error : err
    });
  });
});

router.post('/search-students', function (req, res, next) {
  var schoolname = req.body.sname;
  console.log(constants.SCHOOL_HOST, constants.SCHOOL_PORT, constants.PATH_SEARCH_STUDENTS_BY_SCHOOL + encodeURI(schoolname))
  httpClient.get(constants.SCHOOL_HOST, constants.SCHOOL_PORT, constants.PATH_SEARCH_STUDENTS_BY_SCHOOL + encodeURI(schoolname)).then(students => {
    if(!students.studentInfo || !students.studentInfo.listStudent){
      listStudent = [];
    }else{
      listStudent = students.studentInfo.listStudent;
    }

    var studentAppInfo;
    if(!students.studentInfo || !students.studentInfo.studentAppInfo){
      studentAppInfo = '';
    }else{
      studentAppInfo = students.studentInfo.studentAppInfo;
    }

    var jmsMessage;

    if(!students.jmsMessage){
      jmsMessage = '';
    }else{
      jmsMessage = students.jmsMessage;
    }

    res.render('students', {
      data: listStudent ,
      source: "search-students",
      studentAppInfo : studentAppInfo,
      jmsMessage : jmsMessage
    });
  }).catch(err => {
    res.render('students', {
      data: [],
      source : "search-students" ,
      studentAppInfo : "",
      jmsMessage : ""
    });
  });
});

router.get('/health-check' , function(req , res , next ){
  res.json({status: 'UP'});
});

module.exports = router;