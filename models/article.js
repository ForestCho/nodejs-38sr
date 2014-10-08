var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.ObjectId;
var articleSchema = new Schema(
{
      tid:Number,
      title:String,
      content:String,
      uid:Number,
      type:{ type: Number, default: 0 },
      flag:{ type: Number, default: 0 },
      read_count:{ type: Number, default: 0 },
      unlike_count:{ type: Number, default: 0 },
      like_count:{ type: Number, default: 0 },
      reply_count: { type: Number, default: 0 },
      post_date:{ type:Date,default:Date.now},
      _creator:{ type: Schema.Types.ObjectId, ref:'User'} 
}
); 
//flag 1 笑话 
//flag 2 娱乐 
//flag 3 爆料
//flag 4 情感
//flag 5 囧人糗事
module.exports = mongoose.model('Article',articleSchema);
