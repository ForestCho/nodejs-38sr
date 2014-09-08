var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.ObjectId;
var messageSchema = new Schema(
{ 
	type: { type: String },
	uid: Number, 
	refuid: Number, 
	tid: Number,
	rid: Number,	
	isread: { type:Boolean,default:false},
	create_date:{ type:Date,default:Date.now} 
}); 

module.exports = mongoose.model('Message',messageSchema);
