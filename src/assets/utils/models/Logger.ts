import mongoose, { Schema } from 'mongoose';
import type { ILoggerDocument } from '../../../typings/MongoTypes';

const loggerSchema = new Schema<ILoggerDocument>({
	serverId: { type: String, required: true },
	notifType: { type: String, required: true },
	logChannel: { type: String, required: true },
	color: { type: String, required: true },
});

loggerSchema.statics.findOneOrCreate = async function findOneOrCreate(
	this: mongoose.Model<ILoggerDocument>,
	filter: mongoose.FilterQuery<ILoggerDocument>,
	doc: mongoose.Document,
) {
	const one = await this.findOne(filter);
	return one ?? await this.create(doc);
};

const LoggerModel = mongoose.connection.useDb('logger').model('logs', loggerSchema);

export default LoggerModel;
