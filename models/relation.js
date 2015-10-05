var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = mongoose.ObjectId;
var relationSchema = new Schema(
{
	uid:Number, 
	fuid:Number,
	create_date:{ type:Date,default:Date.now}, 
	_uid_info:{ type: Schema.Types.ObjectId, ref:'User'} ,
	_fuid_info:{ type: Schema.Types.ObjectId, ref:'User'} 
}); 

module.exports = mongoose.model('Relation',relationSchema);
