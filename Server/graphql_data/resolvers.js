var { DateTime } = require('@okgrow/graphql-scalars');
var userFacade = require("../facades/userFacade");
var blogFacade = require("../facades/blogFacade");

const resolvers = {

    DateTime,

    Query: {

        getUserById: (root, {id}) => {
            return userFacade.findById(id);
        },

        getUserByUserName: (root, {userName}) => {
            return userFacade.findByUsername(userName);
        },

        getAllUsers: () => {
            return userFacade.getAllUsers();
        },

        getLocationBlogById: (root, {id}) => {
            return blogFacade.findById(id);
        },

        getLocationBlogByInfo: (root, {info}) => {
            return blogFacade.findByInfo(info);
        },

        getAllLocationBlogs: () => {
            return blogFacade.getAllBlogs();
        }
        
    }
};

module.exports = resolvers;