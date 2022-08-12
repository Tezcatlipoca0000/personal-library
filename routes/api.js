/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      book = new Schema({
        title: {type: String, required: true},
        comments: [String],
        commentcount: Number
      }),
      Book = mongoose.model('Book', book);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, docs) => {
        err ? res.send('no book exists') : res.json(docs);
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title,
          newBook = new Book({
            title: title,
            comments: [],
            commentcount: 0
          });
      newBook.save((err, data) => {
        err ? res.send('missing required field title') : res.json({_id: data._id, title: data.title});
      });
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      if (!bookid) {
        res.send('_id missing');
      } else {
        Book.findOne({_id: bookid}, (err, doc) => {
          console.log('get w/_id result', bookid, err, doc);
          (err || doc === null) ? res.send('no book exists') : res.json({_id: bookid, title: doc.title, comments: doc.comments});
        });
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      Book.find({_id: bookid}, (err, doc) => {

      });
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
