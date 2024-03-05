const { model, Schema } = require('mongoose');
const settingSchema = new Schema({
	Guild: String,
	Aichannelid: String,
	Reactoption: Boolean,
});
module.exports = model('setting', settingSchema);