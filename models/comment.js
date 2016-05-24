var settings = require('../settings');
var mongodb = require('mongodb').Db;
var ObjectID = require('mongodb').ObjectID;

function Comment(_id, comment) {
   this._id = _id;
   this.comment = comment;
}

// save a comment
Comment.prototype.save = function(callback) {
   var comment = this.comment;
   var _id = this._id;

   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      // read a set of posts
      db.collection('posts', function (err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
         // search post by name, time and title
         // then add a comment into the set of comments
         collection.update({
            "_id": new ObjectID(_id)
         }, {
           $push: {"comments": comment}
         }, function (err) {
            db.close();
            if (err) {
               return callback(err);
            }
            callback(null);
         });
      });
   });
};

module.exports = Comment;
