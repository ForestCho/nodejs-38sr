var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.ObjectId;
var likeSchema = new Schema(
{
	uid:Number, 
	tid:Number,
	create_date:{ type:Date,default:Date.now} 
}); 

module.exports = mongoose.model('Like',likeSchema);
