const
    express = require('express'),
    router = express.Router(),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('mongo:27017/familychat'),
    bcrypt = require('bcrypt');

const userCollection = db.get('users');

function User() { }

User.prototype = {
    find: function (user = null, callback) {
        userCollection.find({ Username: user }, function (err, result) {
            if (err) throw err;
            if (result.length) {
                callback(result[0]);
            }
            else {
                callback(null);
            }
        });
    },

    create: function (body, callback) {
        this.find(body.Username.toLowerCase(), function (user) {
            if(user) {
                callback(null);
            }
            else {
                let pw = body.Password;
                bcrypt.hash(pw, 10, function (err, hash) {
                    body.Password = hash;

                    var data = [];
                    for (const prop in body) {
                        if (body.hasOwnProperty(prop)) {
                            data.push(body[prop]);
                        }
                    }

                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                    var dateTime = date + ' ' + time;

                    var created_user = {
                        FirstName: data[0].toLowerCase(),
                        LastName: data[1].toLowerCase(),
                        Username: data[2].toLowerCase(),
                        Password: data[3],
                        Email: data[4].toLowerCase(),
                        DataCreated: dateTime,
                        LastLogin: dateTime,
                        ProfilePic: ``,
                        OnlineStatus: '1',
                        FamilyID: ``
                    }

                    console.log(`==============CREATED USER==============`);
                    console.log(created_user);

                    userCollection.insert(created_user, function(err){
                        if (err) throw err;
                        callback(created_user.Username);
                    });
                });
            }
        });
    },

    login: function (username, password, callback) {
        this.find(username, function (user) {
            if (user) {
                bcrypt.compare(password, user.Password, function (err, result) {
                    if (result) {

                        var today = new Date();
                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                        var dateTime = date + ' ' + time;

                        userCollection.update({Username: username}, {$set:{'LastLogin': dateTime, 'OnlineStatus': 1}});
                        callback(user);
                        return;
                    }
                    else {
                        callback(null);
                    }
                });
            }
            else {
                callback(null);
            }
        });
    }
};

module.exports = User;