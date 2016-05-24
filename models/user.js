var settings = require('../settings');
var mongodb = require('mongodb').Db;

function User(user) {
   this.name = user.name;
   this.password = user.password;
   this.email = user.email;
};

// read an user's data
User.get = function(name, callback) {
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         // err! Return err
         return callback(err);
      }
      // read the set of users
      db.collection('users', function (err, collection) {
         if (err) {
            db.close();
            // err! Return err
            return callback(err);
         }
         // search an user who has the specified name
         collection.findOne({
            name: name
         }, function (err, user) {
            db.close();
            if (err) {
               // err! Return err
               return callback(err);
            }
            // success! Return user's data
            callback(null, user);
         });
      });
   });
};

// write an user's data
User.prototype.save = function(callback) {
   // the required user's data
   var user = {
      name: this.name,
      password: this.password,
      email: this.email
   };
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         // err! Return err
         return callback(err);
      }
      // read the set of users
      db.collection('users', function (err, collection) {
         if (err) {
            db.close();
            // err! Return err
            return callback(err);
         }
         // insert the user's data into the set
         collection.insert(user, {
            safe: true
         }, function (err, user) {
            db.close();
            if (err) {
               // err! Return err
               return callback(err);
            }
            // success! Return the user's data
            callback(null, user[0]);
         });
      });
   });
};

module.exports = User;
