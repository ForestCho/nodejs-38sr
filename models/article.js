var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.ObjectId;
var articleSchema = new Schema(
{
      tid:Number,
      title:String,
      content:String,
      uid:Number,
      read_count:{ type: Number, default: 0 },
      like_count:{ type: Number, default: 0 },
      reply_count: { type: Number, default: 0 },
      post_date:{ type:Date,default:Date.now},
      _creator:{ type: Schema.Types.ObjectId, ref:'User'} 
}
); 

module.exports = mongoose.model('Article',articleSchema);
