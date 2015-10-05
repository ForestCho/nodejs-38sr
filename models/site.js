var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.ObjectId;
var mryjSchema = new Schema(
{
		sid:Number, 		
        sdomain:String,
        sname:String,
        sbrief:String,
        spic:String,
        create_at:{ type:Date,default:Date.now}
}
);

module.exports = mongoose.model('Site',mryjSchema);
 