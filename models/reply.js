var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ReplySchema = new Schema({
	rid: Number,//id
	content: String ,
	tid: Number,
	replyid: Number,
	uid:Number, 
	ruid:Number, 
	create_at: { type: Date, default: Date.now },
	update_at: { type: Date, default: Date.now },
	_creator:{ type: Schema.Types.ObjectId, ref:'User'} ,
	content_is_html: { type: Boolean }
});
 

module.exports = mongoose.model('Reply',ReplySchema);