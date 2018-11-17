const expect = require("chai").expect;
const dbSetup = require("../dbSetup");
var TEST_DB_URI = require("../settings").TEST_DB_URI;
var blogFacade = require("../facades/blogFacade");
var LocationBlog = require("../models/LocationBlog.js");
var userFacade = require("../facades/userFacade");
var User = require("../models/user");



describe("Testing the Blog Facade", function () {

/* Connect to the TEST-DATABASE */
before(async function(){
  // dbSetup.setDbUri(TEST_DB_URI);
  // await dbSetup.connect();   
})

var users = [];
var blogs = [];
/* Setup the database in a known state (2 users) before EACH test */
beforeEach(async function () {
  await User.deleteMany({});
  await LocationBlog.deleteMany({});

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

})


  it("Should find all blogs (Cool Place and Another Cool Place)", async function () {
    var blogs = await blogFacade.getAllBlogs();
    expect(blogs.length).to.be.equal(2);
  });

  it("Should add Yet Another Cool Place", async function () {
    var blog = await blogFacade.addBlog("Yet Another Cool Place", users[0]._id, 28, 56);
    expect(blog).to.not.be.null;
    expect(blog.info).to.be.equal("Yet Another Cool Place");
    var blogs = await blogFacade.getAllBlogs();
    expect(blogs.length).to.be.equal(3);
  });

  it("Should Find Cool Place by ID", async function () {
    var blog = await blogFacade.findById(blogs[0]._id);
    expect(blog.info).to.be.equal("Cool Place");
  });

  it("Should Find Cool Place by info", async function () {
    var blog = await blogFacade.findByInfo("Cool Place");
    expect(blog.info).to.be.equal("Cool Place");
  });

  it("Kurt and Hanne should like Cool Place", async function () {
    await blogFacade.likeLocationBlog(blogs[0]._id,users[0]._id);      
    var blog = await blogFacade.likeLocationBlog(blogs[0]._id,users[1]._id);
    expect(blog.likedByCount).to.be.equal(2);
  });


})