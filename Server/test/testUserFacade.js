const expect = require("chai").expect;
const dbSetup = require("../dbSetup");
var TEST_DB_URI = require("../settings").TEST_DB_URI;
var userFacade = require("../facades/userFacade");
var User = require("../models/user");


describe("Testing the User Facade", function(){

/* Connect to the TEST-DATABASE */
before(async function(){
  //  dbSetup.setDbUri(TEST_DB_URI);
  //  await dbSetup.connect();   
})

/* Setup the database in a known state (2 users) before EACH test */
beforeEach(async function(){
  await User.deleteMany({});
  await Promise.all([
    new User({ firstName: "Kurt", lastName: "Wonnegut", userName: "kw", password: "test", email: "a@b.dk" }).save(),
    new User({ firstName: "Hanne", lastName: "Wonnegut", userName: "hw", password: "test", email: "b@b.dk" }).save(),
    new User({ firstName: "Janne", lastName: "Wonnegut", userName: "jw", password: "test", email: "c@b.dk" }).save(),
  ])
  users = await userFacade.getAllUsers();
})


  it("Should find all users (Kurt and Hanne)", async function () {
    var users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(3);
  });

  it("Should Find Kurt Wonnegut by Username", async function () {
    var user = await userFacade.findByUsername("kw");
    expect(user.firstName).to.be.equal("Kurt");
  });

  it("Should Find Kurt Wonnegut by ID", async function () {

    var user = await userFacade.findById(users[0]._id);
    expect(user.firstName).to.be.equal("Kurt");
  });

  it("Should add Peter Pan", async function () {
    var user = await userFacade.addUser("Peter", "Pan", "peter", "test", "a@b.dk");
    expect(user).to.not.be.null;
    expect(user.firstName).to.be.equal("Peter");
    var users = await userFacade.getAllUsers();
    expect(users.length).to.be.equal(4);
  });

})