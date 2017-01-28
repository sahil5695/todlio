var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
  title: String,
  note: String,
  note_date: Number,
  user:{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Article', ArticleSchema);
