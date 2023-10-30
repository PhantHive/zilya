import mongoose, { Schema } from 'mongoose';
import type { IRankDocument } from '../../../typings/MongoTypes';

const rankSchema = new Schema<IRankDocument>({
	serverId: { type: String, required: true },
	userId: { type: String, required: true },
	xpMsg: { type: Number, required: true },
	levelMsg: { type: Number, required: true },
	rankMsg: { type: Number, required: true },
	xpVocal: { type: Number, required: true },
	levelVocal: { type: Number, required: true },
	rankVocal: { type: Number, required: true },
});

rankSchema.statics.findOneOrCreate = async function findOneOrCreate(
	this: mongoose.Model<IRankDocument>,
	filter: mongoose.FilterQuery<IRankDocument>,
	doc: mongoose.Document,
) {
	const one = await this.findOne(filter);
	return one ?? await this.create(doc);
};

const RankModel = mongoose.connection.useDb('rank').model('ranks', rankSchema);

export default RankModel;
