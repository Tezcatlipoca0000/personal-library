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
      Book.deleteMany({}, (err) => {
        err ? res.send('error deleting') : res.send('complete delete successful');
      });
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      Book.findOne({_id: bookid}, (err, doc) => {
        console.log('get w/_id result', bookid, err, doc);
        (err || !doc) ? res.send('no book exists') : res.json({_id: bookid, title: doc.title, comments: doc.comments});
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send('missing required field comment');
      } else {
        Book.findOne({_id: bookid}, (err, doc) => {
          if (err || !doc) {
            res.send('no book exists')
          } else {
            doc.comments.push(comment);
            doc.commentcount++;
            doc.save((err, data) => {
              console.log('the data saved after commenting ', data);
              err ? res.send('error saving') : res.json({_id: bookid, title: data.title, comments: data.comments});
            });
          }
        });
      }
      
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      Book.findOne({_id: bookid}, (err, doc) => {
        (err || !doc) ? res.send('no book exists') : res.send('delete successful');
      });
      //if successful response will be 'delete successful'
    });
  
};
