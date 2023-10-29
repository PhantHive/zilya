import type { Model } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import type { IWelcomeDocument } from '../../../typings/MongoTypes';

const welcomeSchema = new Schema<IWelcomeDocument>({
	serverId: { type: String, required: true },
	channelId: { type: String, required: true },
	theme: { type: Number, required: true },
	color: { type: String, required: true },
	isEdit: { type: Boolean, required: true },
});

welcomeSchema.statics.findOneOrCreate = async function findOneOrCreate(
	this: Model<IWelcomeDocument>,
	filter: mongoose.FilterQuery<IWelcomeDocument>,
	doc: IWelcomeDocument,
) {
	const one = await this.findOne(filter);
	return one ?? (await this.create(doc));
};

interface WelcomeModel extends Model<IWelcomeDocument> {
	findOneOrCreate(
		filter: mongoose.FilterQuery<IWelcomeDocument>,
		doc: IWelcomeDocument,
	): Promise<IWelcomeDocument>;
}

const WelcomeModel = mongoose.connection
	.useDb('welcome')
	.model<IWelcomeDocument, WelcomeModel>('welcomes', welcomeSchema);

export default WelcomeModel;
