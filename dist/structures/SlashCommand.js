"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashCommand = void 0;
class SlashCommand {
    name;
    description;
    run;
    subcommands;
    constructor(commandOptions) {
        Object.assign(this, commandOptions);
        if (this.subcommands) {
            this.subcommands = this.subcommands.map(subcommand => new SlashCommand(subcommand));
        }
    }
}
exports.SlashCommand = SlashCommand;
