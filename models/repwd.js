var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId;
var repwdSchema = new Schema({
    uid: Number,
    createdata: {
        type: Date,
        default: Date.now
    },
    outdate: {
        type: Date
    },
	isvalid:{ type: Number, default: -1 },
});
//logintype 0 wu ´ú±íÔ­ÉúÌ¬ÕËºÅ 1Î¢²©
module.exports = mongoose.model('Repwd', repwdSchema);