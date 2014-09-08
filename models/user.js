var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.ObjectId;
var userSchema = new Schema(
{
	uid:Number,
	name:String, 
	email:String, 
	pwd:String,
	signature:String,
	intro:String,
	photo:String,
	originphoto:String,
	score:Number,
	articles:[{type:Schema.Types.ObjectId,ref:'Article'}],
	create_at:{type:Date,default:Date.now},
}
);
module.exports = mongoose.model('User',userSchema);
