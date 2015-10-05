var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.ObjectId;
var zymryjSchema = new Schema(
{
		zyid:Number, 
        cncontent:String,
        encontent:String,
        img:String,
        create_at:{ type:Date,default:Date.now}
}
); 

module.exports = mongoose.model('Zymryj',zymryjSchema);
 