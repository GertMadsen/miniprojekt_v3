var express = require('express');
var router = express.Router();

var blogFacade = require("../facades/blogFacade");
// var LocationBlog = require("../models/LocationBlog.js");
var userFacade = require("../facades/userFacade");
// var User = require("../models/user");
var loginFacade = require("../facades/loginFacade");


/* GET home page. */
router.get('/', async function(req, res, next) {
  var users = await userFacade.getAllUsers();
  var blogs = await blogFacade.getAllBlogs();
  var userAmount = users.length;
  var blogAmount = blogs.length;
  res.render('index', { title: 'Welcome to my Mini Project.', userAmount, blogAmount });
});

/* GET all users page. */
router.get('/api/users', async function(req, res, next) {
  var users = await userFacade.getAllUsers();
  res.json(users);
});

/* GET user by id page. */
router.get('/api/user/:userId', async function(req, res, next) {
  var userId = req.param("userId"); 
  var user = await userFacade.findById(userId);
  res.json(user);
});

/* GET all blogs page. */
router.get('/api/locationblogs', async function(req, res, next) {
  var blogs = await blogFacade.getAllBlogs();
  res.json(blogs);
});

/* GET blog by id page. */
router.get('/api/locationblog/:blogId', async function(req, res, next) {
  var blogId = req.param("blogId"); 
  var blog = await blogFacade.findById(blogId);
  res.json(blog);
});

/* GET blog by id page. */
router.post('/api/login', async function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var distance = req.body.distance;
  response = await loginFacade.login(username,password,longitude,latitude,distance)
  if (response.status == 403) {
    res.status(403)
  }
  res.json(response);
});



module.exports = router;

