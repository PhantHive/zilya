import mongoose, { Schema } from 'mongoose';

const phearionSchema = new Schema({
	userId: String,
	mcNick: String,
	daily: Number,
	lastDaily: Number,
	pheaCoins: Number,
	discoins: Number,
	properties: Array,
});

phearionSchema.statics.findOneOrCreate = async function findOneOrCreate(
	this: mongoose.Model<any>,
	filter: mongoose.FilterQuery<any>,
	doc: mongoose.Document,
) {
	const one = await this.findOne(filter);
	return one || this.create(doc);
};

const PhearionModel = mongoose.connection.useDb('phearion').model('banks', phearionSchema);

export default PhearionModel;
