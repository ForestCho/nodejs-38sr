var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.ObjectId;
var likeSchema = new Schema(
{
	uid:Number, 
	tid:Number,
	islike: { type:Boolean,default:true},
	create_date:{ type:Date,default:Date.now} 
}); 

module.exports = mongoose.model('Like',likeSchema);
