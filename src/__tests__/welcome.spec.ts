import welcomeCommand from '../SlashCommands/server/welcome';
import WelcomeModel from '../assets/utils/models/Welcome';
import { nextStep } from '../SlashCommands/server/subcommands/welcome/src/setter/setCustom';
import { ExtendedInteraction } from '../typings/SlashCommand';

jest.mock('../assets/utils/models/Welcome', () => {
    return {
        findOne: jest.fn(),
        save: jest.fn(),
    };
});
jest.mock('../SlashCommands/server/subcommands/welcome/welcomeConfig');

// Ensure that you cast the mocked functions to jest.Mock
const mockFindOne = WelcomeModel.findOne as jest.Mock;

const createMockInteraction = (commandName: string, isGuild: boolean = true): ExtendedInteraction => {
    return {
        commandName,
        options: {
            getSubcommand: jest.fn().mockReturnValue('configure'),
        },
        reply: jest.fn(),
        deferReply: jest.fn(),
        guild: isGuild ? { id: 'someGuildId' } : null,
        channel: { type: 'GUILD_TEXT' },
    } as unknown as ExtendedInteraction;
};

describe('Welcome Command', () => {
    beforeEach(() => {
        mockFindOne.mockClear();
    });

    it('should send an error message when not in a guild', async () => {
        const interaction = createMockInteraction('welcome', false);

        await welcomeCommand.run({ interaction });

        expect(interaction.reply).toHaveBeenCalledWith('This command can only be used in a server.');
    });

    it('should configure the welcome message when in a guild and data does not exist', async () => {
        const interaction = createMockInteraction('welcome');
        mockFindOne.mockResolvedValueOnce(null);

        await welcomeCommand.run({ interaction });

        expect(mockFindOne).toHaveBeenCalledWith({ serverId: 'someGuildId' });
        expect(nextStep).toHaveBeenCalled();
        // You can add more specific assertions for nextStep if necessary
    });

    it('should configure the welcome message when in a guild and data exists', async () => {
        const interaction = createMockInteraction('welcome');
        mockFindOne.mockResolvedValueOnce({ existing: 'data' });

        await welcomeCommand.run({ interaction });

        expect(WelcomeModel.findOne).toHaveBeenCalledWith({ serverId: 'someGuildId' });
        expect(nextStep).toHaveBeenCalled();
        // You can add more specific assertions for nextStep if necessary
    });

    // You can add more test cases as needed
});
