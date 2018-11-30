
var  resolvers = require('./resolvers');
var { makeExecutableSchema } = require('graphql-tools');


const typeDefs = `
    scalar DateTime
    
    type Job {
        type: String
        company: String
        companyUrl: String
    }

    type User {
        id: ID
        userName: String
        firstName: String
        lastName: String
        password: String
        job: [Job]
        created: DateTime
        lastUpdated: DateTime       
    }
    
    type Pos {
        longitude: Float
        latitude: Float
    }

    type LocationBlog {
        id: ID
        info: String
        img: String
        pos: Pos
        author: ID
        likedBy: [ID]
        created: DateTime
        lastUpdated: DateTime 
    }

    type Query {
        getUserById(id: ID!): User
        getUserByUserName(userName: String!): User
        getAllUsers: [User]
        getLocationBlogById(id: ID!): LocationBlog
        getLocationBlogByInfo(info: String!): LocationBlog
        getAllLocationBlogs: [LocationBlog]
        
    }

  `;

const schema = makeExecutableSchema({ typeDefs, resolvers});


module.exports = { schema };