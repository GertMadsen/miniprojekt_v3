var mongoose = require("mongoose");
var LocationBlog = require("../models/LocationBlog.js");

function getAllBlogs() {
    return LocationBlog.find({}).exec();
}

function addBlog(info, author, longitude, latitude) { 
    var blogDetail = { info, pos: { longitude, latitude }, author };
    var blog = new LocationBlog(blogDetail);
    return blog.save();
}

function findById(id) {
    return LocationBlog.findById({ _id:id }).exec();
  }

function findByInfo(info) {
    return LocationBlog.findOne({ info: info }).exec();
  }

async function likeLocationBlog(id, user_id) {
    var blog = await LocationBlog.findById({ _id:id }).exec();
    blog.likedBy.push(user_id);
    return blog.save();   
}


module.exports = {
    getAllBlogs: getAllBlogs,
    addBlog: addBlog,
    findById: findById,
    findByInfo: findByInfo,
    likeLocationBlog: likeLocationBlog,
  }