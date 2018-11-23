var mongoose = require("mongoose");
var User = require("../models/user");
var Position = require("../models/position");

async function find_nearby_friends(position, dist) {
    console.log('Position user - '+position.user);
    
    let friends_positions = await Position.find(
        { user: { $ne: position.user},
          loc:
            { $near:
               {
                 $geometry: position.loc,
                 $minDistance: 0,
                 $maxDistance: dist
               }
            }
        }, {_id: 0, created: 0, __v: 0 }
     ).populate('user', {userName: 1, _id: 0}).exec()

    friends = friends_positions.map(element => {
        let username = element.user.userName 
        let lat = element.loc.coordinates[0]
        let lon = element.loc.coordinates[1]
        return {username: username, longitude: lon, latitude: lat}
         
    })
    return friends
}

async function login(username,password,longitude,latitude,distance) {
    var user = await User.findOne({ userName: username }).exec()
    result = {msg: "wrong username or password", status: 403}
    if (user==null){
        return result;
    }
    salted_password = 'hash_me_and_add_some_salt '+password
    if (user.password == salted_password) {
        const position = await Position.findOneAndUpdate( 
            { user: user._id },
            { loc: { 
                type: "Point", 
                coordinates: [latitude, longitude] }
                , created: Date.now() },
            { upsert: true, new : true }          
            ).exec();
        let friends = await find_nearby_friends(position,distance);
        result = {friends: friends}
    } 
    return result

}


module.exports = {
    login: login,
  }