var settings = require('../settings');
var mongodb = require('mongodb').Db;
var ObjectID = require('mongodb').ObjectID;

function Post(name, title, tags, post) {
   this.name = name;
   this.title = title;
   this.tags = tags;
   this.post = post;
}

// save a blog/post and it's relative information
Post.prototype.save = function(callback) {
   var date = new Date();
   // save time in detail
   var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +
      date.getDate() + " " + date.getHours() + ":" +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
   }
   // save a blog/post
   var post = {
      name: this.name,
      time: time,
      title:this.title,
      tags: this.tags,
      post: this.post,
      comments: [],
      pv: 0
   };
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      // read/fetch the set of posts
      db.collection('posts', function (err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
      // insert blog/post into the set
         collection.insert(post, {
            safe: true
         }, function (err) {
            db.close();
            if (err) {
               // err! return err
               return callback(err);
            }
            // return err as null
            callback(null);
         });
      });
   });
};

// read/fetch all the blogs/posts and their relative information
Post.getAll = function(name, callback) {
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      // read/fetch the set of posts
      db.collection('posts', function(err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
         var query = {};
         if (name) {
            query.name = name;
         }
         // search the blog/post based on the object of query
         collection.find(query).sort({
            time: -1
         }).toArray(function (err, docs) {
         db.close();
         if (err) {
            // err! return err
            return callback(err);
         }
         // success! return a set of blogs/posts
         callback(null, docs);
         });
      });
   });
};

// read/fetch one blog/post
Post.getOne = function(_id, callback) {
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      // read/fetch the set of blogs/posts
      db.collection('posts', function (err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
         // search a blog/post based on the name, time and title
         collection.findOne({
         "_id": new ObjectID(_id)
         }, function (err, doc) {
            if (err) {
               db.close();
               return callback(err);
            }
            if (doc) {
               // each visit add pv by 1
               collection.update({
                  "_id": new ObjectID(_id)
               }, {
                  $inc: {"pv": 1}
               }, function (err) {
                  db.close();
                  if (err) {
                    return callback(err);
                  }
               });
               // return the blog/post
               callback(null, doc);
            }
         });
      });
   });
};

// read/fetch original content of a post
Post.edit = function(_id, callback) {
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      // read the set of posts
      db.collection('posts', function (err, collection) {
      if (err) {
         db.close();
         return callback(err);
      }
      // search a post based on the name, time and title
      collection.findOne({
         "_id": new ObjectID(_id)
      }, function (err, doc) {
         db.close();
         if (err) {
            return callback(err);
         }
         // return the content of the specified post
         callback(null, doc);
         });
      });
   });
};

// update a post and the relative information
Post.update = function(_id, post, callback) {
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      // read/fetch the set of posts
      db.collection('posts', function (err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
         // update the content of the specified post
         collection.update({
            "_id": new ObjectID(_id)
         }, {
            $set: {post: post}
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

// delete a post
Post.remove = function(_id, callback) {
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      // read the set of posts
      db.collection('posts', function (err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
         // search a post based on the name, time and title. Then delete it
         collection.remove({
            "_id": new ObjectID(_id)
         }, {
            w: 1
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

// Return the archive information of all posts
Post.getArchive = function(callback) {
   // open database
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      // read the set of posts
      db.collection('posts', function (err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
         // return a object contains name, time, title and pv
         collection.find({}, {
            "name": 1,
            "time": 1,
            "title": 1,
            //"pv": 1,
            //"comments": 1
         }).sort({
            time: -1
         }).toArray(function (err, docs) {
            db.close();
            if (err) {
               return callback(err);
            }
            callback(null, docs);
         });
      });
   });
};

// Return all tags
Post.getTags = function(callback) {
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      db.collection('posts', function (err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
         // use distinct to pick out the unique tag name
         collection.distinct("tags", function (err, docs) {
            db.close();
            if (err) {
               return callback(err);
            }
            callback(null, docs);
         });
      });
   });
};

// Return all posts which contain the specified tag
Post.getTag = function(tag, callback) {
   mongodb.connect(settings.url, function (err, db) {
      if (err) {
         return callback(err);
      }
      db.collection('posts', function (err, collection) {
         if (err) {
            db.close();
            return callback(err);
         }
         // search all posts in the specified tag
         // then return object contains name, time and title
         collection.find({
            "tags": tag
         }, {
            "time": 1,
            "title": 1,
            "pv": 1,
            "comments": 1
         }).sort({
            time: -1
         }).toArray(function (err, docs) {
            db.close();
            if (err) {
               return callback(err);
            }
            callback(null, docs);
         });
      });
   });
};

module.exports = Post;
