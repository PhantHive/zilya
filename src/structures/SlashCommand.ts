import {CommandType} from "../typings/SlashCommand";

export class SlashCommand {
    constructor(commandOptions: CommandType) {
        Object.assign(this, commandOptions);
    }
}