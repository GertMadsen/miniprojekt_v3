const expect = require("chai").expect;
const dbSetup = require("..//dbSetup");

var TEST_DB_URI = require("../settings").TEST_DB_URI;
var MOCHA_TEST_TIMEOUT = require("../settings").MOCHA_TEST_TIMEOUT

var LocationBlog = require("../models/LocationBlog.js");
var User = require("../models/user");
var Position = require("../models/position");

var userFacade = require("../facades/userFacade");
var blogFacade = require("../facades/blogFacade");

const fetch = require("node-fetch");
const http = require('http')
const app = require('../app');

var server = null;
const TEST_PORT = 3456;

function positionCreator(lon,lat,userId){
  var posDetail = {user:userId,loc:{coordinates:[lon,lat]}};
  var position = new Position(posDetail);
  return position.save();
}


describe('Testing REST API', function () {
  
/* Connect to the TEST-DATABASE */
before(async function(){
  dbSetup.setDbUri(TEST_DB_URI);
  await dbSetup.connect();   
  server = http.createServer(app);
  await server.listen(TEST_PORT);
  this.timeout(Number(MOCHA_TEST_TIMEOUT)) 
})

after(function (done) {
  server.close();
  done();
});

var users = [];
var blogs = [];
var positions = [];
/* Setup the database in a known state (2 users) before EACH test */
beforeEach(async function () {
  
  // await User.collection.drop();
  // await LocationBlog.collection.drop();
  // await Position.collection.drop();

  await User.deleteMany({});
  await LocationBlog.deleteMany({});
  await Position.deleteMany({});
  //await Position.collection.createIndex( { loc : "2dsphere" } )

  await Promise.all([
    new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test", email: "a@b.dk" }).save(),
    new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test", email: "b@b.dk" }).save(),
    new User({ firstName: "Janne", lastName: "Wonnegut", userName: "jw", password: "test", email: "c@b.dk" }).save(),
  ])
  users = await userFacade.getAllUsers();
  
  await Promise.all([
    new LocationBlog({ info: "Cool Place", pos: { longitude: 26, latitude: 28 }, author: users[0]._id }).save(),
    new LocationBlog({ info: "Another Cool Place", pos: { longitude: 56, latitude: 56 }, author: users[0]._id }).save(),
  ])
  blogs = await blogFacade.getAllBlogs();

  positions = await Promise.all( [
    positionCreator(10, 11, users[0]._id),
    positionCreator(11, 12, users[1]._id),
    positionCreator(11, 13, users[2]._id)
  ])

})


  it('Testing server connection', function () {
    expect(server.listening).to.be.true;
  });

  it('Testing /users REST endpoint (GET)', async () => { 
    const url = 'http://localhost:' + TEST_PORT + '/api/users';
    const res = await fetch(url).then(res => res.json());  
    expect(res.length).to.be.equal(3);
  });

  it('Testing /user/<id> REST endpoint (GET)', async () => {
    var user = await userFacade.findByUsername("kw");
    const url = 'http://localhost:' + TEST_PORT + '/api/user/'+ user._id;
    const res = await fetch(url).then(res => res.json());
      expect(res.userName).to.be.equal("kw");
  });

  it('Testing /locationblogs REST endpoint (GET)', async () => {
    const url = 'http://localhost:' + TEST_PORT + '/api/locationblogs';
    const res = await fetch(url).then(res => res.json());
    expect(res.length).to.be.equal(2);
  });

  it('Testing /locationblog/<id> REST endpoint (GET)', async () => {
    var blog = await blogFacade.findByInfo("Cool Place");
    const url = 'http://localhost:' + TEST_PORT + '/api/locationblog/' + blog._id;
    const res = await fetch(url).then(res => res.json());
      expect(res.info).to.be.equal("Cool Place");
  });

  it('Testing /api/login REST endpoint (POST) - Wrong User', async () => {
    const data = {username: "kw", password: "test", latitude: 13, longitude: 11, distance: 1000000}
    const url = 'http://localhost:' + TEST_PORT + '/api/login';
    const res = await fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers:{
        'Origin': '',
        'Content-Type': 'application/json',
        'Accept': 'application/json'     
      }
    })
    .then(res => res.json())
    console.log(res)
  });  

});