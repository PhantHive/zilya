import LM from '../assets/utils/models/Logger';
import PM from '../assets/utils/models/Pheabank';
import RM from '../assets/utils/models/Rank';
import WM from '../assets/utils/models/Welcome';

import { Document, FilterQuery, Model } from 'mongoose';

// Document
interface LoggerDocument extends Document {
    serverId: string,
    notifType: string,
    logChannel: string,
    color: string
}

interface PheabankDocument extends Document {
    userId: string,
    mcNick: string,
    daily: number,
    lastDaily: number,
    pheaCoins: number,
    discoins: number,
    properties: string[]
}

interface RankDocument extends Document {
    serverId: string,
    userId: string,
    xpMsg: number,
    levelMsg: number,
    rankMsg: number,
    xpVocal: number,
    levelVocal: number,
    rankVocal: number
}

interface WelcomeDocument extends Document {
    serverId: string,
    channelId: string,
    theme: number, //image category
    color: string, //color,
    isEdit: boolean
}


// Model
interface LoggerModel extends Model<LoggerDocument> {
    findOneOrCreate: (
        this: Model<LoggerDocument>,
        filter: FilterQuery<LoggerDocument>,
        doc: LoggerDocument
    ) => Promise<LoggerDocument>;
}

interface PheabankModel extends Model<PheabankDocument> {
    findOneOrCreate: (
        this: Model<PheabankDocument>,
        filter: FilterQuery<PheabankDocument>,
        doc: PheabankDocument
    ) => Promise<PheabankDocument>;
}

interface RankModel extends Model<RankDocument> {
    findOneOrCreate: (
        this: Model<RankDocument>,
        filter: FilterQuery<RankDocument>,
        doc: RankDocument
    ) => Promise<RankDocument>;
}

interface WelcomeModel extends Model<WelcomeDocument> {
    findOneOrCreate: (
        this: Model<WelcomeDocument>,
        filter: FilterQuery<WelcomeDocument>,
        doc: WelcomeDocument
    ) => Promise<WelcomeDocument>;
}


// Export
export default {
    WelcomeModel: WM as WelcomeModel,
    LoggerModel: LM as LoggerModel,
    PheabankModel: PM as PheabankModel,
    RankModel: RM as RankModel
}