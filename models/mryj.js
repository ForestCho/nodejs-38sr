var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.ObjectId;
var mryjSchema = new Schema(
{
		mid:Number, 
        content:String,
        create_at:{ type:Date,default:Date.now}
}
); 

module.exports = mongoose.model('Mryj',mryjSchema);
 